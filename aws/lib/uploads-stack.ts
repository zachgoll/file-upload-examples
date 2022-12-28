import * as cdk from "aws-cdk-lib";
import { RemovalPolicy } from "aws-cdk-lib";
import { Distribution } from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { AccessKey, Policy, PolicyStatement, User } from "aws-cdk-lib/aws-iam";
import { Bucket, HttpMethods } from "aws-cdk-lib/aws-s3";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";

export class UploadsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // This represents the S3 bucket resource
    const uploadsBucket = new Bucket(this, "Uploads", {
      // IMPORTANT: in production, you should set this to RemovalPolicy.RETAIN
      // This is 100% for convenience for the purposes of this tutorial so the bucket deletes with the stack
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // set to false in production

      // This is required configuration for pre-signed URL examples
      cors: [
        {
          allowedHeaders: [
            "Authorization",
            "x-amz-date",
            "x-amz-content-sha256",
            "content-type",
          ],
          allowedMethods: [HttpMethods.GET, HttpMethods.PUT],

          // You should replace these values with any client-side application domains you'll be uploading to S3 from via pre-signed URLs
          // For tutorial purposes, setting to "all origins" for convenience, but this is not best-practice security
          allowedOrigins: ["*"],
        },
      ],
    });

    // This is the Cloudfront distribution that hosts content from the S3 bucket above
    const distribution = new Distribution(this, "Distribution", {
      // This creates the Origin Access Identity so the distribution serves content from the S3 bucket
      defaultBehavior: {
        origin: new S3Origin(uploadsBucket),
      },

      /**
       * To enable a custom domain for your CDN
       *
       * 1. Uncomment the domainNames and certificate properties below
       * 2. Create an ACM certificate in your AWS dashboard and paste the Arn below
       * 3. Create a CNAME record pointing to this Cloudfront distribution
       */
      // domainNames: ['https://yoursubdomain.yourdomain.com'],
      // certificate: Certificate.fromCertificateArn(
      //     this,
      //     'Certificate',
      //     'enter certificate Arn that corresponds to domain above here'
      // ),
    });

    // This is the user we'll initialize the AWS SDK client with
    const user = new User(this, "SdkUser");

    // User must be able to read and write to the bucket we created
    user.attachInlinePolicy(
      new Policy(this, "SdkUserPolicy", {
        statements: [
          new PolicyStatement({
            actions: ["s3:PutObject", "s3:GetObject", "s3:GetObjectAttributes"],
            resources: [`${uploadsBucket.bucketArn}/*`],
          }),
        ],
      })
    );

    // Normally, only the OAI (Cloudfront) can read the S3 bucket, but we're granting
    // read access to the user so we can run the ListObjectsV2Command to display our uploaded objects
    uploadsBucket.grantRead(user);

    const accessKey = new AccessKey(this, "SdkUserAcessKey", { user });

    // Must store access key safely in secrets manager
    new Secret(this, "SdkUserAccessKeySecret", {
      secretStringValue: accessKey.secretAccessKey,
    });
  }
}
