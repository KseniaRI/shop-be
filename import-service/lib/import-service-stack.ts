import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as iam from 'aws-cdk-lib/aws-iam';

export class ImportServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const responseHeaders = {
        "Access-Control-Allow-Origin": "'*'",
        "Access-Control-Allow-Headers":
          "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
        "Access-Control-Allow-Methods": "'OPTIONS,GET,PUT'"
    }
    
    const importBucket = s3.Bucket.fromBucketName(this, 'ImportBucket', 'import-service-bkt');
    const catalogItemsQueueArn = cdk.Fn.importValue('ItemsQueueArn');
    const catalogItemsQueue = sqs.Queue.fromQueueArn(this, 'catalogItemsQueue', catalogItemsQueueArn);

    const importProductsFileFunction = new lambda.Function(this, 'importProductsFileFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'importProductsFile.handler',
      environment: {
        BUCKET_NAME: importBucket.bucketName,
      },
    });
    
    const importFileParserFunction = new lambda.Function(this, 'importFileParserFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'importFileParser.handler',
      environment: {
        BUCKET_NAME: importBucket.bucketName,
        SQS_URL: catalogItemsQueue.queueUrl
      },
    })

    importBucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.LambdaDestination(importFileParserFunction), {
      prefix: 'uploaded/'
    });

    catalogItemsQueue.grantSendMessages(importFileParserFunction);
    importBucket.grantReadWrite(importProductsFileFunction);
    importBucket.grantReadWrite(importFileParserFunction);
    
    const basicAuthorizerFunctionArn = cdk.Fn.importValue('BasicAuthorizerFunctionArn');
    const basicAuthorizerFunctionArnRole = cdk.Fn.importValue("BasicAuthorizerFunctionArnRole");
    const basicAuthorizerFunctionRole = iam.Role.fromRoleArn(this, "BasicAuthorizerFunctionRole", basicAuthorizerFunctionArnRole)
    const basicAuthorizerFunction = lambda.Function.fromFunctionAttributes(this, 'basicAuthorizerFunction', {
      functionArn: basicAuthorizerFunctionArn,
      role: basicAuthorizerFunctionRole
    })
    
    const authorizer = new apigateway.TokenAuthorizer(this, 'APIGatewayAuthorizer', {
      handler: basicAuthorizerFunction,
      identitySource: apigateway.IdentitySource.header('Authorization')
      // resultsCacheTtl: Duration.seconds(0)
    });

    const api = new apigateway.RestApi(this, 'import-api', {
      restApiName: 'Import Service',
      cloudWatchRole: true,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS, 
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
        allowCredentials: true
      }
    })

    const importProductsFileResource = api.root.addResource('import');
    const importProductsFileLambdaIntegration = new apigateway.LambdaIntegration(importProductsFileFunction);
    importProductsFileResource.addMethod('GET', importProductsFileLambdaIntegration, {
      authorizer,
      authorizationType: apigateway.AuthorizationType.CUSTOM,
      requestParameters: {
        'method.request.querystring.name': true
      } 
    });

    api.addGatewayResponse("GatewayResponseUnauthorized", {
      type: cdk.aws_apigateway.ResponseType.UNAUTHORIZED,
      responseHeaders,
      statusCode:"401"
    });

    api.addGatewayResponse("GatewayResponseAccessDenied", {
      type: cdk.aws_apigateway.ResponseType.ACCESS_DENIED,
      responseHeaders,
      statusCode:"403"
    });

    const deployment = new apigateway.Deployment(this, 'Deployment', { api });

    const devStage = new apigateway.Stage(this, 'dev-stage', {
      stageName: 'dev',
      deployment 
    });

    api.deploymentStage = devStage;
    
    new cdk.CfnOutput(this, 'ImportFile', {
      value: importProductsFileFunction.functionArn,
      exportName: "ImportProductsFileFunctionArn"
    });

    new cdk.CfnOutput(this, 'ImportFileRole', {
      value: importProductsFileFunction.role!.roleArn,
      exportName: "ImportProductsFileFunctionArnRole"
    })
  }
}
   