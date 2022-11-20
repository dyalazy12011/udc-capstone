import { createLogger } from '../utils/logger'
import { CustomerItem } from '../models/CustomerItem'
import { CustomerUpdate } from '../models/CustomerUpdate';
import * as AWSXRay from 'aws-xray-sdk'
import * as AWS  from 'aws-sdk'

const logger = createLogger('CustomerAccess')

export class CustomerAccess {
    private documentClient: AWS.DynamoDB.DocumentClient;

    public constructor() {
        const ddbClient = AWSXRay.captureAWSClient(new AWS.DynamoDB());
        this.documentClient = new AWS.DynamoDB.DocumentClient({
            service: ddbClient
        });
    }
    
    public async createCustomer(customer: CustomerItem): Promise<CustomerItem> {
        const res = await this.documentClient
            .put({
                TableName: process.env.CUSTOMER_TABLE,
                Item: customer,
            })
            .promise();

        logger.info(res);
        return customer;
    }

    public async updateCustomer(
        customerId: string,
        userId: string,
        customer: CustomerUpdate,
    ): Promise<void> {
        const res = await this.documentClient
            .update({
                TableName: process.env.CUSTOMER_TABLE,
                Key: {
                    customerId,
                    userId
                },
                UpdateExpression:
                    'set #n = :name, address = :address',
                ExpressionAttributeValues: {
                    ':name': customer.name,
                    ':address': customer.address,
                },
                ExpressionAttributeNames: {
                    '#n': 'name',
                },
                ReturnValues: 'UPDATED_NEW',
            })
            .promise();
        logger.info(res);
    }

    public async getAllCustomers(userId: string): Promise<CustomerItem[]> {
        const result = await this.documentClient
            .query({
                TableName: process.env.CUSTOMER_TABLE,
                IndexName: process.env.CUSTOMER_USER_ID_INDEX,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId,
                }
            })
            .promise();
        
        const res = result.Items;
        logger.info(res);
        return res as CustomerItem[];
    }

    public async getACustomer(customerId: string, userId: string): Promise<CustomerItem> {
        const result = await this.documentClient
            .query({
                TableName: process.env.CUSTOMER_TABLE,
                IndexName: process.env.CUSTOMER_USER_ID_INDEX,
                KeyConditionExpression: 'customerId = :customerId and userId = :userId',
                ExpressionAttributeValues: {
                    ':customerId': customerId,
                    ':userId': userId,
                },
            })
            .promise();

        if (result.Count == 0) {
            return undefined
        }
        const item = result.Items[0];
        return item as CustomerItem;
    }

    public async deleteCustomer(customerId: string, userId: string): Promise<void> {
        const res = await this.documentClient
            .delete({
                TableName: process.env.CUSTOMER_TABLE,
                Key: {
                    customerId,
                    userId
                },
            })
            .promise();
        logger.info(res);
    }

}
