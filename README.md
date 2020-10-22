# PicaPica - Cross Region CodeCommit Replication

This repository is for replicating codecommit repositories across regions on same account

<img src="img/architecture.png" />

> Running this repository may cost you to provision AWS resources

# Prerequisites

- Nodejs 10.x
- AWS Account and Locally configured AWS credential

# Installation

Install project dependencies

```bash
$ npm i -g cdk@1.67.0
$ npm i
$ cdk bootstrap
```

# Usage

Fill [**lib/interfaces/config.ts**](lib/interfaces/config.ts)
```bash
$ vim lib/interfaces/config.ts
```

Deploy CDK Stacks on AWS

> YOU SHOULD DEPLOY THIS CDK PROJECT ON THE **SOURCE REGION**
> use profile or something

```bash
$ cdk deploy "*" --require-approval never
```

Done!

Commit & push some code to source-repository and
visit **CodeBuild Project** console to check out build progress.

# Cleanup

destroy provisioned cloud resources

```bash
$ cdk destroy "*"
```
