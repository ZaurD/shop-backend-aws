import { products } from '../products'

export const getProductsById = async (event) => {
  const pathParams = event.pathParameters || {};
  const productId = pathParams.productId;
  const product = products.find((p) => p.id === productId);

  if (!product) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Product not found" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(product),
  };
};
