const { handler } = require('../lambda/importFileParser');
import { S3Event } from 'aws-lambda';
import { S3Client } from '@aws-sdk/client-s3';

jest.mock('@aws-sdk/client-s3');

describe('Parser test', () => {
    let consoleLogSpy: jest.SpyInstance;
    
    beforeEach(() => {
        jest.clearAllMocks();
        consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });

    it('should log parsed csv', async () => {
        const mockEvent: S3Event = {
            Records: [
                {
                    s3: {
                        bucket: { name: 'test-bucket' },
                        object: { key: 'uploaded/test.csv' }
                    }
                }
            ] as any
        };
        
        const mockSend = jest.fn();

        (S3Client as jest.Mock).mockImplementation(() => ({
            send: mockSend
        }));
        mockSend.mockResolvedValueOnce({
            Body: createMockReadableStream('id;name;stock\n1;Product A;10\n2;Product B;5\n')
        });

        await handler(mockEvent);

        expect(mockSend).toHaveBeenCalledTimes(3); 
        expect(consoleLogSpy).toHaveBeenCalledWith([
            { id: '1', name: 'Product A', stock: '10' },
            { id: '2', name: 'Product B', stock: '5' }
        ]);
    });
});

function createMockReadableStream(data: string): NodeJS.ReadableStream {
    const { Readable } = require('stream');
    const rs = new Readable();
    rs._read = () => {};
    rs.push(data);
    rs.push(null);
    
    return rs;
}