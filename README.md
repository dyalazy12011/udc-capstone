# Serverless Customer

To implement this project, you need to implement a simple customer application using AWS Lambda and Serverless framework. Search for all comments starting with the `TODO:` in the code to find the placeholders that you need to implement.

# Functionality of the application

This application will allow creating/removing/updating/fetching customer items. Each customer item can optionally have an attachment image. Each user only has access to customer items that he/she has created.

# TODO items

The application should store customer items, and each customer item contains the following fields:

* `customerId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `name` (string) - name of a customer item (e.g. "Change a light bulb")
* `address` (string) - the customer address
* `logo` (string) (optional) - a URL pointing to an image attached to a custumer item

You might also store an id of a user who created a customer item.

## Prerequisites

* <a href="https://manage.auth0.com/" target="_blank">Auth0 account</a>
* <a href="https://github.com" target="_blank">GitHub account</a>
* <a href="https://nodejs.org/en/download/package-manager/" target="_blank">NodeJS</a> version up to 12.xx 
* Serverless 
   * Create a <a href="https://dashboard.serverless.com/" target="_blank">Serverless account</a> user
   * Install the Serverless Framework’s CLI  (up to VERSION=2.21.1). Refer to the <a href="https://www.serverless.com/framework/docs/getting-started/" target="_blank">official documentation</a> for more help.
   ```bash
   npm install -g serverless@2.21.1
   serverless --version
   ```
   * Login and configure serverless to use the AWS credentials 
   ```bash
   # Login to your dashboard from the CLI. It will ask to open your browser and finish the process.
   serverless login
   # Configure serverless to use the AWS credentials to deploy the application
   # You need to have a pair of Access key (YOUR_ACCESS_KEY_ID and YOUR_SECRET_KEY) of an IAM user with Admin access permissions
   sls config credentials --provider aws --key YOUR_ACCESS_KEY_ID --secret YOUR_SECRET_KEY --profile serverless
   ```
   
# Functions to be implemented

To implement this project, you need to implement the following functions and configure them in the `serverless.yml` file:

* `Auth` - this function should implement a custom authorizer for API Gateway that should be added to all other functions.

* `GetCustomers` - should return all customers for a current user. A user id can be extracted from a JWT token that is sent by the frontend

It should return data that looks like this:

```json
{
	"items": [{
		"userId": "auth0|6366220dada0b9a91b3222e9",
		"createdAt": "2022-11-20T09:42:50.085Z",
		"address": "123 South Cloud",
		"logo": "https://serverless-capstone-dev.s3.amazonaws.com/74bf0aca-500e-46a0-b6f4-98b687b29925",
		"name": "Anna",
		"customerId": "74bf0aca-500e-46a0-b6f4-98b687b29925"
	}]
}
```

* `CreateCustomer` - should create a new customer for a current user. A shape of data send by a client application to this function can be found in the `CreateCustomerRequest.ts` file

It receives a new customer item to be created in JSON format that looks like this:

```json
{
	"userId": "auth0|6366220dada0b9a91b3222e9",
	"createdAt": "2022-11-20T09:42:50.085Z",
	"address": "123 South Cloud",
	"logo": "https://serverless-capstone-dev.s3.amazonaws.com/74bf0aca-500e-46a0-b6f4-98b687b29925",
	"name": "Anna",
	"customerId": "74bf0aca-500e-46a0-b6f4-98b687b29925"
}
```

It should return a new customer item that looks like this:

```json
{
  "item": {
    "userId": "auth0|6366220dada0b9a91b3222e9",
    "createdAt": "2022-11-20T09:42:50.085Z",
    "address": "123 South Cloud",
    "logo": "https://serverless-capstone-dev.s3.amazonaws.com/74bf0aca-500e-46a0-b6f4-98b687b29925",
    "name": "Anna",
    "customerId": "74bf0aca-500e-46a0-b6f4-98b687b29925"
  }
}
```

* `UpdateCustomer` - should update a customer item created by a current user. A shape of data send by a client application to this function can be found in the `UpdateCustomerRequest.ts` file

It receives an object that contains three fields that can be updated in a customer item:

```json
{
  "name": "Buy bread",
  "dueDate": "2019-07-29T20:01:45.424Z",
  "done": true
}
```

The id of an item that should be updated is passed as a URL parameter.

It should return an empty body.

* `DeleteCustomer` - should delete a customer item created by a current user. Expects an id of a customer item to remove.

It should return an empty body.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a customer item.

It should return a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/image.png"
}
```

All functions are already connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.

You also need to add any necessary resources to the `resources` section of the `serverless.yml` file such as DynamoDB table and S3 bucket.


# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.

This frontend should work with your serverless application once it is developed, you don't need to make any changes to the code. The only file that you need to edit is the `config.ts` file in the `client` folder. This file configures your client application just as it was done in the course and contains an API endpoint and Auth0 configuration:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

## Authentication

To implement authentication in your application, you would have to create an Auth0 application and copy "domain" and "client id" to the `config.ts` file in the `client` folder. We recommend using asymmetrically encrypted JWT tokens.

# Best practices

To complete this exercise, please follow the best practices from the 6th lesson of this course.

## Logging

The starter code comes with a configured [Winston](https://github.com/winstonjs/winston) logger that creates [JSON formatted](https://stackify.com/what-is-structured-logging-and-why-developers-need-it/) log statements. You can use it to write log messages like this:

```ts
import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')

// You can provide additional information with every log statement
// This information can then be used to search for log statements in a log storage system
logger.info('User was authorized', {
  // Additional information stored with a log statement
  key: 'value'
})
```


# Grading the submission

Once you have finished developing your application, please set `apiId` and Auth0 parameters in the `config.ts` file in the `client` folder. A reviewer would start the React development server to run the frontend that should be configured to interact with your serverless application.

**IMPORTANT**

*Please leave your application running until a submission is reviewed. If implemented correctly it will cost almost nothing when your application is idle.*

# Suggestions

To store customer items, you might want to use a DynamoDB table with local secondary index(es). A create a local secondary index you need to create a DynamoDB resource like this:

```yml

CustomerTable:
  Type: AWS::DynamoDB::Table
  Properties:
    AttributeDefinitions:
      - AttributeName: partitionKey
        AttributeType: S
      - AttributeName: sortKey
        AttributeType: S
      - AttributeName: indexKey
        AttributeType: S
    KeySchema:
      - AttributeName: partitionKey
        KeyType: HASH
      - AttributeName: sortKey
        KeyType: RANGE
    BillingMode: PAY_PER_REQUEST
    TableName: ${self:provider.environment.CUSTOMER_TABLE}
    LocalSecondaryIndexes:
      - IndexName: ${self:provider.environment.INDEX_NAME}
        KeySchema:
          - AttributeName: partitionKey
            KeyType: HASH
          - AttributeName: indexKey
            KeyType: RANGE
        Projection:
          ProjectionType: ALL # What attributes will be copied to an index

```

To query an index you need to use the `query()` method like:

```ts
await this.dynamoDBClient
  .query({
    TableName: 'table-name',
    IndexName: 'index-name',
    KeyConditionExpression: 'paritionKey = :paritionKey',
    ExpressionAttributeValues: {
      ':paritionKey': partitionKeyValue
    }
  })
  .promise()
```

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless customer application.
