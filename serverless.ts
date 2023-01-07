import type { AWS } from '@serverless/typescript';


const serverlessConfiguration: AWS = {
  service: 'ignite-node-desafio-serverless',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', "serverless-offline", "serverless-dynamodb-local"],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['dynamodb:PutItem', 'dynamodb:Scan', 'dynamodb:Query'],
        Resource: '*',
      },
    ]
  },
  functions: { 
    getTodos: {
      handler: 'src/functions/getTodos.handler',
      events: [
        {
          http: {
            method: 'get',
            path: 'todos/{userid}',
          }
        }
      ]
   },
    postTodos: {
      handler: 'src/functions/postTodos.handler',
      events: [
        {
          http: {
            method: 'post',
            path: 'todos/{userid}',
          }
        }
      ]
    }
  },
  package: { individually: false, include: ['src/**'] },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      stages: ['dev'],
      start: {
        port: 8000,
        inMemory: true,
        migrate: true,
        seed: true,
     },
    }
  },
  resources: {
    Resources: {
      TodosTable: {
        Type: 'AWS::DynamoDB::Table', 
        Properties: {
          TableName: 'todos',
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
            {
              AttributeName: 'user_id',
              AttributeType: 'S',
            }
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'user_id',
              KeyType: 'RANGE', 
            }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          }
         }
        }
      }
    }
};

module.exports = serverlessConfiguration;
