import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as targets from '@aws-cdk/aws-events-targets';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codecommit from '@aws-cdk/aws-codecommit';
import { IConfig } from './interfaces/interface';
import { Config } from './interfaces/config';

export class CodecommitReplicateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const buildSpec = this.createBuildSpec(Config);
    const role = new iam.Role(this, 'CodeBuildRole', {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
      managedPolicies: [
        {managedPolicyArn: 'arn:aws:iam::aws:policy/AWSCodeCommitFullAccess'},
        {managedPolicyArn: 'arn:aws:iam::aws:policy/CloudWatchLogsFullAccess'},
      ],
    });
    const project = new codebuild.Project(this, 'CodeCommitReplicateProject', {
      role,
      buildSpec,
    });
    const target = new targets.CodeBuildProject(project);
    this.registerTrigger(target, Config);
  }

  createBuildSpec(Config: IConfig): codebuild.BuildSpec {
    const commands = new Array<string>();
    for (const replication of Config) {
      commands.push(
        `git clone --mirror codecommit::${replication.sourceRegion}://${replication.sourceName} ${replication.sourceName}`,
        `cd ${replication.sourceName}`,
        `git remote set-url --push origin codecommit::${replication.targetRegion}://${replication.targetName}`,
        `git fetch && git push`,
        `cd ..`,
      )
    }
    return codebuild.BuildSpec.fromObject({
      version: '0.2',
      phases: {
        pre_build: {
          commands: [
            'pip install git-remote-codecommit',
          ],
        },
        build: {
          commands,
        }
      }
    });
  }

  registerTrigger(target: targets.CodeBuildProject, Config: IConfig) {
    for (const replication of Config) {
      const repository = codecommit.Repository.fromRepositoryName(
        this, `${replication.sourceName}Repository`, replication.sourceName
      );
      repository.onCommit(`${replication.sourceName}OnCommit`, {
        branches: replication.branches,
        target,
      });
    }
  }

}
