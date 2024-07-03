import { APIGatewayProxyEvent } from "aws-lambda";

const { handler } = require('../lambda/getProductById');

describe('Get product by id', () => {
    it('should return a 200 status code with CORS headers and a single product', async () => {
        const event: Partial<APIGatewayProxyEvent> = {
            httpMethod: 'GET',
            pathParameters: {
                id: '1'
            },
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
        expect(result.headers).toHaveProperty('Access-Control-Allow-Methods', '*');
        expect(result.headers).toHaveProperty('Access-Control-Allow-Headers', 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token');
        const body = JSON.parse(result.body);
        expect(body.id).toBe('1');
    });

    it('should return 404 when product is not found', async () => {
        const event: Partial<APIGatewayProxyEvent> = {
            httpMethod: 'GET',
            pathParameters: {
                id: '10' 
            },
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

        const result = await handler(event as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(404);
        expect(result.headers).toHaveProperty('Access-Control-Allow-Origin', '*');
        expect(result.headers).toHaveProperty('Access-Control-Allow-Methods', '*');
        
        const parsedBody = JSON.parse(result.body);
        expect(parsedBody.message).toBe('Product not found');
    });
});