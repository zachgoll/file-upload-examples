import type { NextApiRequest, NextApiResponse } from "next";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3 } from "../../lib/s3";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const files = await s3.send(
    new ListObjectsV2Command({
      Bucket: process.env.AWS_BUCKET_NAME,

      // Searches a different S3 folder based on the example page we're viewing
      Prefix: req.query.queryKey as string,
    })
  );

  res.status(200).json({
    uploads: files.Contents
      ? files.Contents.map((f) => ({
          url: `${process.env.AWS_CLOUDFRONT_URL}/${f.Key}`,
        }))
      : [],
  });
}
