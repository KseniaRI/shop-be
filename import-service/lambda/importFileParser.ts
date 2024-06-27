import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { S3Event } from 'aws-lambda';
import * as csvParser from "csv-parser";
import { ProductWithStockType } from "../types/typeProductWithStock";
import { Readable } from "stream";

exports.handler = async (event: S3Event) => {
    console.log("request", JSON.stringify(event));
    
    for (const record of event.Records) {
        const bucket = record.s3.bucket.name;
        const key = record.s3.object.key;
    
        console.log("Bucket:", bucket);
        console.log("Object key:", key);

        const client = new S3Client({});

        try {
            const getCommand = new GetObjectCommand({
                Bucket: bucket,
                Key: key
            });
            const result = await client.send(getCommand);
            
            const productsFromCSV: ProductWithStockType[] = [];
            
            if (!result.Body) {
                throw new Error('Body is undefined');
            }
            const readableStream = result.Body as Readable;
            
            await new Promise<void>((resolve, reject) => {
                readableStream
                .pipe(csvParser({ separator: ';' }))
                .on('data', (data) => productsFromCSV.push(data))
                .on('end', async () => {
                    console.log(productsFromCSV);
                    resolve();
                })
                .on('error', (error) => {
                    console.error('Error parsing CSV:', error);
                    reject(error);
                });
            });
            
            const newKey = key.replace('uploaded', 'parsed')
            console.log("newKey:", newKey);

            const copyCommand = new CopyObjectCommand({
                Bucket: bucket,
                CopySource: `${bucket}/${key}`,
                Key: newKey
            })
            
            const copyResponse = await client.send(copyCommand);
            console.log("File copied from uploaded to parsed:", copyResponse);
        
            const deleteCommand = new DeleteObjectCommand({
                Bucket: bucket,
                Key: key
            })
            
            await client.send(deleteCommand);
            console.log('File deleted from uploaded:');
            console.log(`Object ${key} was succesfully moved to parsed folder`);
            
        } catch (error) {
            console.error('Error getting object from S3:', error);
        }
    }
}