## Quickstart

This CDK setup deploys a single Cloudformation stack. There are helpful commands in `package.json` to run.

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

To get CDK initialized, you'll need to specify a region and account to deploy resources to via environment variables and [bootstrap your app](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html).

```bash
# Make sure you are in the /aws directory of this repository
cd aws

# Add your .env file
# Put the following two variables in it.  These specify where your CDK resources will be deployed to.
# CDK_REGION=
# CDK_ACCOUNT=
touch .env

npx
```
