import { CustomerAccess } from '../dataLayer/customerAcess'
import { CustomerItem } from '../models/CustomerItem'
import { CreateCustomerRequest } from '../requests/CreateCustomerRequest'
import { UpdateCustomerRequest } from '../requests/UpdateCustomerRequest'
import * as uuid from 'uuid'

export class CustomerService {

    public constructor(
        private readonly customerAccess: CustomerAccess = new CustomerAccess(),
    ) { }

    public async getCustomersForUser(userId: string): Promise<CustomerItem[]> {
        return this.customerAccess.getAllCustomers(userId);
    }

    public async createCustomer(
        createCustomerRequest: CreateCustomerRequest,
        userId: string
    ): Promise<CustomerItem> {
        const itemId = uuid.v4()
        return this.customerAccess.createCustomer({
            userId: userId,
            customerId: itemId,
            name: createCustomerRequest.name,
            address: createCustomerRequest.address,
            createdAt: new Date().toISOString(),
            logo: `https://${process.env.LOGO_S3_BUCKET}.s3.amazonaws.com/${itemId}`,
        })
    }

    public async updateCustomer(
        customerId: string,
        userId: string,
        updateCustomerRequest: UpdateCustomerRequest
    ): Promise<void> {
        await this.customerAccess.updateCustomer(customerId, userId, {
            name: updateCustomerRequest.name,
            address: updateCustomerRequest.address,
        })
    }

    public async getCustomer(
        customerId: string, userId: string
    ): Promise<CustomerItem> {
        return this.customerAccess.getACustomer(customerId, userId)
    }

    public async deleteCustomer(
        customerId: string, userId: string
    ): Promise<void> {
        await this.customerAccess.deleteCustomer(customerId, userId)
    }

}
