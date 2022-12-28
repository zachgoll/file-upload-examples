## Running the example

Using `.env.example` as a reference, be sure to create the `.env` file at `/examples/vanilla-uploads/.env` and fill in values. You will need to reference the `/aws` directory to create the necessary AWS S3 buckets and Cloudfront distribution.

```
# Install deps
yarn install

# Run server
yarn start:server

# Run client (separate terminal)
yarn start:client
```

This is NOT a production server! Specifically for learning purposes and simplicity.
