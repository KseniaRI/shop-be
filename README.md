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
### Please note that CSV-parser uses the default separator `,`. If your test CSV-file has different separator (`;`, `|`, `\t` etc...) you should change it manually othervise you will face the parse error.

### URL for GET method to recieve Signed URL: 
https://me8mqmcnzf.execute-api.eu-west-1.amazonaws.com/dev/import?name=${fileName}

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