const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

export const catalogBatchProcess = async (event) => {
  try {
    const products = event.Records.map(record => JSON.parse(record.body));
    const putRequests = products.map(product => ({
      PutRequest: {
        Item: {
          id: product.id,
          title: product.title,
          author: product.author,
          description: product.description,
          price: product.price,
        }
      }
    }));
    const params = {
      RequestItems: {
        [process.env.PRODUCTS_TABLE]: putRequests
      }
    };

    const stockPutRequests = products.map(product => ({
      PutRequest: {
        Item: {
          product_id: product.id,
          count: product.count
        }
      }
    }));
    const stockParams = {
      RequestItems: {
        [process.env.STOCKS_TABLE]: stockPutRequests
      }
    };
    await dynamodb.batchWrite(params).promise();
    await dynamodb.batchWrite(stockParams).promise();
    console.log(`${products.length} products were created successfully`);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `${products.length} products were created successfully`
      })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'An error occurred while creating products'
      })
    };
  }
};
