// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import busboy, { FileInfo } from "busboy";
import { s3 } from "../../lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import mime from "mime-types";

type Data = {
  success: boolean;
  message?: string;
};

type RawFile = {
  data: Buffer;
  info: FileInfo;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const bb = busboy({ headers: req.headers });

    // Pipe request stream into busboy
    req.pipe(bb);

    // Resolves the data of the first file in the form (we only have 1 in our form)
    const files = await new Promise<RawFile[]>((resolve) => {
      const files: RawFile[] = [];

      // Loops through all files in the form
      bb.on("file", (name, stream, info) => {
        const fileChunks: Buffer[] = [];
        stream.on("data", (chunk) => fileChunks.push(chunk));
        stream.on("end", () =>
          files.push({ data: Buffer.concat(fileChunks), info })
        );
      });

      bb.on("close", () => resolve(files));
    });

    // Normally you'd check the results of these parallel Promises, but not including for the sake of the tutorial
    await Promise.allSettled(
      files.map((f) => {
        return s3.send(
          new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `basic-uploads/busboy/${uuid()}.${mime.extension(
              f.info.mimeType
            )}`,
            Body: f.data,
          })
        );
      })
    );

    res.status(200).json({ success: true });
  } else {
    res.status(404).json({ success: false, message: "Endpoint not valid" });
  }
}

// Since busboy only deals with multipart/form-data, we need to disable the default
// Next.js bodyParser that will intercept (and wrongly interfere) with this POST request
export const config = {
  api: {
    bodyParser: false,
  },
};
