import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { UpdateCustomerRequest } from '../../requests/UpdateCustomerRequest'
import { CustomerService } from '../../businessLogic/customerService'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const customerId = event.pathParameters.customerId
    const userId = getUserId(event);
    const updateCustomer: UpdateCustomerRequest = JSON.parse(event.body)
    const customerService = new CustomerService()

    await customerService.updateCustomer(customerId, userId, updateCustomer);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: ''
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
