import { APIGatewayProxyEvent } from "aws-lambda";
import { StockType } from "../types/typeStock";
import { ProductType } from "../types/typeProduct";

const mockProducts: ProductType[] = [
    { id: '1', title: 'Product 1', description: 'Description 1', price: 100 },
    { id: '2', title: 'Product 2', description: 'Description 2', price: 200 },
    { id: '3', title: 'Product 3', description: 'Description 3', price: 300 },
];

const mockStocks: StockType[] = [
    { product_id: '1', count: 10 },
    { product_id: '2', count: 20 },
    { product_id: '3', count: 30 },
];

jest.mock("@aws-sdk/lib-dynamodb", () => ({
    DynamoDBDocumentClient: {
        from: jest.fn().mockReturnValue({
            send: jest.fn()
                .mockResolvedValueOnce({ Items: mockProducts }) 
                .mockResolvedValueOnce({ Items: mockStocks }) 
        })
    },
    ScanCommand: jest.fn()
}));

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
        expect(result.headers).toHaveProperty('Access-Control-Allow-Methods', '*');
        expect(result.headers).toHaveProperty('Access-Control-Allow-Headers', 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token');
        const body = JSON.parse(result.body);
        expect(body).toBeInstanceOf(Array);
        expect(body).toEqual(
            mockProducts.map(product => ({
                ...product,
                count: mockStocks.find(stock => stock.product_id === product.id)?.count || 0
            }))
        );
    });
});