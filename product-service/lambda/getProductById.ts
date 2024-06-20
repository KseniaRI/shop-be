import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { ProductType } from '../types/typeProduct';
import { StockType } from '../types/typeStock';

exports.handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("request:", JSON.stringify(event));
    const headers = {
        "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        "Access-Control-Allow-Origin": '*',
        "Access-Control-Allow-Methods": '*'
    }
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const id = event.pathParameters?.id;

    if (!id || !uuidRegex.test(id)) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
                message: 'Invalid ID format. ID must be a UUID.'
            }),
        };
    }
    const client = new DynamoDBClient({});
    const dynamo = DynamoDBDocumentClient.from(client);
    
    try {
        const productResult = await dynamo.send(
            new GetCommand({
                TableName: 'products',
                Key: {
                    id,
                }
            })  
        )
        const product = productResult.Item as ProductType;

        const stockResult = await dynamo.send(
            new GetCommand({
                TableName: 'stocks',
                Key: {
                    product_id: id
                }
            })  
        )
        const stock = stockResult.Item as StockType;

        const joinedData = {
            ...product,
            count: stock?.count || 0
        }

        if (product) {
            const response = {
                statusCode: 200,
                headers,
                body: JSON.stringify(joinedData)
            };
            return response;
        } else {
            const response = {
                statusCode: 404,
                headers,
                body: JSON.stringify({ message: "Product not found" })
            }
            return response;
        }   
    } catch (error) {
        console.error("Error fetching products from DynamoDB", error);
         return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: "Internal Server Error" })
        };
    }
}