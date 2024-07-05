"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const client_sns_1 = require("@aws-sdk/client-sns");
const crypto_1 = require("crypto");
exports.handler = async (event) => {
    console.log("request", JSON.stringify(event));
    const products = event.Records.flatMap(record => JSON.parse(record.body));
    console.log('products from sqs:', products);
    const client = new client_dynamodb_1.DynamoDBClient({});
    const dynamo = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
    const snsClient = new client_sns_1.SNSClient({});
    for (const product of products) {
        const { title, description, price, count } = product;
        try {
            const productId = (0, crypto_1.randomUUID)();
            const transactionCommand = new lib_dynamodb_1.TransactWriteCommand({
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
            const message = `Product created: ${title} (price: ${price}, description: ${description}, count: ${count})`;
            const publishCommand = new client_sns_1.PublishCommand({
                TopicArn: process.env.SNS_ARN,
                Message: message,
                MessageAttributes: {
                    price: {
                        DataType: "Number",
                        StringValue: price.toString()
                    },
                }
            });
            await snsClient.send(publishCommand);
            console.log(`Product from SQS with ${title} was placed in db tables (price: ${price}, description: ${description}, count: ${count})`);
        }
        catch (error) {
            console.log('Error of writing parsed csv to db', error);
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2F0YWxvZ0JhdGNoUHJvY2Vzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNhdGFsb2dCYXRjaFByb2Nlc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSw4REFBMEQ7QUFDMUQsd0RBQXFGO0FBQ3JGLG9EQUFnRTtBQUNoRSxtQ0FBb0M7QUFFcEMsT0FBTyxDQUFDLE9BQU8sR0FBRyxLQUFLLEVBQUUsS0FBZSxFQUFFLEVBQUU7SUFDeEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzlDLE1BQU0sUUFBUSxHQUFxQixLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDNUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUU1QyxNQUFNLE1BQU0sR0FBRyxJQUFJLGdDQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdEMsTUFBTSxNQUFNLEdBQUcscUNBQXNCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25ELE1BQU0sU0FBUyxHQUFHLElBQUksc0JBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUVwQyxLQUFLLE1BQU0sT0FBTyxJQUFJLFFBQVEsRUFBRSxDQUFDO1FBQzdCLE1BQU0sRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxPQUFPLENBQUM7UUFDckQsSUFBSSxDQUFDO1lBQ0QsTUFBTSxTQUFTLEdBQUcsSUFBQSxtQkFBVSxHQUFFLENBQUM7WUFDL0IsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLG1DQUFvQixDQUFDO2dCQUNoRCxhQUFhLEVBQUU7b0JBQ1g7d0JBQ0ksR0FBRyxFQUFFOzRCQUNELFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQjs0QkFDMUMsSUFBSSxFQUFFO2dDQUNGLEVBQUUsRUFBRSxTQUFTO2dDQUNiLEtBQUs7Z0NBQ0wsS0FBSztnQ0FDTCxXQUFXOzZCQUNkO3lCQUNKO3FCQUNKO29CQUNEO3dCQUNJLEdBQUcsRUFBRTs0QkFDRCxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUI7NEJBQ3hDLElBQUksRUFBRTtnQ0FDRixVQUFVLEVBQUUsU0FBUztnQ0FDckIsS0FBSzs2QkFDUjt5QkFDSjtxQkFDSjtpQkFDSjthQUNKLENBQUMsQ0FBQztZQUVILE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBRXRDLE1BQU0sT0FBTyxHQUFHLG9CQUFvQixLQUFLLFlBQVksS0FBSyxrQkFBa0IsV0FBVyxZQUFZLEtBQUssR0FBRyxDQUFDO1lBQzVHLE1BQU0sY0FBYyxHQUFHLElBQUksMkJBQWMsQ0FBQztnQkFDdEMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTztnQkFDN0IsT0FBTyxFQUFFLE9BQU87Z0JBQ2hCLGlCQUFpQixFQUFFO29CQUNmLEtBQUssRUFBRTt3QkFDSCxRQUFRLEVBQUUsUUFBUTt3QkFDbEIsV0FBVyxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUU7cUJBQ2hDO2lCQUNKO2FBQ0osQ0FBQyxDQUFBO1lBRUYsTUFBTSxTQUFTLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMseUJBQXlCLEtBQUssb0NBQW9DLEtBQUssa0JBQWtCLFdBQVcsWUFBWSxLQUFLLEdBQUcsQ0FBQyxDQUFBO1FBQ3pJLENBQUM7UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQ0FBbUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM1RCxDQUFDO0lBQ0wsQ0FBQztBQUNMLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNRU0V2ZW50IH0gZnJvbSBcImF3cy1sYW1iZGFcIjtcclxuaW1wb3J0IHsgUHJvZHVjdEZyb21DU1YgfSBmcm9tIFwiLi4vdHlwZXMvdHlwZVByb2R1Y3RGcm9tQ1NWXCI7XHJcbmltcG9ydCB7IER5bmFtb0RCQ2xpZW50IH0gZnJvbSBcIkBhd3Mtc2RrL2NsaWVudC1keW5hbW9kYlwiO1xyXG5pbXBvcnQgeyBEeW5hbW9EQkRvY3VtZW50Q2xpZW50LCBUcmFuc2FjdFdyaXRlQ29tbWFuZCB9IGZyb20gXCJAYXdzLXNkay9saWItZHluYW1vZGJcIjtcclxuaW1wb3J0IHsgUHVibGlzaENvbW1hbmQsIFNOU0NsaWVudCB9IGZyb20gXCJAYXdzLXNkay9jbGllbnQtc25zXCI7XHJcbmltcG9ydCB7IHJhbmRvbVVVSUQgfSBmcm9tICdjcnlwdG8nO1xyXG5cclxuZXhwb3J0cy5oYW5kbGVyID0gYXN5bmMgKGV2ZW50OiBTUVNFdmVudCkgPT4geyBcclxuICAgIGNvbnNvbGUubG9nKFwicmVxdWVzdFwiLCBKU09OLnN0cmluZ2lmeShldmVudCkpO1xyXG4gICAgY29uc3QgcHJvZHVjdHM6IFByb2R1Y3RGcm9tQ1NWW10gPSBldmVudC5SZWNvcmRzLmZsYXRNYXAocmVjb3JkID0+IEpTT04ucGFyc2UocmVjb3JkLmJvZHkpKTtcclxuICAgIGNvbnNvbGUubG9nKCdwcm9kdWN0cyBmcm9tIHNxczonLCBwcm9kdWN0cyk7XHJcblxyXG4gICAgY29uc3QgY2xpZW50ID0gbmV3IER5bmFtb0RCQ2xpZW50KHt9KTtcclxuICAgIGNvbnN0IGR5bmFtbyA9IER5bmFtb0RCRG9jdW1lbnRDbGllbnQuZnJvbShjbGllbnQpO1xyXG4gICAgY29uc3Qgc25zQ2xpZW50ID0gbmV3IFNOU0NsaWVudCh7fSk7XHJcblxyXG4gICAgZm9yIChjb25zdCBwcm9kdWN0IG9mIHByb2R1Y3RzKSB7XHJcbiAgICAgICAgY29uc3QgeyB0aXRsZSwgZGVzY3JpcHRpb24sIHByaWNlLCBjb3VudCB9ID0gcHJvZHVjdDtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBjb25zdCBwcm9kdWN0SWQgPSByYW5kb21VVUlEKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zYWN0aW9uQ29tbWFuZCA9IG5ldyBUcmFuc2FjdFdyaXRlQ29tbWFuZCh7XHJcbiAgICAgICAgICAgICAgICBUcmFuc2FjdEl0ZW1zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQdXQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRhYmxlTmFtZTogcHJvY2Vzcy5lbnYuUFJPRFVDVFNfVEFCTEVfTkFNRSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEl0ZW06IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogcHJvZHVjdElkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUHV0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUYWJsZU5hbWU6IHByb2Nlc3MuZW52LlNUT0NLU19UQUJMRV9OQU1FLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSXRlbToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb2R1Y3RfaWQ6IHByb2R1Y3RJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGF3YWl0IGR5bmFtby5zZW5kKHRyYW5zYWN0aW9uQ29tbWFuZCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gYFByb2R1Y3QgY3JlYXRlZDogJHt0aXRsZX0gKHByaWNlOiAke3ByaWNlfSwgZGVzY3JpcHRpb246ICR7ZGVzY3JpcHRpb259LCBjb3VudDogJHtjb3VudH0pYDtcclxuICAgICAgICAgICAgY29uc3QgcHVibGlzaENvbW1hbmQgPSBuZXcgUHVibGlzaENvbW1hbmQoe1xyXG4gICAgICAgICAgICAgICAgVG9waWNBcm46IHByb2Nlc3MuZW52LlNOU19BUk4sXHJcbiAgICAgICAgICAgICAgICBNZXNzYWdlOiBtZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgTWVzc2FnZUF0dHJpYnV0ZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBwcmljZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRhVHlwZTogXCJOdW1iZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgU3RyaW5nVmFsdWU6IHByaWNlLnRvU3RyaW5nKClcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGF3YWl0IHNuc0NsaWVudC5zZW5kKHB1Ymxpc2hDb21tYW5kKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYFByb2R1Y3QgZnJvbSBTUVMgd2l0aCAke3RpdGxlfSB3YXMgcGxhY2VkIGluIGRiIHRhYmxlcyAocHJpY2U6ICR7cHJpY2V9LCBkZXNjcmlwdGlvbjogJHtkZXNjcmlwdGlvbn0sIGNvdW50OiAke2NvdW50fSlgKVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBvZiB3cml0aW5nIHBhcnNlZCBjc3YgdG8gZGInLCBlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il19