import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({ region: "us-east-1" });
