import * as AWS from "aws-sdk";
const s3 = new AWS.S3();

export const importProductsFile = async (event) => {
  console.log(event);
  const {
    queryStringParameters: { name },
  } = event;

  if (!name) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing name parameter" }),
    };
  }

  const params = {
    Bucket: "import-service-s3bucket",
    Key: `uploaded/${name}`,
    Expires: 60,
    ContentType: "text/csv",
  };

  try {
    const signedUrl = await s3.getSignedUrlPromise("putObject", params);

    return {
      statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "https://d10oh2u1zxq3h3.cloudfront.net",
          "Access-Control-Allow-Credentials": true
        },
      body: JSON.stringify({ url: signedUrl }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error getting signed URL" }),
    };
  }
};
