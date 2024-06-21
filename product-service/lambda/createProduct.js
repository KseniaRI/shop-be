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
                            TableName: 'products',
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
                            TableName: 'stocks',
                            Item: {
                                product_id: productId,
                                count
                            }
                        }
                    }
                ]
            });
            await dynamo.send(transactionCommand);
            // await dynamo.send(
            //     new PutCommand({
            //         TableName: 'products',
            //         Item: {
            //             id: productId,
            //             price,
            //             title,
            //             description
            //         },
            //     })
            // );
            // await dynamo.send(
            //     new PutCommand({
            //         TableName: 'stocks',
            //         Item: {
            //             product_id: productId,
            //             count
            //         },
            //     })
            // );
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlUHJvZHVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNyZWF0ZVByb2R1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw4REFBMEQ7QUFDMUQsd0RBQWlHO0FBQ2pHLG1DQUFvQztBQUVwQyxPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUssRUFBRSxLQUEyQixFQUFrQyxFQUFFO0lBQ3BGLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUUvQyxNQUFNLE1BQU0sR0FBRyxJQUFJLGdDQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdEMsTUFBTSxNQUFNLEdBQUcscUNBQXNCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRW5ELE1BQU0sT0FBTyxHQUFHO1FBQ1osOEJBQThCLEVBQUUsc0VBQXNFO1FBQ3RHLDZCQUE2QixFQUFFLEdBQUc7UUFDbEMsOEJBQThCLEVBQUUsR0FBRztLQUN0QyxDQUFDO0lBRUYsTUFBTSxtQkFBbUIsR0FBRztRQUN4QixVQUFVLEVBQUUsR0FBRztRQUNmLE9BQU87UUFDUCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxDQUFDO0tBQy9ELENBQUM7SUFFRixJQUFJLENBQUM7UUFDRCxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1FBQy9CLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNmLE9BQU8sbUJBQW1CLENBQUM7UUFDL0IsQ0FBQzthQUFNLENBQUM7WUFDSixNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUE7WUFDakQsTUFBTSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLGlCQUFpQixDQUFDO1lBRS9ELE1BQU0sa0JBQWtCLEdBQUcsT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLE9BQU8sV0FBVyxLQUFLLFFBQVEsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxDQUFDO1lBRWxKLE1BQU0sY0FBYyxHQUFHLENBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDbEUsTUFBTSxvQkFBb0IsR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsaUJBQWlCLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFFcEcsSUFBSSxDQUFDLG9CQUFvQixJQUFJLGtCQUFrQixFQUFFLENBQUM7Z0JBQzlDLE9BQU8sbUJBQW1CLENBQUM7WUFDL0IsQ0FBQztZQUVELE1BQU0sU0FBUyxHQUFHLElBQUEsbUJBQVUsR0FBRSxDQUFDO1lBRS9CLE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxtQ0FBb0IsQ0FBQztnQkFDaEQsYUFBYSxFQUFFO29CQUNYO3dCQUNJLEdBQUcsRUFBRTs0QkFDRCxTQUFTLEVBQUUsVUFBVTs0QkFDckIsSUFBSSxFQUFFO2dDQUNGLEVBQUUsRUFBRSxTQUFTO2dDQUNiLEtBQUs7Z0NBQ0wsS0FBSztnQ0FDTCxXQUFXOzZCQUNkO3lCQUNKO3FCQUNKO29CQUNEO3dCQUNJLEdBQUcsRUFBRTs0QkFDRCxTQUFTLEVBQUUsUUFBUTs0QkFDbkIsSUFBSSxFQUFFO2dDQUNGLFVBQVUsRUFBRSxTQUFTO2dDQUNyQixLQUFLOzZCQUNSO3lCQUNKO3FCQUNKO2lCQUNKO2FBQ0osQ0FBQyxDQUFDO1lBRUgsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFFdEMscUJBQXFCO1lBQ3JCLHVCQUF1QjtZQUN2QixpQ0FBaUM7WUFDakMsa0JBQWtCO1lBQ2xCLDZCQUE2QjtZQUM3QixxQkFBcUI7WUFDckIscUJBQXFCO1lBQ3JCLDBCQUEwQjtZQUMxQixhQUFhO1lBQ2IsU0FBUztZQUNULEtBQUs7WUFDTCxxQkFBcUI7WUFDckIsdUJBQXVCO1lBQ3ZCLCtCQUErQjtZQUMvQixrQkFBa0I7WUFDbEIscUNBQXFDO1lBQ3JDLG9CQUFvQjtZQUNwQixhQUFhO1lBQ2IsU0FBUztZQUNULEtBQUs7WUFDTCxPQUFPO2dCQUNILFVBQVUsRUFBRSxHQUFHO2dCQUNmLE9BQU87Z0JBQ1AsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBQyxRQUFRLEVBQUMsZ0JBQWdCLGlCQUFpQixDQUFDLEtBQUssRUFBRSxFQUFDLENBQUM7YUFDN0UsQ0FBQztRQUNOLENBQUM7SUFDTCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsdUNBQXVDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDOUQsT0FBTztZQUNILFVBQVUsRUFBRSxHQUFHO1lBQ2YsT0FBTztZQUNQLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLENBQUM7U0FDN0QsQ0FBQztJQUNOLENBQUM7QUFDTCxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBUElHYXRld2F5UHJveHlFdmVudCwgQVBJR2F0ZXdheVByb3h5UmVzdWx0IH0gZnJvbSAnYXdzLWxhbWJkYSc7XHJcbmltcG9ydCB7IER5bmFtb0RCQ2xpZW50IH0gZnJvbSBcIkBhd3Mtc2RrL2NsaWVudC1keW5hbW9kYlwiO1xyXG5pbXBvcnQgeyBEeW5hbW9EQkRvY3VtZW50Q2xpZW50LCBQdXRDb21tYW5kLCBUcmFuc2FjdFdyaXRlQ29tbWFuZCB9IGZyb20gXCJAYXdzLXNkay9saWItZHluYW1vZGJcIjtcclxuaW1wb3J0IHsgcmFuZG9tVVVJRCB9IGZyb20gJ2NyeXB0byc7XHJcblxyXG5leHBvcnRzLmhhbmRsZXIgPSBhc3luYyAoZXZlbnQ6IEFQSUdhdGV3YXlQcm94eUV2ZW50KTogUHJvbWlzZTxBUElHYXRld2F5UHJveHlSZXN1bHQ+ID0+IHtcclxuICAgIGNvbnNvbGUubG9nKFwicmVxdWVzdDpcIiwgSlNPTi5zdHJpbmdpZnkoZXZlbnQpKTtcclxuXHJcbiAgICBjb25zdCBjbGllbnQgPSBuZXcgRHluYW1vREJDbGllbnQoe30pO1xyXG4gICAgY29uc3QgZHluYW1vID0gRHluYW1vREJEb2N1bWVudENsaWVudC5mcm9tKGNsaWVudCk7XHJcblxyXG4gICAgY29uc3QgaGVhZGVycyA9IHtcclxuICAgICAgICBcIkFjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnNcIjogJ0NvbnRlbnQtVHlwZSxYLUFtei1EYXRlLEF1dGhvcml6YXRpb24sWC1BcGktS2V5LFgtQW16LVNlY3VyaXR5LVRva2VuJyxcclxuICAgICAgICBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpblwiOiAnKicsXHJcbiAgICAgICAgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1NZXRob2RzXCI6ICcqJ1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBpbnZhbGlkRGF0YVJlc3BvbnNlID0ge1xyXG4gICAgICAgIHN0YXR1c0NvZGU6IDQwMCxcclxuICAgICAgICBoZWFkZXJzLFxyXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgbWVzc2FnZTogXCJQcm9kdWN0IGRhdGEgaXMgaW52YWxpZFwiIH0pXHJcbiAgICB9O1xyXG4gICAgXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHJlcXVlc3RCb2R5ID0gZXZlbnQuYm9keTtcclxuICAgICAgICBpZiAoIXJlcXVlc3RCb2R5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpbnZhbGlkRGF0YVJlc3BvbnNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZFJlcXVlc3RCb2R5ID0gSlNPTi5wYXJzZShyZXF1ZXN0Qm9keSlcclxuICAgICAgICAgICAgY29uc3QgeyB0aXRsZSwgZGVzY3JpcHRpb24sIHByaWNlLCBjb3VudCB9ID0gcGFyc2VkUmVxdWVzdEJvZHk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBpbmNvcnJlY3RGaWVsZFR5cGUgPSB0eXBlb2YgdGl0bGUgIT09ICdzdHJpbmcnIHx8IHR5cGVvZiBkZXNjcmlwdGlvbiAhPT0gJ3N0cmluZycgfHwgdHlwZW9mIHByaWNlICE9PSAnbnVtYmVyJyB8fCB0eXBlb2YgY291bnQgIT09ICdudW1iZXInO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgcmVxdWlyZWRGaWVsZHMgPSBbJ3RpdGxlJywgJ2Rlc2NyaXB0aW9uJywgJ3ByaWNlJywgJ2NvdW50J107XHJcbiAgICAgICAgICAgIGNvbnN0IGhhc0FsbFJlcXVpcmVkRmllbGRzID0gcmVxdWlyZWRGaWVsZHMuZXZlcnkoZmllbGQgPT4gcGFyc2VkUmVxdWVzdEJvZHkuaGFzT3duUHJvcGVydHkoZmllbGQpKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICghaGFzQWxsUmVxdWlyZWRGaWVsZHMgfHwgaW5jb3JyZWN0RmllbGRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW52YWxpZERhdGFSZXNwb25zZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgcHJvZHVjdElkID0gcmFuZG9tVVVJRCgpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdHJhbnNhY3Rpb25Db21tYW5kID0gbmV3IFRyYW5zYWN0V3JpdGVDb21tYW5kKHtcclxuICAgICAgICAgICAgICAgIFRyYW5zYWN0SXRlbXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFB1dDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVGFibGVOYW1lOiAncHJvZHVjdHMnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSXRlbToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBwcm9kdWN0SWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQdXQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRhYmxlTmFtZTogJ3N0b2NrcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBJdGVtOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvZHVjdF9pZDogcHJvZHVjdElkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgYXdhaXQgZHluYW1vLnNlbmQodHJhbnNhY3Rpb25Db21tYW5kKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGF3YWl0IGR5bmFtby5zZW5kKFxyXG4gICAgICAgICAgICAvLyAgICAgbmV3IFB1dENvbW1hbmQoe1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIFRhYmxlTmFtZTogJ3Byb2R1Y3RzJyxcclxuICAgICAgICAgICAgLy8gICAgICAgICBJdGVtOiB7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIGlkOiBwcm9kdWN0SWQsXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIHByaWNlLFxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICB0aXRsZSxcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgZGVzY3JpcHRpb25cclxuICAgICAgICAgICAgLy8gICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyAgICAgfSlcclxuICAgICAgICAgICAgLy8gKTtcclxuICAgICAgICAgICAgLy8gYXdhaXQgZHluYW1vLnNlbmQoXHJcbiAgICAgICAgICAgIC8vICAgICBuZXcgUHV0Q29tbWFuZCh7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgVGFibGVOYW1lOiAnc3RvY2tzJyxcclxuICAgICAgICAgICAgLy8gICAgICAgICBJdGVtOiB7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIHByb2R1Y3RfaWQ6IHByb2R1Y3RJZCxcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgY291bnRcclxuICAgICAgICAgICAgLy8gICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyAgICAgfSlcclxuICAgICAgICAgICAgLy8gKTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHN0YXR1c0NvZGU6IDIwMCxcclxuICAgICAgICAgICAgICAgIGhlYWRlcnMsXHJcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7cmVzcG9uc2U6YENyZWF0ZWQgaXRlbSAke3BhcnNlZFJlcXVlc3RCb2R5LnRpdGxlfWB9KVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIGZldGNoaW5nIHByb2R1Y3RzIGZyb20gRHluYW1vREJcIiwgZXJyb3IpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDUwMCxcclxuICAgICAgICAgICAgaGVhZGVycyxcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBtZXNzYWdlOiBcIkludGVybmFsIFNlcnZlciBFcnJvclwiIH0pXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSJdfQ==