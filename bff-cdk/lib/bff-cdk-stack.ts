//proxy apigateway for bff EB

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class BffCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const beanstalkAppUrl =
      'http://ksenia-bff-service-devs.eu-west-1.elasticbeanstalk.com';

    const api = new apigateway.RestApi(this, 'eb-bff-api', {
      restApiName: 'EB BFF Service',
      cloudWatchRole: true,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
        allowCredentials: true,
      },
    });

    const proxyResource = api.root.addProxy({
      anyMethod: false,
    });

    const methodOptions: apigateway.MethodOptions = {
      requestParameters: {
        'method.request.path.proxy': true,
      },
    };

    const httpIntegration = new apigateway.HttpIntegration(
      `${beanstalkAppUrl}/{proxy}`,
      {
        proxy: true,
        httpMethod: 'ANY',
        options: {
          requestParameters: {
            'integration.request.path.proxy': 'method.request.path.proxy',
          },
        },
      },
    );

    proxyResource.addMethod('ANY', httpIntegration, methodOptions);

    const deployment = new apigateway.Deployment(this, 'Deployment', { api });

    const devStage = new apigateway.Stage(this, 'dev-stage', {
      stageName: 'dev',
      deployment,
    });

    api.deploymentStage = devStage;
  }
}
