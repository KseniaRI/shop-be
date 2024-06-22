import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
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
            
            const requiredFields = ['title', 'description', 'price', 'count'];
            const hasAllRequiredFields = requiredFields.every(field => parsedRequestBody.hasOwnProperty(field));
            
            if (!hasAllRequiredFields || incorrectFieldType) {
                return invalidDataResponse;
            }

            const productId = randomUUID();

            const transactionCommand = new TransactWriteCommand({
                TransactItems: [
                    {
                        Put: {
                            TableName: process.env.PRODUCTS_TABLE_NAME,
                            Item: {
                                id: productId,
                                price,
                                title,
                                description
                            }
                        }
                    },
                    {
                        Put: {
                            TableName: process.env.STOCKS_TABLE_NAME,
                            Item: {
                                product_id: productId,
                                count
                            }
                        }
                    }
                ]
            });

            await dynamo.send(transactionCommand);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({response:`Created item ${parsedRequestBody.title}`})
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