import * as AWS from "aws-sdk";
import csv from "csv-parser";

const s3 = new AWS.S3();
const sqs = new AWS.SQS();
const bucketName = "import-service-s3bucket";
const queueUrl =
  "https://sqs.eu-west-1.amazonaws.com/420915147206/catalogItemsQueue";

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

        try {
          await sqs
            .sendMessage({
              QueueUrl: queueUrl,
              MessageBody: JSON.stringify(chunk),
            })
            .promise();
        } catch (err) {
          console.error(err);
        }
      }

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
