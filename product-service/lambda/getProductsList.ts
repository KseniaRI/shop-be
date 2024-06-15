import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as fs from 'fs';
import * as path from 'path';

const productsFilePath = path.resolve(__dirname, 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    
exports.handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("request:", JSON.stringify(event));
    
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            "Access-Control-Allow-Origin": '*',
            "Access-Control-Allow-Methods": 'GET'
        },
        body: JSON.stringify(productsData)
    };
    console.log("response obj", response);
    return response;
};