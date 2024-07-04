import { SQSEvent } from "aws-lambda";
import { ProductFromCSV } from "../types/typeProductFromCSV";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { randomUUID } from 'crypto';

exports.handler = async (event: SQSEvent) => { 
    console.log("request", JSON.stringify(event));
    const products: ProductFromCSV[] = event.Records.flatMap(record => JSON.parse(record.body));
    console.log('products from sqs:', products);

    const client = new DynamoDBClient({});
    const dynamo = DynamoDBDocumentClient.from(client);
    const snsClient = new SNSClient({});

    for (const product of products) {
        const { title, description, price, count } = product;
        try {
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

            const message = `Product created: ${title} (id: ${productId}, price: ${price}, description: ${description}, count: ${count})`;
            const publishCommand = new PublishCommand({
                TopicArn: process.env.SNS_ARN,
                Message: message,
                MessageAttributes: {
                    price: {
                        DataType: "Number",
                        StringValue: price.toString()
                    }
                }
            })
            await snsClient.send(publishCommand);

        } catch (error) {
            console.log('Error of writing parsed csv to db', error);
        }
    }
}