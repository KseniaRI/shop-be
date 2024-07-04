import { SQSEvent } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

jest.mock('@aws-sdk/lib-dynamodb', () => ({
    DynamoDBDocumentClient: {
        from: jest.fn((client: DynamoDBClient) => ({
            send: jest.fn(),
        })),
    },
    TransactWriteCommand: jest.fn(),
}));

jest.mock('@aws-sdk/client-sns', () => ({
    SNSClient: jest.fn(() => ({
        send: jest.fn(),
    })),
    PublishCommand: jest.fn(),
}));
const { handler } = require('../lambda/catalogBatchProcess');

describe('catalogBatchProcess handler', () => {
    beforeEach(() => {
        jest.clearAllMocks(); 
    });

    it('should process SQS event and send messages to SNS', async () => {
        const event: SQSEvent = {
            Records: [
                {
                    messageId: '123457',
                    receiptHandle: 'receiptHandle2',
                    body: JSON.stringify([
                        {
                            title: 'Product',
                            description: 'Description 2',
                            price: 15, 
                            count: 3,
                        },
                    ]),
                    attributes: {
                        ApproximateReceiveCount: '1',
                        SentTimestamp: 'timestamp',
                        SenderId: 'senderId',
                        ApproximateFirstReceiveTimestamp: 'firstTimestamp',
                    },
                    messageAttributes: {},
                    md5OfBody: 'md5Hash',
                    eventSource: 'eventSource',
                    eventSourceARN: 'eventSourceARN',
                    awsRegion: 'awsRegion',
                },
            ],
        };

        await handler(event); 

        expect(DynamoDBDocumentClient.from).toHaveBeenCalledTimes(1); 
        expect(SNSClient).toHaveBeenCalledTimes(1); 
        expect(DynamoDBDocumentClient.from).toHaveBeenCalledWith(expect.any(DynamoDBClient));
        
        const publishCommandParams = (PublishCommand as unknown as jest.Mock).mock.calls;
        
        expect(publishCommandParams[0][0].Message).toContain('price: 15, description: Description 2, count: 3');
    }); 
});