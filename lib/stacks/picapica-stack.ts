import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as targets from '@aws-cdk/aws-events-targets';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codecommit from '@aws-cdk/aws-codecommit';
import { IConfig } from '../interfaces/interface';
import { Config } from '../interfaces/config';

export class PicaPicaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const role = new iam.Role(this, 'CodeBuildRole', {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
      managedPolicies: [
        { managedPolicyArn: 'arn:aws:iam::aws:policy/AWSCodeCommitFullAccess' },
        {
          managedPolicyArn: 'arn:aws:iam::aws:policy/CloudWatchLogsFullAccess',
        },
      ],
    });
    const buildSpec = this.createBuildSpec(Config);
    const project = new codebuild.Project(this, 'CodeCommitReplicateProject', {
      role,
      buildSpec,
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_4_0,
        computeType: codebuild.ComputeType.SMALL,
      },
    });

    const target = new targets.CodeBuildProject(project);
    this.registerTrigger(target, Config);
  }

  createBuildSpec(Config: IConfig): codebuild.BuildSpec {
    return codebuild.BuildSpec.fromObject({
      version: '0.2',
      phases: {
        pre_build: {
          commands: this.createPreBuildCommands(Config),
        },
        build: {
          commands: this.createBuildCommands(Config),
        },
      },
    });
  }

  createPreBuildCommands(Config: IConfig): string[] {
    const commands = new Array<string>();
    commands.push('pip install git-remote-codecommit');
    return commands;
  }

  createBuildCommands(Config: IConfig): string[] {
    const commands = new Array<string>();
    for (const replication of Config) {
      commands.push(
        `git clone --mirror codecommit::${replication.source.region}://${replication.source.repository} ${replication.source.repository}`,
        `cd ${replication.source.repository}`,
        `git remote set-url --push origin codecommit::${replication.target.region}://${replication.target.repository}`,
        `git fetch && git push`,
        `cd ..`
      );
    }
    return commands;
  }

  registerTrigger(target: targets.CodeBuildProject, Config: IConfig) {
    for (const replication of Config) {
      const repository = codecommit.Repository.fromRepositoryName(
        this,
        `${replication.source.repository}Repository`,
        replication.source.repository
      );
      repository.onCommit(`${replication.source.repository}OnCommit`, {
        branches: replication.target.branches,
        target,
      });
    }
  }
}
