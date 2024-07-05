import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';


export class AuthorizationServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const basicAuthorizerFunction = new lambda.Function(this, 'basicAuthorizerFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'basicAuthorizer.handler',
    })

    new cdk.CfnOutput(this, 'basicAuthorizerArn', {
      value: basicAuthorizerFunction.functionArn
    });
  }
}
