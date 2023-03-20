import { getProductsById } from '../handlers/getProductsById';

const mockEvent = {
  pathParameters: {
    productId: "001",
  },
};

const expectedProduct = {
  id: "001",
  title: "The Alchemist's Secret",
  author: "Scott Mariani",
  count: 2,
  description: "A thriller novel that follows ex-SAS soldier Ben Hope as he tries to uncover the truth behind a mysterious alchemist's manuscript.",
  price: 10.99
};

describe("getProductsById", () => {
  it("returns the product when it is found", async () => {
    const result = await getProductsById(mockEvent);
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(JSON.stringify(expectedProduct));
  });

  it("returns an error when the product is not found", async () => {
    const mockEvent = {
      pathParameters: {
        productId: "invalid-id",
      },
    };
    const result = await getProductsById(mockEvent);
    expect(result.statusCode).toBe(404);
  });
});
