import * as cdk from 'aws-cdk-lib';
import { EVMSocketClientPipelineStack } from '../lib/evm-socket-collector-pipeline-stack';

const app = new cdk.App();

new EVMSocketClientPipelineStack(app, 'EvmSocketClient', {
  branchName: 'main',
  description: 'Websocket Client for the EVM Networks',
  tags: { usage: 'service-clients' },
  env: {account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION},
});
