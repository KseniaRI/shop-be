import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
const { handler } = require('../lambda/importProductsFile');

jest.mock('@aws-sdk/client-s3');

jest.mock('@aws-sdk/s3-request-presigner', () => ({
    getSignedUrl: jest.fn(),
}));

describe('import products file', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if name in query string is not provided', async () => {
        const event: APIGatewayProxyEvent = {
            queryStringParameters: {},
        } as any;

        const result: APIGatewayProxyResult = await handler(event);

        expect(result.statusCode).toBe(400);
    });

    it('should return 200 with signed URL if name in query string is provided', async () => {
        const event: APIGatewayProxyEvent = {
            queryStringParameters: { name: 'test.csv' },
        } as any;

        const signedUrl = 'https://test-signed-url';
        (getSignedUrl as jest.Mock).mockResolvedValue(signedUrl);

        const result: APIGatewayProxyResult = await handler(event);

        expect(result.statusCode).toBe(200);
        expect(result.body).toBe(JSON.stringify({ url: signedUrl }));
    });

    it('should return 500 if getSignedUrl throws an error', async () => {
        const event: APIGatewayProxyEvent = {
            queryStringParameters: { name: 'test.csv' },
        } as any;

        (getSignedUrl as jest.Mock).mockRejectedValue(new Error('Error'));

        const result: APIGatewayProxyResult = await handler(event);
       
        expect(result.statusCode).toBe(500);
    })
})