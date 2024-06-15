import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as fs from 'fs';
import * as path from 'path';
import { ProductType } from './productType';

const productsFilePath = path.resolve(__dirname, 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

exports.handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("request:", JSON.stringify(event));
    
    const productId = event.pathParameters?.id;
    const product = productsData.find((product: ProductType) => product.id === productId);

    if (product) {
        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                "Access-Control-Allow-Origin": '*',
                "Access-Control-Allow-Methods": '*'
            },
            body: JSON.stringify({
                product
            })
        };
        return response;
    } else {
        const response = {
            statusCode: 404,
            headers: {
                "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                "Access-Control-Allow-Origin": '*',
                "Access-Control-Allow-Methods": '*'
            },
            body: JSON.stringify({ message: "Product not found" })
        }
        return response;
    }   
}