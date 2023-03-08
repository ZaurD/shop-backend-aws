import * as AWS from "aws-sdk";
import csv from "csv-parser";

const s3 = new AWS.S3();
const bucketName = "import-service-s3bucket";

export const importFileParser = async (event) => {
  try {
    const result = [];
    for (const record of event.Records) {
      const readable = s3
        .getObject({
          Bucket: bucketName,
          Key: record.s3.object.key,
        })
        .createReadStream()
        .pipe(csv());

      for await (const chunk of readable) {
        result.push(chunk);
      }

      console.log("importFileParser, csv parsed", result);

      await s3
        .copyObject({
          Bucket: bucketName,
          CopySource: `${bucketName}/${record.s3.object.key}`,
          Key: record.s3.object.key.replace("uploaded", "parsed"),
        })
        .promise();

      await s3
        .deleteObject({
          Bucket: bucketName,
          Key: record.s3.object.key,
        })
        .promise();

      console.log("importFileParser, object moved", record.s3.object.key);
    }

    return {
      statusCode: 201,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error("importFileParser", error.toString());
    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    };
  }
};
