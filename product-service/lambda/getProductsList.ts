import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ProductType } from '../types/typeProduct';
import { StockType } from '../types/typeStock';

    
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
        const productsResult = await dynamo.send(new ScanCommand({ TableName: 'products' }));
        const products = productsResult.Items as ProductType[];
    
        const stockResult = await dynamo.send(new ScanCommand({ TableName: 'stocks' }))
        const stocks = stockResult.Items as StockType[];

        const joindData = products.map(product => {
            const productStock = stocks.find(stock => stock.product_id === product.id);
            return {
                ...product,
                count: productStock?.count || 0
            }
        })

        const response = {
            statusCode: 200,
            headers, 
            body: JSON.stringify(joindData)
        };
        return response;
    } catch (error){
        console.error("Error fetching products from DynamoDB", error);
         return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: "Internal Server Error" })
        };
    }
};