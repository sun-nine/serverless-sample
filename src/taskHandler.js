import { DynamoDB } from "aws-sdk";
import crypto from "crypto";

export async function list(event, context) {
  const dynamodb = new DynamoDB({
    region: "ap-northeast-1",
  });

  const result = await dynamodb
    .scan({
      TableName: "tasks",
    })
    .promise();

  const tasks = result.Items.map((item) => {
    return {
      id: item.id.S,
      title: item.title.S,
    };
  });

  return {
    tasks,
  };
}

export async function post(event, context) {
  const requestBody = JSON.parse(event.body);

  const item = {
    id: {
      S: crypto.randomUUID(),
    },
    title: {
      S: requestBody.title,
    },
  };

  const dynamoDB = new DynamoDB({
    region: "ap-northeast-1",
  });

  await dynamoDB
    .putItem({
      TableName: "tasks",
      Item: item,
    })
    .promise();

  return item;
}
