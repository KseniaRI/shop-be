import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as fs from 'fs';
import * as path from 'path';
import { ProductType } from './productType';

const productsFilePath = path.resolve(__dirname, 'products.json');
const productsData = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

exports.handler = async function (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    console.log("request:", JSON.stringify(event));
    const productId = event.pathParameters?.id;
   
    const product = productsData.find((product: ProductType) => product.id === productId);
    try {
          const responce = {
            statusCode: 200,
            body: JSON.stringify({
                product
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
}