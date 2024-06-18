import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class ProductServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const productsTable = dynamodb.Table.fromTableArn(
      this,
      'ProductsTable',
      'arn:aws:dynamodb:eu-west-1:590183649334:table/products'
    );

    const stocksTable = dynamodb.Table.fromTableArn(
      this,
      'StocksTable',
      'arn:aws:dynamodb:eu-west-1:590183649334:table/stocks'
    );

    const getProductsListFunction = new lambda.Function(this, 'getProductsListFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'getProductsList.handler',
      environment: {
        PRODUCTS_TABLE_NAME: productsTable.tableName,
        STOCKS_TABLE_NAME: stocksTable.tableName,
      }
    });

    const getProductByIdFunction = new lambda.Function(this, 'getProductByIdFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'getProductById.handler',
    });

    productsTable.grantReadWriteData(getProductsListFunction);
    productsTable.grantReadWriteData(getProductByIdFunction);
    stocksTable.grantReadWriteData(getProductsListFunction);
  

    const api = new apigateway.RestApi(this, 'product-api', {
      restApiName: 'Product Service',
      cloudWatchRole: true,
      // defaultCorsPreflightOptions: {
      //   allowOrigins: apigateway.Cors.ALL_ORIGINS,
      //   allowMethods: apigateway.Cors.ALL_METHODS, 
      //   allowHeaders: apigateway.Cors.DEFAULT_HEADERS
      // }
    });

    const getProductsListResource = api.root.addResource('products');
    const getProductsListLambdaIntegration = new apigateway.LambdaIntegration(getProductsListFunction);
    getProductsListResource.addMethod('GET', getProductsListLambdaIntegration);

    const getProductByIdLambdaIntegration = new apigateway.LambdaIntegration(getProductByIdFunction);
    const getProductByIdResource = getProductsListResource.addResource("{id}");
    getProductByIdResource.addMethod('GET', getProductByIdLambdaIntegration);

    const deployment = new apigateway.Deployment(this, 'Deployment', { api });

    const devStage = new apigateway.Stage(this, 'dev-stage', {
      stageName: 'dev',
      deployment 
    });

    api.deploymentStage = devStage;
  }
}
