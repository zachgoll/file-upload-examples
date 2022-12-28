## What is this repository?

This repo has 5 examples of how to upload files to AWS S3 using JavaScript tooling. Please note, some of them are combined into a single UI, so pay attention to the relevant endpoints to see the differences in strategies.

For explanations, see my [file uploads blog post](https://www.zachgollwitzer.com/posts/file-upload-strategies-s3-nodejs-express-react-uppy).

Below are links to code snippets that represent each example.

- [Vanilla uploads](https://github.com/zachgoll/file-upload-examples/tree/main/examples/vanilla-uploads)
- [Basic Next.js Uploads](https://github.com/zachgoll/file-upload-examples/blob/main/examples/nextjs-uploads/pages/basic.tsx)
  - [Endpoint using Multer](https://github.com/zachgoll/file-upload-examples/blob/main/examples/nextjs-uploads/pages/api/upload-with-multer.ts)
  - [Endpoint using Busboy](https://github.com/zachgoll/file-upload-examples/blob/main/examples/nextjs-uploads/pages/api/upload-with-busboy.ts) (lower-level library that Multer uses)
  - [Vanilla pre-signed S3 URLs](https://github.com/zachgoll/file-upload-examples/blob/main/examples/nextjs-uploads/pages/vanilla-signed-urls.tsx)
  - [Uppy pre-signed S3 URLs](https://github.com/zachgoll/file-upload-examples/blob/main/examples/nextjs-uploads/pages/uppy-signed-urls.tsx)

## How to run the examples

Each example has unique dev server requirements. To run, please see the `README.md` file in each example directory.

## AWS architecture

These examples require a basic Cloudfront + S3 setup with AWS. This architecture is defined in the `/aws` directory, which is an [AWS CDK](https://aws.amazon.com/cdk/) project.

The only non-obvious piece here is the [CORS configuration](https://github.com/zachgoll/file-upload-examples/blob/aac1b30c6421e3f7a396517cec1ebf031bb4a336/aws/lib/uploads-stack.ts#L21-L36) for the S3 bucket. This is required for pre-signed S3 urls since by default, buckets do not allow cross-origin requests.
