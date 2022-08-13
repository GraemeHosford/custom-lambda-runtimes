import * as cdk from '@aws-cdk/core';
import * as lambda from "@aws-cdk/aws-lambda";
import * as iam from "@aws-cdk/aws-iam";
import {RetentionDays} from "@aws-cdk/aws-logs";

export class CustomLambdaRuntimesStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaExecutionRole = new iam.Role(this, "BashLambdaExecutionRole", {
      roleName: "BashLambdaExecutionRole",
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com")
    });
    lambdaExecutionRole.addManagedPolicy(
        iam.ManagedPolicy.fromManagedPolicyArn(
            this,
            "Lambda-Access-Role",
            "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
        )
    );

    const bashRuntimeLambdaLayer = new lambda.LayerVersion(this, "bash-lambda-layer", {
      layerVersionName: "BashRuntime",
      description: "Bash runtime for AWS lambdas",
      compatibleRuntimes: [lambda.Runtime.PROVIDED, lambda.Runtime.PROVIDED_AL2],
      compatibleArchitectures: [lambda.Architecture.ARM_64, lambda.Architecture.X86_64],
      code: lambda.Code.fromAsset(`${__dirname}/runtime`),
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    new lambda.Function(this, "BashTestFunction", {
      layers: [bashRuntimeLambdaLayer],
      code: lambda.Code.fromAsset(`${__dirname}/function`),
      handler: "handler.handler",
      runtime: lambda.Runtime.PROVIDED,
      role: lambdaExecutionRole,
      functionName: "BashTestFn",
      logRetention: RetentionDays.ONE_DAY
    });
  }
}
