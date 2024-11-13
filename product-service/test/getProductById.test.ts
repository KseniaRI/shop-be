import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

 const mockProduct = { id: "123e4567-e89b-12d3-a456-426614174000", title: 'Product 1', description: 'Description 1', price: 10  };
 const mockStock = { product_id: "123e4567-e89b-12d3-a456-426614174000", count: 10 };


jest.mock('@aws-sdk/lib-dynamodb', () => ({
    DynamoDBDocumentClient: {
        from: jest.fn().mockReturnValue({
            send: jest.fn()
                .mockResolvedValueOnce({ Item: mockProduct }) 
                .mockResolvedValueOnce({ Item: mockStock }) 
        })
    },
    GetCommand: jest.fn(),
}));

const { handler } = require('../lambda/getProductById')

describe('handler', () => {
    it('should return 200 with product and stock count', async () => {
        const event = {
            pathParameters: { id: mockProduct.id }
        } as unknown as APIGatewayProxyEvent;

        const result: APIGatewayProxyResult = await handler(event);

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toEqual({
            ...mockProduct,
            count: mockStock.count,
        });
    });
});