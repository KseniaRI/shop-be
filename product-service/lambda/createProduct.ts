import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from 'crypto';

exports.handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("request:", JSON.stringify(event));

    const client = new DynamoDBClient({});
    const dynamo = DynamoDBDocumentClient.from(client);

    const headers = {
        "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        "Access-Control-Allow-Origin": '*',
        "Access-Control-Allow-Methods": '*'
    };

    const invalidDataResponse = {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Product data is invalid" })
    };
    
    try {
        const requestBody = event.body;
        if (!requestBody) {
            return invalidDataResponse;
        } else {
            const parsedRequestBody = JSON.parse(requestBody)
            const { title, description, price, count } = parsedRequestBody;
            const incorrectFieldType = typeof title !== 'string' || typeof description !== 'string' || typeof price !== 'number' || typeof count !== 'number';
            const undeinedField = !title || !description || price === undefined || count === undefined;
            
            if (undeinedField || incorrectFieldType) {
                return invalidDataResponse;
            }

            const productId = randomUUID();

            await dynamo.send(
                new PutCommand({
                    TableName: 'products',
                    Item: {
                        id: productId,
                        price,
                        title,
                        description
                    },
                })
            );
            await dynamo.send(
                new PutCommand({
                    TableName: 'stocks',
                    Item: {
                        product_id: productId,
                        count
                    },
                })
            );
            return {
                statusCode: 200,
                headers, 
                body: `Created item ${parsedRequestBody.title}`
            };
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