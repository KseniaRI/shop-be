import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as fs from 'fs';
import * as path from 'path';

const productsFilePath = path.resolve(__dirname, 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

exports.handler = async function (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    console.log("request:", JSON.stringify(event));
    try {
        const responce = {
            statusCode: 200,
            body: JSON.stringify({
                products: productsData
            })
        };
        return responce;
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
  
};