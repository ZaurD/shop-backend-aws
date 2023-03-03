const AWS = require("aws-sdk");
const uuid = require("uuid");

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const createProduct = async (event) => {
  console.log("Incoming request:", event);

  const { title, price, author, description, count } = JSON.parse(event.body);

  if (!title || !price || !author || !description || !count) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid product data",
      }),
    };
  }

  const productId = uuid.v4();

  const productParams = {
    TableName: process.env.PRODUCTS_TABLE,
    Item: {
      id: productId,
      title,
      price,
      author,
      description,
    },
  };

  const stockParams = {
    TableName: process.env.STOCKS_TABLE,
    Item: {
      id: productId,
      count,
    },
  };

  const transactionParams = {
    TransactItems: [
      {
        Put: productParams,
      },
      {
        Put: stockParams,
      },
    ],
  };

  try {
    await dynamoDB.transactWrite(transactionParams).promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
      body: JSON.stringify({
        message: "Product created successfully",
        product: {
          id: productId,
          title,
          price,
          author,
          description,
          count
        },
      }),
    };
  } catch (error) {
    console.error("Error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error creating product",
        error: error,
      }),
    };
  }
};
