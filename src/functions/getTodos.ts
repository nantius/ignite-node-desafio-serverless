import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "src/utils/dynamodbClient";

export const handler:APIGatewayProxyHandler = async (event) => {
    const {userid} = event.pathParameters;

    const result = await document.scan({
        TableName: "todos",
        FilterExpression: "user_id = :userid",
        ExpressionAttributeValues: {
            ":userid": userid,
        }
    }).promise();


    return {
        statusCode: 200,
        body: JSON.stringify({
            body: result.Items
        }),
        headers: {
            "Content-type": "application/json"
        }
    }

}