## Initial setup

The `/aws` folder of this repo was created with:

```
npx cdk init app --language typescript
```

## Quickstart

This CDK setup deploys a single Cloudformation stack, which will create an S3 bucket and Cloudfront distribution that points at that bucket. Additionally, I have created a CNAME pointing at the Cloudfront CDN as an example for a production setup.

To get up and running, there are 3 steps.

1. Add your AWS credentials
2. Add your account and region and bootstrap your CDK app
3. Deploy your resources with `cdk deploy`

### Add AWS credentials

I prefer to store these in `~/.aws/credentials` as the following. You can also use `aws configure` with the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html#cli-configure-quickstart-config) to get this setup below. By specifying `[default]`, the AWS CLI will automatically pick up these credentials.

I prefer to create an IAM user with admin credentials to use for CDK rather than the root account.

```
[default]
aws_access_key_id=
aws_secret_access_key=
region=us-east-1
output=json
```

### Bootstrap CDK app

To get CDK initialized, you'll need to specify a region and account to deploy resources to via environment variables and [bootstrap your app](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html).

```bash
# Make sure you are in the /aws directory of this repository
cd aws

# Follow .env.example
touch .env

# Bootstrap CDK
yarn bootstrap
```

### Deploy stack

To deploy resources defined in `lib/uploads-stack.ts`, run:

```
yarn deploy
```

This will create:

- An S3 bucket where file uploads will be stored
- A Cloudfront distribution that will act as the CDN for delivering S3 assets
- An IAM user that will be used by the AWS SDK in our app code to upload objects to S3
  - Has a policy that restricts this user to only perform actions on our created bucket
  - IAM access key secret is stored safely in secrets manager
