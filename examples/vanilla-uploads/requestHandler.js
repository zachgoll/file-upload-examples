import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
import s3 from "./s3.js";
import busboy from "busboy";
import mime from "mime-types";

import * as dotenv from "dotenv";
dotenv.config();

/**
 * Handles all requests to the HTTP server.  This is the callback
 * to the on('request') http.Server event.
 *
 * @param req http.IncomingMessage
 * @param res http.OutgoingMessage
 *
 * @see https://nodejs.org/api/http.html#event-request
 */
export default async function requestHandler(req, res) {
  if (!isValidRequest(req)) {
    res.writeHead(404, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    });
    res.end(
      JSON.stringify({
        error: "Route Not Found: Please use the /uploads endpoint",
      })
    );

    return;
  }

  const fileData = await parseMultipartReq(req);

  // We know our request is a multipart/form-data POST request to /uploads route now
  res.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  });

  const extension = mime.extension(fileData.info.mimeType);
  const Key = `vanilla-uploads/${uuid()}.${extension}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key,
      Body: fileData.file,
    })
  );

  res.end(
    JSON.stringify({
      url: `${process.env.AWS_CLOUDFRONT_URL}/${Key}`,
      extension,
    })
  );
}

/**
 * Parses the multipart/form-data request with busboy
 *
 * This is technically not a "vanilla" example, but parsing
 * this type of request requires quite a bit of code that
 * distracts from the main learning purpose here!
 */
async function parseMultipartReq(req) {
  // Processes a maximum of 1 file
  const bb = busboy({ headers: req.headers, limits: { files: 1 } });

  // IMPORTANT: the `req` object is a Node.js ReadableStream, so we can pipe that stream into busboy's handlers
  req.pipe(bb);

  // Resolves the data of the first file in the form (we only have 1 in our form)
  const fileData = await new Promise((resolve, reject) => {
    bb.on("file", (name, stream, info) => {
      const fileChunks = [];
      stream.on("data", (chunk) => fileChunks.push(chunk));
      stream.on("end", () =>
        resolve({ file: Buffer.concat(fileChunks), info })
      );
    });
  });

  return new Promise((resolve, reject) => {
    bb.on("close", () => resolve(fileData));
  });
}

// For simplicity of the tutorial, our server only accepts a single request type
function isValidRequest(req) {
  return (
    req.method === "POST" &&
    req.url === "/uploads" &&
    req.headers["content-type"]?.slice(0, 19) === "multipart/form-data"
  );
}
