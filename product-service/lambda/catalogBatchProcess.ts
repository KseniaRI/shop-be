import { SQSEvent, SQSHandler } from "aws-lambda";

exports.handler = async (event: SQSEvent) => { 
    console.log("request", JSON.stringify(event));
    const [products] = event.Records.map(record => JSON.parse(record.body));
   
    console.log('products from sqs:', products);
    
}