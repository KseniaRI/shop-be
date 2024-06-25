import {  PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

exports.handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("request", JSON.stringify(event));
    const headers = {
        "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        "Access-Control-Allow-Origin": '*',
        "Access-Control-Allow-Methods": '*'
    }
    const fileName = event.queryStringParameters?.name;
    console.log(fileName);
    
    if (!fileName) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ message: "Missing required query parameter: name" })
        };
    }

    const client = new S3Client({});
    const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: `uploaded/${fileName}`,
    });

   
    try {
        const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
         const response = {
            statusCode: 200,
            headers, 
            body: JSON.stringify({url: signedUrl})
        };
        return response;
    } catch (error) {
        console.error("Error getting object from S3:", error);
         return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: "Internal Server Error" })
        }; 
    }
}