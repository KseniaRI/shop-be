"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
exports.handler = async (event) => {
    console.log("request:", JSON.stringify(event));
    const client = new client_dynamodb_1.DynamoDBClient({});
    const dynamo = lib_dynamodb_1.DynamoDBDocumentClient.from(client);
    const headers = {
        "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        "Access-Control-Allow-Origin": '*',
        "Access-Control-Allow-Methods": '*'
    };
    try {
        const body = await dynamo.send(new lib_dynamodb_1.GetCommand({
            TableName: 'products',
            Key: {
                id: event.pathParameters?.id
            }
        }));
        if (body.Item) {
            const response = {
                statusCode: 200,
                headers,
                body: JSON.stringify(body.Item)
            };
            return response;
        }
        else {
            const response = {
                statusCode: 404,
                headers,
                body: JSON.stringify({ message: "Product not found" })
            };
            return response;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0UHJvZHVjdEJ5SWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJnZXRQcm9kdWN0QnlJZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDhEQUEwRDtBQUMxRCx3REFBMkU7QUFFM0UsT0FBTyxDQUFDLE9BQU8sR0FBRyxLQUFLLEVBQUUsS0FBMkIsRUFBa0MsRUFBRTtJQUNwRixPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFFL0MsTUFBTSxNQUFNLEdBQUcsSUFBSSxnQ0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLE1BQU0sTUFBTSxHQUFHLHFDQUFzQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVuRCxNQUFNLE9BQU8sR0FBRztRQUNaLDhCQUE4QixFQUFFLHNFQUFzRTtRQUN0Ryw2QkFBNkIsRUFBRSxHQUFHO1FBQ2xDLDhCQUE4QixFQUFFLEdBQUc7S0FDdEMsQ0FBQTtJQUVELElBQUksQ0FBQztRQUNELE1BQU0sSUFBSSxHQUFHLE1BQU0sTUFBTSxDQUFDLElBQUksQ0FDMUIsSUFBSSx5QkFBVSxDQUFDO1lBQ1gsU0FBUyxFQUFFLFVBQVU7WUFDckIsR0FBRyxFQUFFO2dCQUNELEVBQUUsRUFBRyxLQUFLLENBQUMsY0FBYyxFQUFFLEVBQUU7YUFDaEM7U0FDSixDQUFDLENBQ0wsQ0FBQTtRQUVELElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ1osTUFBTSxRQUFRLEdBQUc7Z0JBQ2IsVUFBVSxFQUFFLEdBQUc7Z0JBQ2YsT0FBTztnQkFDUCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQ2xDLENBQUM7WUFDRixPQUFPLFFBQVEsQ0FBQztRQUNwQixDQUFDO2FBQU0sQ0FBQztZQUNKLE1BQU0sUUFBUSxHQUFHO2dCQUNiLFVBQVUsRUFBRSxHQUFHO2dCQUNmLE9BQU87Z0JBQ1AsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsQ0FBQzthQUN6RCxDQUFBO1lBQ0QsT0FBTyxRQUFRLENBQUM7UUFDcEIsQ0FBQztJQUNMLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyx1Q0FBdUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM3RCxPQUFPO1lBQ0osVUFBVSxFQUFFLEdBQUc7WUFDZixPQUFPO1lBQ1AsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsQ0FBQztTQUM3RCxDQUFDO0lBQ04sQ0FBQztBQUNMLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFQSUdhdGV3YXlQcm94eUV2ZW50LCBBUElHYXRld2F5UHJveHlSZXN1bHQgfSBmcm9tICdhd3MtbGFtYmRhJztcclxuaW1wb3J0IHsgRHluYW1vREJDbGllbnQgfSBmcm9tIFwiQGF3cy1zZGsvY2xpZW50LWR5bmFtb2RiXCI7XHJcbmltcG9ydCB7IER5bmFtb0RCRG9jdW1lbnRDbGllbnQsIEdldENvbW1hbmQgfSBmcm9tIFwiQGF3cy1zZGsvbGliLWR5bmFtb2RiXCI7XHJcblxyXG5leHBvcnRzLmhhbmRsZXIgPSBhc3luYyAoZXZlbnQ6IEFQSUdhdGV3YXlQcm94eUV2ZW50KTogUHJvbWlzZTxBUElHYXRld2F5UHJveHlSZXN1bHQ+ID0+IHtcclxuICAgIGNvbnNvbGUubG9nKFwicmVxdWVzdDpcIiwgSlNPTi5zdHJpbmdpZnkoZXZlbnQpKTtcclxuICAgIFxyXG4gICAgY29uc3QgY2xpZW50ID0gbmV3IER5bmFtb0RCQ2xpZW50KHt9KTtcclxuICAgIGNvbnN0IGR5bmFtbyA9IER5bmFtb0RCRG9jdW1lbnRDbGllbnQuZnJvbShjbGllbnQpO1xyXG5cclxuICAgIGNvbnN0IGhlYWRlcnMgPSB7XHJcbiAgICAgICAgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzXCI6ICdDb250ZW50LVR5cGUsWC1BbXotRGF0ZSxBdXRob3JpemF0aW9uLFgtQXBpLUtleSxYLUFtei1TZWN1cml0eS1Ub2tlbicsXHJcbiAgICAgICAgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIjogJyonLFxyXG4gICAgICAgIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kc1wiOiAnKidcclxuICAgIH1cclxuICAgIFxyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBib2R5ID0gYXdhaXQgZHluYW1vLnNlbmQoXHJcbiAgICAgICAgICAgIG5ldyBHZXRDb21tYW5kKHtcclxuICAgICAgICAgICAgICAgIFRhYmxlTmFtZTogJ3Byb2R1Y3RzJyxcclxuICAgICAgICAgICAgICAgIEtleToge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkOiAgZXZlbnQucGF0aFBhcmFtZXRlcnM/LmlkXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pICBcclxuICAgICAgICApXHJcblxyXG4gICAgICAgIGlmIChib2R5Lkl0ZW0pIHtcclxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDAsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzLFxyXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoYm9keS5JdGVtKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDQsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzLFxyXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBtZXNzYWdlOiBcIlByb2R1Y3Qgbm90IGZvdW5kXCIgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcbiAgICAgICAgfSAgIFxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgZmV0Y2hpbmcgcHJvZHVjdHMgZnJvbSBEeW5hbW9EQlwiLCBlcnJvcik7XHJcbiAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDUwMCxcclxuICAgICAgICAgICAgaGVhZGVycyxcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBtZXNzYWdlOiBcIkludGVybmFsIFNlcnZlciBFcnJvclwiIH0pXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSJdfQ==