import * as AWSMock from "aws-sdk-mock";
import { importProductsFile } from "./importProductsFile";

describe('importProductsFile', () => {
  const mockEvent = {
    queryStringParameters: {
      name: 'test.csv',
    },
  };

  afterEach(() => {
    AWSMock.restore();
  });

  it('returns a signed URL when given a name parameter', async () => {
    const mockUrl = 'https://import-service-s3bucket.s3.amazonaws.com/uploaded/test.csv';
    AWSMock.mock('S3', 'getSignedUrlPromise', (callback) => {
      callback(null, mockUrl);
    });

    const response = await importProductsFile(mockEvent);

    expect(response.statusCode).toBe(200);
    expect(response.headers['Access-Control-Allow-Origin']).toBe('*');
    expect(response.headers['Access-Control-Allow-Credentials']).toBe(true);

    const responseBody = JSON.parse(response.body);
    expect(responseBody.url).toContain(mockUrl);
  });

  it('returns an error when missing name parameter', async () => {
    const response = await importProductsFile({ queryStringParameters: {} });

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({ error: 'Missing name parameter' });
  });
});
