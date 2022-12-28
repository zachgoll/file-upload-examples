## What is this repository?

This repo has 5 examples of how to upload files to AWS S3 using JavaScript tooling. Please note, some of them are combined into a single UI, so pay attention to the relevant endpoints to see the differences in strategies.

For explanations, see my [file uploads blog post](https://www.zachgollwitzer.com/posts/file-upload-strategies-s3-nodejs-express-react-uppy).

Below are links to code snippets that represent each example.

- [Vanilla uploads](https://github.com/zachgoll/file-upload-examples/tree/main/examples/vanilla-uploads)
- Basic Next.js Uploads
  - [Using Multer middleware](https://github.com/zachgoll/file-upload-examples/blob/main/examples/nextjs-uploads/pages/api/upload-with-multer.ts)
  - [Using Busboy](https://github.com/zachgoll/file-upload-examples/blob/main/examples/nextjs-uploads/pages/api/upload-with-busboy.ts) (lower-level library that Multer uses)
- Pre-signed URLs strategy with Next.js
  - [signing endpoint](https://github.com/zachgoll/file-upload-examples/blob/main/examples/nextjs-uploads/pages/api/sign-url.ts)
  - [Vanilla implementation](https://github.com/zachgoll/file-upload-examples/blob/622043c3cddcbc33d256dbfaf9a55905e5e4a674/examples/nextjs-uploads/pages/signed-urls.tsx#L112-L140)
  - [Uppy implementation](https://github.com/zachgoll/file-upload-examples/blob/622043c3cddcbc33d256dbfaf9a55905e5e4a674/examples/nextjs-uploads/pages/signed-urls.tsx#L45-L65)

## How to run the examples

Each example has unique dev server requirements. To run, please see the `README.md` file in each example directory.
