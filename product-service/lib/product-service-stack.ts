import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

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
      environment: {
        PRODUCTS_TABLE_NAME: productsTable.tableName,
        STOCKS_TABLE_NAME: stocksTable.tableName,
      }
    });

    const createProductFunction = new lambda.Function(this, 'createProductFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'createProduct.handler',
      environment: {
        PRODUCTS_TABLE_NAME: productsTable.tableName,
        STOCKS_TABLE_NAME: stocksTable.tableName,
      }
    })

    const catalogItemsQueue = new sqs.Queue(this, 'catalogItemsQueue'); 

    const createProductTopic = new sns.Topic(this, 'createProductTopic');
    createProductTopic.addSubscription(new subs.EmailSubscription('ksushapi@gmail.com', {
      filterPolicy: {
        price: sns.SubscriptionFilter.numericFilter({
          greaterThan: 10
        })
      }
    }));
    createProductTopic.addSubscription(new subs.EmailSubscription('pilshchikovaksenia@yandex.ru', {
      filterPolicy: {
        price: sns.SubscriptionFilter.numericFilter({
          lessThanOrEqualTo: 10
        })
      }
    }));

    const catalogBatchProcessFunction = new lambda.Function(this, 'catalogBatchProcessFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'catalogBatchProcess.handler',
      environment: {
        SQS_URL: catalogItemsQueue.queueUrl,
        SNS_ARN: createProductTopic.topicArn,
        PRODUCTS_TABLE_NAME: productsTable.tableName,
        STOCKS_TABLE_NAME: stocksTable.tableName,
      }
    }); 
    
    catalogBatchProcessFunction.addEventSource(new SqsEventSource(catalogItemsQueue, {
      batchSize: 5
    }))

    catalogItemsQueue.grantConsumeMessages(catalogBatchProcessFunction);
    
    createProductTopic.grantPublish(catalogBatchProcessFunction);

    productsTable.grantReadWriteData(getProductsListFunction);
    productsTable.grantReadWriteData(getProductByIdFunction);
    productsTable.grantReadWriteData(createProductFunction);
    productsTable.grantReadWriteData(catalogBatchProcessFunction);

    stocksTable.grantReadWriteData(getProductsListFunction);
    stocksTable.grantReadWriteData(getProductByIdFunction);
    stocksTable.grantReadWriteData(createProductFunction);
    stocksTable.grantReadWriteData(catalogBatchProcessFunction);
    

    const api = new apigateway.RestApi(this, 'product-api', {
      restApiName: 'Product Service',
      cloudWatchRole: true,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS, 
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS
      }
    });

    const getProductsListResource = api.root.addResource('products');
    const getProductsListLambdaIntegration = new apigateway.LambdaIntegration(getProductsListFunction);
    getProductsListResource.addMethod('GET', getProductsListLambdaIntegration);

    const getProductByIdLambdaIntegration = new apigateway.LambdaIntegration(getProductByIdFunction);
    const getProductByIdResource = getProductsListResource.addResource("{id}");
    getProductByIdResource.addMethod('GET', getProductByIdLambdaIntegration);

    const createProductLambdaIntegration = new apigateway.LambdaIntegration(createProductFunction);
    getProductsListResource.addMethod('POST', createProductLambdaIntegration);
    
    const deployment = new apigateway.Deployment(this, 'Deployment', { api });

    const devStage = new apigateway.Stage(this, 'dev-stage', {
      stageName: 'dev',
      deployment 
    });

    api.deploymentStage = devStage;

    new cdk.CfnOutput(this, 'ItemsQueue', {
      value: catalogItemsQueue.queueArn,
      exportName: 'ItemsQueueArn'
    });
  }
}
