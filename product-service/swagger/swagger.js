// this file was generated by serverless-auto-swagger
            module.exports = {
  "swagger": "2.0",
  "info": {
    "title": "products-service",
    "version": "1"
  },
  "paths": {
    "/products": {
      "get": {
        "summary": "getProductsList",
        "description": "",
        "operationId": "getProductsList.get./products",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [],
        "responses": {
          "200": {
            "description": "successful Api Response",
            "schema": {
              "$ref": "#/definitions/Product"
            }
          },
          "500": {
            "description": "An error occurred while retrieving products."
          }
        }
      },
      "post": {
        "summary": "createProduct",
        "description": "",
        "operationId": "createProduct.post.products",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [],
        "responses": {
          "200": {
            "description": "Product created successfully",
            "schema": {
              "$ref": "#/definitions/Product"
            }
          },
          "400": {
            "description": "Error creating product, product data is invalid"
          },
          "500": {
            "description": "Error creating product"
          }
        }
      }
    },
    "/products/{productId}": {
      "get": {
        "summary": "getProductsById",
        "description": "",
        "operationId": "getProductsById.get.products/{productId}",
        "consumes": [
          "application/json"
        ],
        "produces": [
          "application/json"
        ],
        "parameters": [
          {
            "name": "productId",
            "in": "path",
            "required": true,
            "type": "string"
          }
        ],
        "responses": {
          "200": {
            "description": "successful Api Response",
            "schema": {
              "$ref": "#/definitions/Product"
            }
          },
          "404": {
            "description": "Product not found"
          },
          "500": {
            "description": "Error getting product"
          }
        }
      }
    }
  },
  "definitions": {
    "Product": {
      "properties": {
        "id": {
          "title": "Product.id",
          "type": "string"
        },
        "title": {
          "title": "Product.title",
          "type": "string"
        },
        "author": {
          "title": "Product.author",
          "type": "string"
        },
        "count": {
          "title": "Product.count",
          "type": "number"
        },
        "description": {
          "title": "Product.description",
          "type": "string"
        },
        "price": {
          "title": "Product.price",
          "type": "number"
        }
      },
      "required": [
        "id",
        "title",
        "author",
        "count",
        "description",
        "price"
      ],
      "additionalProperties": false,
      "title": "Product",
      "type": "object"
    }
  },
  "securityDefinitions": {}
};