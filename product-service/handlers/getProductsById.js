const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();

export const getProductsById = async (event) => {
  console.log("Incoming request:", event);
  const pathParams = event.pathParameters || {};
  const productId = pathParams.productId;
  try {
    const product = await documentClient
      .get({
        TableName: process.env.PRODUCTS_TABLE,
        Key: { id: productId },
      })
      .promise();

    console.log(product);

    if (!product.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Product not found" }),
      };
    }

    const stock = await documentClient
      .get({
        TableName: process.env.STOCKS_TABLE,
        Key: { product_id: productId },
      })
      .promise();

    const response = {
      ...product.Item,
      count: stock.Item ? stock.Item.count : 0,
    };

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(response),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error getting product", error: err }),
    };
  }
};
