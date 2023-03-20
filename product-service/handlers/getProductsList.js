const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const getProductsList = async (event) => {
  console.log("Incoming request:", event);
  const params = {
    TableName: process.env.PRODUCTS_TABLE,
  };

  try {
    const result = await dynamodb.scan(params).promise();
    const products = result.Items;

    for (let i = 0; i < products.length; i++) {
      const productId = products[i].id;
      const stocksParams = {
        TableName: process.env.STOCKS_TABLE,
        Key: {
          product_id: productId,
        },
      };
      const stocksResult = await dynamodb.get(stocksParams).promise();
      const count = stocksResult.Item ? stocksResult.Item.count : 0;
      products[i].count = count;
    }

    console.log("Returning response:", products);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(products),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while retrieving products.",
      }),
    };
  }
};
