import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';


export class ProductServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const getProductsListFunction = new lambda.Function(this, 'getProductsListFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'getProductsList.handler'
    });

    const getProductByIdFunction = new lambda.Function(this, 'getProductByIdFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'getProductById.handler'
    });

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
