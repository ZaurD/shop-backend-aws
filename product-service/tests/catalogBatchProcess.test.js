
import * as AWSMock from "aws-sdk-mock";
import { catalogBatchProcess } from '../handlers/catalogBatchProcess';

describe('catalogBatchProcess', () => {
  beforeEach(() => {
    AWSMock.mock('DynamoDB.DocumentClient', 'batchWrite', (params, callback) => {
      callback(null, 'success');
    });

    AWSMock.mock('SNS', 'publish', (params, callback) => {
      callback(null, 'success');
    });
  });

  afterEach(() => {
    AWSMock.restore('DynamoDB.DocumentClient');
    AWSMock.restore('SNS');
  });

  it('should create products and stocks, publish a message to SNS, and return a success response', async () => {
    const event = {
      Records: [
        {
          body: JSON.stringify({
            id: '123',
            title: 'Test Product',
            author: 'Test Author',
            description: 'Test Description',
            price: 10,
            count: 5
          })
        }
      ]
    };

    const response = await catalogBatchProcess(event);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(JSON.stringify({
      message: `Product were created successfully`
    }));
  });

  it('should return an error response if an error occurs while creating products and stocks', async () => {
    AWSMock.mock('DynamoDB.DocumentClient', 'batchWrite', (params, callback) => {
      callback(new Error('Something went wrong'), null);
    });

    const event = {
      Records: [
        {
          body: JSON.stringify({
            id: '123',
            title: 'Test Product',
            author: 'Test Author',
            description: 'Test Description',
            price: 10,
            count: 5
          })
        }
      ]
    };

    const response = await catalogBatchProcess(event);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(JSON.stringify({
      message: 'An error occurred while creating product'
    }));
  });
});
