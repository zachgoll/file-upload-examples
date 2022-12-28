import type { NextApiRequest, NextApiResponse } from "next";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../lib/s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuid } from "uuid";
import mime from "mime-types";

/**
 * 1. Client will send the mimetype in request body
 * 2. Server sends back a pre-signed PutObject S3 request
 * 3. Client will use the signed URL to make a PUT request to S3 with the file as the payload
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "POST") {
    const url = await getSignedUrl(
      s3,
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${req.body.folder}/${uuid()}.${mime.extension(
          req.body.mimetype
        )}`,
      }),
      { expiresIn: 3600 }
    );

    res.status(200).json({ url });
  } else {
    res.status(404);
  }
}
