#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CustomLambdaRuntimesStack } from '../lib/custom-lambda-runtimes-stack';

const app = new cdk.App();
new CustomLambdaRuntimesStack(app, 'CustomLambdaRuntimesStack', {
  env: { account: process.env.AWS_ACCOUNT, region: 'eu-west-1' }
});
