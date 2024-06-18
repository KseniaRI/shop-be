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
        const body = await dynamo.send(new lib_dynamodb_1.ScanCommand({ TableName: 'products' }));
        const response = {
            statusCode: 200,
            headers,
            body: JSON.stringify(body.Items)
        };
        return response;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0UHJvZHVjdHNMaXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZ2V0UHJvZHVjdHNMaXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsOERBQTBEO0FBQzFELHdEQUE0RTtBQUU1RSxPQUFPLENBQUMsT0FBTyxHQUFHLEtBQUssRUFBRSxLQUEyQixFQUFrQyxFQUFFO0lBQ3BGLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUUvQyxNQUFNLE1BQU0sR0FBRyxJQUFJLGdDQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdEMsTUFBTSxNQUFNLEdBQUcscUNBQXNCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRW5ELE1BQU0sT0FBTyxHQUFHO1FBQ1osOEJBQThCLEVBQUUsc0VBQXNFO1FBQ3RHLDZCQUE2QixFQUFFLEdBQUc7UUFDbEMsOEJBQThCLEVBQUUsR0FBRztLQUN0QyxDQUFBO0lBRUQsSUFBSSxDQUFDO1FBQ0QsTUFBTSxJQUFJLEdBQUcsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUM1QixJQUFJLDBCQUFXLENBQUMsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FDM0MsQ0FBQztRQUVGLE1BQU0sUUFBUSxHQUFHO1lBQ2IsVUFBVSxFQUFFLEdBQUc7WUFDZixPQUFPO1lBQ1AsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztTQUNuQyxDQUFDO1FBQ0YsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFDLENBQUM7UUFDWixPQUFPLENBQUMsS0FBSyxDQUFDLHVDQUF1QyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzdELE9BQU87WUFDSixVQUFVLEVBQUUsR0FBRztZQUNmLE9BQU87WUFDUCxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxDQUFDO1NBQzdELENBQUM7SUFDTixDQUFDO0FBQ0wsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQVBJR2F0ZXdheVByb3h5RXZlbnQsIEFQSUdhdGV3YXlQcm94eVJlc3VsdCB9IGZyb20gJ2F3cy1sYW1iZGEnO1xyXG5pbXBvcnQgeyBEeW5hbW9EQkNsaWVudCB9IGZyb20gXCJAYXdzLXNkay9jbGllbnQtZHluYW1vZGJcIjtcclxuaW1wb3J0IHsgRHluYW1vREJEb2N1bWVudENsaWVudCwgU2NhbkNvbW1hbmQgfSBmcm9tIFwiQGF3cy1zZGsvbGliLWR5bmFtb2RiXCI7XHJcbiAgICBcclxuZXhwb3J0cy5oYW5kbGVyID0gYXN5bmMgKGV2ZW50OiBBUElHYXRld2F5UHJveHlFdmVudCk6IFByb21pc2U8QVBJR2F0ZXdheVByb3h5UmVzdWx0PiA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhcInJlcXVlc3Q6XCIsIEpTT04uc3RyaW5naWZ5KGV2ZW50KSk7XHJcbiAgICBcclxuICAgIGNvbnN0IGNsaWVudCA9IG5ldyBEeW5hbW9EQkNsaWVudCh7fSk7XHJcbiAgICBjb25zdCBkeW5hbW8gPSBEeW5hbW9EQkRvY3VtZW50Q2xpZW50LmZyb20oY2xpZW50KTtcclxuXHJcbiAgICBjb25zdCBoZWFkZXJzID0ge1xyXG4gICAgICAgIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVyc1wiOiAnQ29udGVudC1UeXBlLFgtQW16LURhdGUsQXV0aG9yaXphdGlvbixYLUFwaS1LZXksWC1BbXotU2VjdXJpdHktVG9rZW4nLFxyXG4gICAgICAgIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luXCI6ICcqJyxcclxuICAgICAgICBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU1ldGhvZHNcIjogJyonXHJcbiAgICB9XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBib2R5ID0gYXdhaXQgZHluYW1vLnNlbmQoXHJcbiAgICAgICAgICBuZXcgU2NhbkNvbW1hbmQoeyBUYWJsZU5hbWU6ICdwcm9kdWN0cycgfSlcclxuICAgICAgICApO1xyXG4gICAgXHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB7XHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDIwMCxcclxuICAgICAgICAgICAgaGVhZGVycyxcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoYm9keS5JdGVtcylcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKXtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgZmV0Y2hpbmcgcHJvZHVjdHMgZnJvbSBEeW5hbW9EQlwiLCBlcnJvcik7XHJcbiAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDUwMCxcclxuICAgICAgICAgICAgaGVhZGVycyxcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBtZXNzYWdlOiBcIkludGVybmFsIFNlcnZlciBFcnJvclwiIH0pXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufTsiXX0=