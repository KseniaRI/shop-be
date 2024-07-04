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
            const message = `Product created: ${title} (id: ${productId}, price: ${price}, description: ${description}, count: ${count})`;
            const publishCommand = new client_sns_1.PublishCommand({
                TopicArn: process.env.SNS_ARN,
                Message: message,
                MessageAttributes: {
                    price: {
                        DataType: "Number",
                        StringValue: price.toString()
                    }
                }
            });
            await snsClient.send(publishCommand);
        }
        catch (error) {
            console.log('Error of writing parsed csv to db', error);
        }
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2F0YWxvZ0JhdGNoUHJvY2Vzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNhdGFsb2dCYXRjaFByb2Nlc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSw4REFBMEQ7QUFDMUQsd0RBQXFGO0FBQ3JGLG9EQUFnRTtBQUNoRSxtQ0FBb0M7QUFFcEMsT0FBTyxDQUFDLE9BQU8sR0FBRyxLQUFLLEVBQUUsS0FBZSxFQUFFLEVBQUU7SUFDeEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzlDLE1BQU0sUUFBUSxHQUFxQixLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDNUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUU1QyxNQUFNLE1BQU0sR0FBRyxJQUFJLGdDQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdEMsTUFBTSxNQUFNLEdBQUcscUNBQXNCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25ELE1BQU0sU0FBUyxHQUFHLElBQUksc0JBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUVwQyxLQUFLLE1BQU0sT0FBTyxJQUFJLFFBQVEsRUFBRSxDQUFDO1FBQzdCLE1BQU0sRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsR0FBRyxPQUFPLENBQUM7UUFDckQsSUFBSSxDQUFDO1lBQ0QsTUFBTSxTQUFTLEdBQUcsSUFBQSxtQkFBVSxHQUFFLENBQUM7WUFDL0IsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLG1DQUFvQixDQUFDO2dCQUNoRCxhQUFhLEVBQUU7b0JBQ1g7d0JBQ0ksR0FBRyxFQUFFOzRCQUNELFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQjs0QkFDMUMsSUFBSSxFQUFFO2dDQUNGLEVBQUUsRUFBRSxTQUFTO2dDQUNiLEtBQUs7Z0NBQ0wsS0FBSztnQ0FDTCxXQUFXOzZCQUNkO3lCQUNKO3FCQUNKO29CQUNEO3dCQUNJLEdBQUcsRUFBRTs0QkFDRCxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUI7NEJBQ3hDLElBQUksRUFBRTtnQ0FDRixVQUFVLEVBQUUsU0FBUztnQ0FDckIsS0FBSzs2QkFDUjt5QkFDSjtxQkFDSjtpQkFDSjthQUNKLENBQUMsQ0FBQztZQUVILE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBRXRDLE1BQU0sT0FBTyxHQUFHLG9CQUFvQixLQUFLLFNBQVMsU0FBUyxZQUFZLEtBQUssa0JBQWtCLFdBQVcsWUFBWSxLQUFLLEdBQUcsQ0FBQztZQUM5SCxNQUFNLGNBQWMsR0FBRyxJQUFJLDJCQUFjLENBQUM7Z0JBQ3RDLFFBQVEsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU87Z0JBQzdCLE9BQU8sRUFBRSxPQUFPO2dCQUNoQixpQkFBaUIsRUFBRTtvQkFDZixLQUFLLEVBQUU7d0JBQ0gsUUFBUSxFQUFFLFFBQVE7d0JBQ2xCLFdBQVcsRUFBRSxLQUFLLENBQUMsUUFBUSxFQUFFO3FCQUNoQztpQkFDSjthQUNKLENBQUMsQ0FBQTtZQUNGLE1BQU0sU0FBUyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUV6QyxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDNUQsQ0FBQztJQUNMLENBQUM7QUFDTCxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTUVNFdmVudCB9IGZyb20gXCJhd3MtbGFtYmRhXCI7XHJcbmltcG9ydCB7IFByb2R1Y3RGcm9tQ1NWIH0gZnJvbSBcIi4uL3R5cGVzL3R5cGVQcm9kdWN0RnJvbUNTVlwiO1xyXG5pbXBvcnQgeyBEeW5hbW9EQkNsaWVudCB9IGZyb20gXCJAYXdzLXNkay9jbGllbnQtZHluYW1vZGJcIjtcclxuaW1wb3J0IHsgRHluYW1vREJEb2N1bWVudENsaWVudCwgVHJhbnNhY3RXcml0ZUNvbW1hbmQgfSBmcm9tIFwiQGF3cy1zZGsvbGliLWR5bmFtb2RiXCI7XHJcbmltcG9ydCB7IFB1Ymxpc2hDb21tYW5kLCBTTlNDbGllbnQgfSBmcm9tIFwiQGF3cy1zZGsvY2xpZW50LXNuc1wiO1xyXG5pbXBvcnQgeyByYW5kb21VVUlEIH0gZnJvbSAnY3J5cHRvJztcclxuXHJcbmV4cG9ydHMuaGFuZGxlciA9IGFzeW5jIChldmVudDogU1FTRXZlbnQpID0+IHsgXHJcbiAgICBjb25zb2xlLmxvZyhcInJlcXVlc3RcIiwgSlNPTi5zdHJpbmdpZnkoZXZlbnQpKTtcclxuICAgIGNvbnN0IHByb2R1Y3RzOiBQcm9kdWN0RnJvbUNTVltdID0gZXZlbnQuUmVjb3Jkcy5mbGF0TWFwKHJlY29yZCA9PiBKU09OLnBhcnNlKHJlY29yZC5ib2R5KSk7XHJcbiAgICBjb25zb2xlLmxvZygncHJvZHVjdHMgZnJvbSBzcXM6JywgcHJvZHVjdHMpO1xyXG5cclxuICAgIGNvbnN0IGNsaWVudCA9IG5ldyBEeW5hbW9EQkNsaWVudCh7fSk7XHJcbiAgICBjb25zdCBkeW5hbW8gPSBEeW5hbW9EQkRvY3VtZW50Q2xpZW50LmZyb20oY2xpZW50KTtcclxuICAgIGNvbnN0IHNuc0NsaWVudCA9IG5ldyBTTlNDbGllbnQoe30pO1xyXG5cclxuICAgIGZvciAoY29uc3QgcHJvZHVjdCBvZiBwcm9kdWN0cykge1xyXG4gICAgICAgIGNvbnN0IHsgdGl0bGUsIGRlc2NyaXB0aW9uLCBwcmljZSwgY291bnQgfSA9IHByb2R1Y3Q7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgcHJvZHVjdElkID0gcmFuZG9tVVVJRCgpO1xyXG4gICAgICAgICAgICBjb25zdCB0cmFuc2FjdGlvbkNvbW1hbmQgPSBuZXcgVHJhbnNhY3RXcml0ZUNvbW1hbmQoe1xyXG4gICAgICAgICAgICAgICAgVHJhbnNhY3RJdGVtczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUHV0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUYWJsZU5hbWU6IHByb2Nlc3MuZW52LlBST0RVQ1RTX1RBQkxFX05BTUUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJdGVtOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHByb2R1Y3RJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFB1dDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVGFibGVOYW1lOiBwcm9jZXNzLmVudi5TVE9DS1NfVEFCTEVfTkFNRSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEl0ZW06IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0X2lkOiBwcm9kdWN0SWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhd2FpdCBkeW5hbW8uc2VuZCh0cmFuc2FjdGlvbkNvbW1hbmQpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGBQcm9kdWN0IGNyZWF0ZWQ6ICR7dGl0bGV9IChpZDogJHtwcm9kdWN0SWR9LCBwcmljZTogJHtwcmljZX0sIGRlc2NyaXB0aW9uOiAke2Rlc2NyaXB0aW9ufSwgY291bnQ6ICR7Y291bnR9KWA7XHJcbiAgICAgICAgICAgIGNvbnN0IHB1Ymxpc2hDb21tYW5kID0gbmV3IFB1Ymxpc2hDb21tYW5kKHtcclxuICAgICAgICAgICAgICAgIFRvcGljQXJuOiBwcm9jZXNzLmVudi5TTlNfQVJOLFxyXG4gICAgICAgICAgICAgICAgTWVzc2FnZTogbWVzc2FnZSxcclxuICAgICAgICAgICAgICAgIE1lc3NhZ2VBdHRyaWJ1dGVzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJpY2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YVR5cGU6IFwiTnVtYmVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFN0cmluZ1ZhbHVlOiBwcmljZS50b1N0cmluZygpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBhd2FpdCBzbnNDbGllbnQuc2VuZChwdWJsaXNoQ29tbWFuZCk7XHJcblxyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBvZiB3cml0aW5nIHBhcnNlZCBjc3YgdG8gZGInLCBlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59Il19