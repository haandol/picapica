import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as targets from '@aws-cdk/aws-events-targets';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codecommit from '@aws-cdk/aws-codecommit';

export class CodecommitReplicateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const role = new iam.Role(this, 'CodeBuildRole', {
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
      role,
      buildSpec: codebuild.BuildSpec.fromObject(buildSpec),
    });
    const repository = codecommit.Repository.fromRepositoryName(this, 'TestRepository', 'test');
    const target = new targets.CodeBuildProject(project);
    repository.onCommit('TestOnCommit', {
      branches: ['master'],
      target,
    });
  }
}
