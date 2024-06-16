# MyShop-BE

This is backend service for MyShop aplication: 
### `https://d3r5s5dc64z7tm.cloudfront.net/`

(FE is available at repository https://github.com/KseniaRI/nodejs-aws-shop-react). 

### It uses the following technologies:

- [AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/home.html) for defining cloud infrastructure as code
- [API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html) creates RESTful API
- [AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html) build serverless backend
- [TypeScript](https://www.typescriptlang.org/) for type checking
- [Node.js](https://nodejs.org/en) JavaScript runtime environment

# Product service

Frontend application is integrated with Product Service.

## Base URL for requests: 
- https://npjkcn07fi.execute-api.eu-west-1.amazonaws.com/dev

### Endpoints: 

## GET requests:
- List of products: 
### `/products`
- A single product: 
### `/products/{id}`

## To start:

- First go to product-service folder 
### `cd ./product-service`

- Install dependencies:
## `npm i`

## Available Scripts

- Build the project:
## `npm run build`

- Synthesize CloudFormation template: 
### `npm run synth`

- Deploy:
### `npm run delploy`

## Swagger documentation: 
`/product-service/doc/api.yaml`
You can test product-service API with Swagger https://editor.swagger.io/ 

## Tests for lambda handlers:
### `npm run test`