import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
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
        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: key
        });

        try {
            const result = await client.send(command);
        
            const productsFromCSV: ProductWithStockType[] = [];
        
            if (result.Body instanceof Readable) {
                result.Body
                    .pipe(csvParser({ separator: ';' }))
                    .on('data', (data) => productsFromCSV.push(data))
                    .on('end', () => console.log(productsFromCSV))
                    .on('error', (error) => {
                        console.error('Error parsing CSV:', error);
                    });;
            } else {
                console.log('result is not a Readable stream.');
            }
        } catch (error) {
            console.error('Error getting object from S3:', error);
        }
    }
}