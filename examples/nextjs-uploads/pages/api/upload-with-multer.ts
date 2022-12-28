import type { NextApiRequest, NextApiResponse } from "next";

// Helper for dealing with Express middleware in Next.js routes
import nextConnect from "next-connect";

import { v4 as uuid } from "uuid";
import mime from "mime-types";
import multer from "multer";
import multerS3Storage from "multer-s3";
import { s3 } from "../../lib/s3";

const multerMiddleware = multer({
  storage: multerS3Storage({
    s3,
    bucket: process.env.AWS_BUCKET_NAME!,
    key: function (req, file, cb) {
      cb(
        null,
        `nextjs-basic-uploads/multer/${uuid()}.${mime.extension(file.mimetype)}`
      );
    },
  }),
})
  // IMPORTANT: `uploadFiles` matches the `name` property of our <form /> on the frontend
  .array("uploadFiles");

export default nextConnect<NextApiRequest, NextApiResponse>()
  .use(multerMiddleware)
  .post((req, res) => {
    return res.status(200).json({ success: true });
  });

// Since multer only deals with multipart/form-data, we need to disable the default
// Next.js bodyParser that will intercept (and wrongly interfere) with this POST request
export const config = {
  api: {
    bodyParser: false,
  },
};
