"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const crypto_1 = require("crypto");
exports.handler = async (event) => {
    console.log("request:", JSON.stringify(event));
    const client = new client_dynamodb_1.DynamoDBClient({});
    const dynamo = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
    const headers = {
        "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        "Access-Control-Allow-Origin": '*',
        "Access-Control-Allow-Methods": '*'
    };
    const invalidDataResponse = {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Product data is invalid" })
    };
    try {
        const requestBody = event.body;
        if (!requestBody) {
            return invalidDataResponse;
        }
        else {
            const parsedRequestBody = JSON.parse(requestBody);
            console.log("requestBody:", parsedRequestBody);
            const { title, description, price, count } = parsedRequestBody;
            const incorrectFieldType = typeof title !== 'string' || typeof description !== 'string' || typeof price !== 'number' || typeof count !== 'number';
            const requiredFields = ['title', 'description', 'price', 'count'];
            const hasAllRequiredFields = requiredFields.every(field => parsedRequestBody.hasOwnProperty(field));
            if (!hasAllRequiredFields || incorrectFieldType) {
                return invalidDataResponse;
            }
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
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ response: `Created item ${parsedRequestBody.title}` })
            };
        }
    }
    catch (error) {
        console.error("Error fetching products from DynamoDB", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: "Internal Server Error" })
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlUHJvZHVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNyZWF0ZVByb2R1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw4REFBMEQ7QUFDMUQsd0RBQXFGO0FBQ3JGLG1DQUFvQztBQUVwQyxPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUssRUFBRSxLQUEyQixFQUFrQyxFQUFFO0lBQ3BGLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUUvQyxNQUFNLE1BQU0sR0FBRyxJQUFJLGdDQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdEMsTUFBTSxNQUFNLEdBQUcscUNBQXNCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRW5ELE1BQU0sT0FBTyxHQUFHO1FBQ1osOEJBQThCLEVBQUUsc0VBQXNFO1FBQ3RHLDZCQUE2QixFQUFFLEdBQUc7UUFDbEMsOEJBQThCLEVBQUUsR0FBRztLQUN0QyxDQUFDO0lBRUYsTUFBTSxtQkFBbUIsR0FBRztRQUN4QixVQUFVLEVBQUUsR0FBRztRQUNmLE9BQU87UUFDUCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxDQUFDO0tBQy9ELENBQUM7SUFFRixJQUFJLENBQUM7UUFDRCxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQy9CLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNmLE9BQU8sbUJBQW1CLENBQUM7UUFDL0IsQ0FBQzthQUFNLENBQUM7WUFDSixNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztZQUMvQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsaUJBQWlCLENBQUM7WUFFL0QsTUFBTSxrQkFBa0IsR0FBRyxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksT0FBTyxXQUFXLEtBQUssUUFBUSxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLENBQUM7WUFFbEosTUFBTSxjQUFjLEdBQUcsQ0FBQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNsRSxNQUFNLG9CQUFvQixHQUFHLGNBQWMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUVwRyxJQUFJLENBQUMsb0JBQW9CLElBQUksa0JBQWtCLEVBQUUsQ0FBQztnQkFDOUMsT0FBTyxtQkFBbUIsQ0FBQztZQUMvQixDQUFDO1lBRUQsTUFBTSxTQUFTLEdBQUcsSUFBQSxtQkFBVSxHQUFFLENBQUM7WUFFL0IsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLG1DQUFvQixDQUFDO2dCQUNoRCxhQUFhLEVBQUU7b0JBQ1g7d0JBQ0ksR0FBRyxFQUFFOzRCQUNELFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQjs0QkFDMUMsSUFBSSxFQUFFO2dDQUNGLEVBQUUsRUFBRSxTQUFTO2dDQUNiLEtBQUs7Z0NBQ0wsS0FBSztnQ0FDTCxXQUFXOzZCQUNkO3lCQUNKO3FCQUNKO29CQUNEO3dCQUNJLEdBQUcsRUFBRTs0QkFDRCxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUI7NEJBQ3hDLElBQUksRUFBRTtnQ0FDRixVQUFVLEVBQUUsU0FBUztnQ0FDckIsS0FBSzs2QkFDUjt5QkFDSjtxQkFDSjtpQkFDSjthQUNKLENBQUMsQ0FBQztZQUVILE1BQU0sTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBRXRDLE9BQU87Z0JBQ0gsVUFBVSxFQUFFLEdBQUc7Z0JBQ2YsT0FBTztnQkFDUCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBQyxnQkFBZ0IsaUJBQWlCLENBQUMsS0FBSyxFQUFFLEVBQUMsQ0FBQzthQUM3RSxDQUFDO1FBQ04sQ0FBQztJQUNMLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyx1Q0FBdUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM5RCxPQUFPO1lBQ0gsVUFBVSxFQUFFLEdBQUc7WUFDZixPQUFPO1lBQ1AsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsQ0FBQztTQUM3RCxDQUFDO0lBQ04sQ0FBQztBQUNMLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFQSUdhdGV3YXlQcm94eUV2ZW50LCBBUElHYXRld2F5UHJveHlSZXN1bHQgfSBmcm9tICdhd3MtbGFtYmRhJztcclxuaW1wb3J0IHsgRHluYW1vREJDbGllbnQgfSBmcm9tIFwiQGF3cy1zZGsvY2xpZW50LWR5bmFtb2RiXCI7XHJcbmltcG9ydCB7IER5bmFtb0RCRG9jdW1lbnRDbGllbnQsIFRyYW5zYWN0V3JpdGVDb21tYW5kIH0gZnJvbSBcIkBhd3Mtc2RrL2xpYi1keW5hbW9kYlwiO1xyXG5pbXBvcnQgeyByYW5kb21VVUlEIH0gZnJvbSAnY3J5cHRvJztcclxuXHJcbmV4cG9ydHMuaGFuZGxlciA9IGFzeW5jIChldmVudDogQVBJR2F0ZXdheVByb3h5RXZlbnQpOiBQcm9taXNlPEFQSUdhdGV3YXlQcm94eVJlc3VsdD4gPT4ge1xyXG4gICAgY29uc29sZS5sb2coXCJyZXF1ZXN0OlwiLCBKU09OLnN0cmluZ2lmeShldmVudCkpO1xyXG5cclxuICAgIGNvbnN0IGNsaWVudCA9IG5ldyBEeW5hbW9EQkNsaWVudCh7fSk7XHJcbiAgICBjb25zdCBkeW5hbW8gPSBEeW5hbW9EQkRvY3VtZW50Q2xpZW50LmZyb20oY2xpZW50KTtcclxuXHJcbiAgICBjb25zdCBoZWFkZXJzID0ge1xyXG4gICAgICAgIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVyc1wiOiAnQ29udGVudC1UeXBlLFgtQW16LURhdGUsQXV0aG9yaXphdGlvbixYLUFwaS1LZXksWC1BbXotU2VjdXJpdHktVG9rZW4nLFxyXG4gICAgICAgIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luXCI6ICcqJyxcclxuICAgICAgICBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHNcIjogJyonXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGludmFsaWREYXRhUmVzcG9uc2UgPSB7XHJcbiAgICAgICAgc3RhdHVzQ29kZTogNDAwLFxyXG4gICAgICAgIGhlYWRlcnMsXHJcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBtZXNzYWdlOiBcIlByb2R1Y3QgZGF0YSBpcyBpbnZhbGlkXCIgfSlcclxuICAgIH07XHJcbiAgICBcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVxdWVzdEJvZHkgPSBldmVudC5ib2R5O1xyXG4gICAgICAgIGlmICghcmVxdWVzdEJvZHkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGludmFsaWREYXRhUmVzcG9uc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgcGFyc2VkUmVxdWVzdEJvZHkgPSBKU09OLnBhcnNlKHJlcXVlc3RCb2R5KTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZXF1ZXN0Qm9keTpcIiwgcGFyc2VkUmVxdWVzdEJvZHkpO1xyXG4gICAgICAgICAgICBjb25zdCB7IHRpdGxlLCBkZXNjcmlwdGlvbiwgcHJpY2UsIGNvdW50IH0gPSBwYXJzZWRSZXF1ZXN0Qm9keTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IGluY29ycmVjdEZpZWxkVHlwZSA9IHR5cGVvZiB0aXRsZSAhPT0gJ3N0cmluZycgfHwgdHlwZW9mIGRlc2NyaXB0aW9uICE9PSAnc3RyaW5nJyB8fCB0eXBlb2YgcHJpY2UgIT09ICdudW1iZXInIHx8IHR5cGVvZiBjb3VudCAhPT0gJ251bWJlcic7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCByZXF1aXJlZEZpZWxkcyA9IFsndGl0bGUnLCAnZGVzY3JpcHRpb24nLCAncHJpY2UnLCAnY291bnQnXTtcclxuICAgICAgICAgICAgY29uc3QgaGFzQWxsUmVxdWlyZWRGaWVsZHMgPSByZXF1aXJlZEZpZWxkcy5ldmVyeShmaWVsZCA9PiBwYXJzZWRSZXF1ZXN0Qm9keS5oYXNPd25Qcm9wZXJ0eShmaWVsZCkpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKCFoYXNBbGxSZXF1aXJlZEZpZWxkcyB8fCBpbmNvcnJlY3RGaWVsZFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpbnZhbGlkRGF0YVJlc3BvbnNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwcm9kdWN0SWQgPSByYW5kb21VVUlEKCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0cmFuc2FjdGlvbkNvbW1hbmQgPSBuZXcgVHJhbnNhY3RXcml0ZUNvbW1hbmQoe1xyXG4gICAgICAgICAgICAgICAgVHJhbnNhY3RJdGVtczogW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUHV0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUYWJsZU5hbWU6IHByb2Nlc3MuZW52LlBST0RVQ1RTX1RBQkxFX05BTUUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJdGVtOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IHByb2R1Y3RJZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFB1dDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVGFibGVOYW1lOiBwcm9jZXNzLmVudi5TVE9DS1NfVEFCTEVfTkFNRSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEl0ZW06IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9kdWN0X2lkOiBwcm9kdWN0SWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhd2FpdCBkeW5hbW8uc2VuZCh0cmFuc2FjdGlvbkNvbW1hbmQpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDIwMCxcclxuICAgICAgICAgICAgICAgIGhlYWRlcnMsXHJcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7cmVzcG9uc2U6YENyZWF0ZWQgaXRlbSAke3BhcnNlZFJlcXVlc3RCb2R5LnRpdGxlfWB9KVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIGZldGNoaW5nIHByb2R1Y3RzIGZyb20gRHluYW1vREJcIiwgZXJyb3IpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDUwMCxcclxuICAgICAgICAgICAgaGVhZGVycyxcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBtZXNzYWdlOiBcIkludGVybmFsIFNlcnZlciBFcnJvclwiIH0pXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSJdfQ==