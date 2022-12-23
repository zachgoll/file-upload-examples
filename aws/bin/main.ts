#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { UploadsStack } from "../lib/uploads-stack";

const app = new cdk.App();

new UploadsStack(app, "UploadsStack", {
  env: {
    account: process.env.CDK_ACCOUNT,
    region: process.env.CDK_REGION,
  },
});
