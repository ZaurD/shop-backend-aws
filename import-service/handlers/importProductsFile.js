const AWS = require('aws-sdk');
const s3 = new AWS.S3();

export const importProductsFile = async (event, context) => {
  const name = event.queryStringParameters?.name;
  if (!name) {
    return {
      statusCode: 400,
      body: 'Missing query parameter: name'
    };
  }

  const key = `uploaded/${name}`;
  const params = {
    Bucket: 'import-service-s3bucket',
    Key: key,
    Expires: 60
  };

  try {
    const url = await s3.getSignedUrlPromise('putObject', params);
    return {
      statusCode: 200,
      body: JSON.stringify({ signedUrl: url })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: 'Error generating signed URL'
    };
  }
}
