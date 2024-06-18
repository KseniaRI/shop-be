import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

exports.handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("request:", JSON.stringify(event));
    
    const client = new DynamoDBClient({});
    const dynamo = DynamoDBDocumentClient.from(client);

    const headers = {
        "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        "Access-Control-Allow-Origin": '*',
        "Access-Control-Allow-Methods": '*'
    }
    
    try {
        const body = await dynamo.send(
            new GetCommand({
                TableName: 'products',
                Key: {
                    id:  event.pathParameters?.id
                }
            })  
        )

        if (body.Item) {
            const response = {
                statusCode: 200,
                headers,
                body: JSON.stringify(body.Item)
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