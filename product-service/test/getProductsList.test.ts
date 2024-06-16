import { APIGatewayProxyEvent } from "aws-lambda";

const { handler } = require('../lambda/getProductsList');


describe('Get products list', () => {
    it('should return a 200 status code with CORS headers and array of products', async () => {
        const event: Partial<APIGatewayProxyEvent> = {
            httpMethod: 'GET',
            requestContext: {
                accountId: '123456789012',
                apiId: 'id',
                httpMethod: 'GET',
                identity: {
                    sourceIp: '127.0.0.1',
                },
                requestId: 'id',
                stage: 'dev',
            } as any
        };

        const result = await handler(event);

        expect(result.statusCode).toBe(200);
        expect(result.headers).toHaveProperty('Access-Control-Allow-Origin', '*');
        expect(result.headers).toHaveProperty('Access-Control-Allow-Methods', 'GET');
        expect(result.headers).toHaveProperty('Access-Control-Allow-Headers', 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token');
        const body = JSON.parse(result.body);
        expect(body).toBeInstanceOf(Array);
    });
});