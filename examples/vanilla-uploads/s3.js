import * as dotenv from "dotenv";

// Since our AWS credentials are in .env, they will be read to the S3 client below
dotenv.config();

import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "us-east-1",
});

export default s3;
