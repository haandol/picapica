import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codecommit from '@aws-cdk/aws-codecommit';

export class CodecommitReplicateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const projectRole = new iam.Role(this, 'CodeBuildRole', {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
      managedPolicies: [
        {managedPolicyArn: 'arn:aws:iam::aws:policy/AWSCodeCommitFullAccess'},
        {managedPolicyArn: 'arn:aws:iam::aws:policy/CloudWatchLogsFullAccess'},
      ],
    });

    const buildSpec = {
      version: '0.2',
      phases: {
        pre_build: {
          commands: [
            'pip install git-remote-codecommit',
          ],
        },
        build: {
          commands: [
            'git clone --mirror codecommit::us-west-2://test test',
            'cd test',
            'git remote set-url --push origin codecommit::ap-northeast-2://test',
            'git fetch && git push'
          ],
        }
      }
    };

    const project = new codebuild.Project(this, 'CodeCommitReplicateProject', {
      role: projectRole,
      buildSpec: codebuild.BuildSpec.fromObject(buildSpec),
      environment: {
      },
    });

    const functionRole = new iam.Role(this, `TriggerFunctionRole`, {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        {managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'},
        {managedPolicyArn: 'arn:aws:iam::aws:policy/AWSCodeBuildAdminAccess'},
      ],
    });
    const triggerFunction = new lambda.Function(this, `CodeCommitTriggerFunction`, {
      code: lambda.Code.fromAsset(path.resolve(__dirname, 'functions')),
      role: functionRole,
      runtime: lambda.Runtime.PYTHON_3_7,
      handler: 'build_start.handler',
      environment: {
        PROJECT_NAME: project.projectName,
      }
    });
    triggerFunction.grantInvoke(new iam.ServicePrincipal('codecommit.amazonaws.com'));
  }

}
