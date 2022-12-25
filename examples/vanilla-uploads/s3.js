import * as dotenv from "dotenv";

/**
 * Reads shared .env file in root of repo
 *
 * This will inject AWS credentials to the environment
 * which is automatically read into the S3 client below.
 *
 * @see https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html
 */
dotenv.config({ path: "../../.env" });

import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "us-east-1",
});

export default s3;
