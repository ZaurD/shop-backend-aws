const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

export const catalogBatchProcess = async (event) => {
  try {
    const product = event.Records.map(record => JSON.parse(record.body));
    const putRequests = product.map(product => ({
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

    const stockPutRequests = product.map(product => ({
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

    const snsParams = {
      Message: `Created ${JSON.stringify(product)} product`,
      TopicArn: process.env.SNS_ARN,
      MessageAttributes: {
        price: {
          DataType: "Number",
          StringValue: String(product[0].price),
        },
      }
    };
    
    await sns.publish(snsParams).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Product were created successfully`
      })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'An error occurred while creating product'
      })
    };
  }
};
