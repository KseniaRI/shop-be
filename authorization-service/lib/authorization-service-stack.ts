import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';

export class AuthorizationServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const basicAuthorizerFunction = new lambda.Function(this, 'basicAuthorizerFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'basicAuthorizer.handler',
    })

    basicAuthorizerFunction.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));

    new cdk.CfnOutput(this, 'BasicAuthorizer', {
      value: basicAuthorizerFunction.functionArn,
      exportName: 'BasicAuthorizerFunctionArn'
    });
    new cdk.CfnOutput(this, 'BasicAuthorizerRole', {
      value: basicAuthorizerFunction.role!.roleArn,
      exportName: "BasicAuthorizerFunctionArnRole"
    })
  }
}
