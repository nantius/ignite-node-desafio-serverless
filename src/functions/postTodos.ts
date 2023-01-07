import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "src/utils/dynamodbClient";
import { v4 as uuidv4 } from "uuid";


export const handler:APIGatewayProxyHandler = async (event) => {
    const {userid} = event.pathParameters;
    const {title, deadline} = JSON.parse(event.body);

    const newId = uuidv4();

    await document.put({
        TableName: "todos",
        Item: {
            id: newId,
            user_id: userid,
            title,
            done: false,
            deadline
        }
    }).promise();


    const result = await document.query({
        TableName: "todos",
        KeyConditionExpression: "user_id = :userid and id = :id",
        ExpressionAttributeValues: {
            ":userid": userid,
            ":id": newId
        }
    }).promise();

    return {
        statusCode: 201,
        body: JSON.stringify({
            message: "Todo created!",
            body: result.Items[0]
        }),
        headers: {
            "Content-type": "application/json"
        }
    }

}