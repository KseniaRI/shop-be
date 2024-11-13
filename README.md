# Math Squad Shop BE

This is backend service for T-Shirt Shop aplication: 
### https://d3r5s5dc64z7tm.cloudfront.net/
(FE is available at repository https://github.com/KseniaRI/nodejs-aws-shop-react). 

### It uses the following technologies:

- [AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/home.html) for defining cloud infrastructure as code
- [API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html) creates RESTful API
- [AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html) build serverless backend
- [TypeScript](https://www.typescriptlang.org/) for type checking
- [Node.js](https://nodejs.org/en) JavaScript runtime environment

> It is a microservices-based application that uses the Backend for Frontend (BFF) pattern. It is an online shop with separate backend microservices for products, carts, imports, authorization, and a dedicated  BFF service to route requests from frontend to the appropriate services.
> -	React was used for the frontend, and Nest.js for some backend services. AWS services were configured using AWS CDK.
> -	For static content hosting, Iy was used an S3 bucket and CloudFront as a CDN.
> -	To manage and expose the microservices, It was used API Gateway and Lambda functions triggered by HTTP methods (GET, POST, PUT, DELETE) or by S3 events (e.g. uploading files in S3 bucket) or by SQS events (e.g. > > messages for new records in S3).
> -	It was used SNS to create topics and email subscriptions (e.g. notifications about new data added to database)
> -	I gained experience with both DynamoDB (non-relational) and RDS (relational) databases.
> -	Authorization service was configured with a Lambda authorizer and integrated with the API Gateway for certain microservices, like administrative actions.
> -	It was also used AWS Elastic Beanstalk to deploy a Nest.js service (wrapped in a Docker container) via Beanstalk CLI.
> -	AWS CloudWatch logs helped me throughout development for troubleshooting and checking API responses.
> -	Finally, this setup permits me to integrate the React frontend and the BFF backend layer to ensure communication between frontend and microservices.

# Authorization-service

On FE app add to localStorage Basic 'authorization_token' 

# Product service
Frontend application is integrated with Product Service.

## Base URL for requests: 
- https://871xbpugrg.execute-api.eu-west-1.amazonaws.com/dev/products

### Endpoints: 

## GET requests:
- List of products: 
### `/products`
- A single product: 
### `/products/{id}`

## POST request:
### `/products`

## To start:
- First go to product-service folder 
### `cd ./product-service`

- Install dependencies:
### `npm i`

## Available Scripts

- Fill db tables with test data:
### `npm run fill-db`

- Build the project:
### `npm run build`

- Synthesize CloudFormation template: 
### `npm run synth`

- Deploy:
### `npm run delploy`

## Swagger documentation: 
`/product-service/doc/api.yaml`
You can test product-service API with Swagger https://editor.swagger.io/ 

# Import service
Frontend application is integrated with Import Service. You can upload csv files from FE.
## NB:
### Please note that CSV-parser uses the default separator `,`. If your test CSV-file has different separator (`;`, `|`, `\t` etc...) you should change it manually otherwise you will face the parse error.

### URL for GET method to recieve Signed URL: 
https://pf6r872y4h.execute-api.eu-west-1.amazonaws.com/dev/import?name=${fileName}

- First go to import-service folder 
### `cd ./import-service`

- Install dependencies:
### `npm i`

## Available Scripts
- Build the project:
### `npm run build`
- Synthesize CloudFormation template: 
### `npm run synth`
- Deploy:
### `npm run delploy`
-Test:
###  `npm run test`

# Cart-service
Look it at separate repo:  https://github.com/KseniaRI/nodejs-aws-cart-api/tree/main
