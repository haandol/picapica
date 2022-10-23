# PicaPica - Replicate Cross Regional CodeCommit Repositories

This repository is for replicating codecommit repositories across regions on the same account

<img src="img/architecture.png" />

> Running this repository may cost you to provision AWS resources

# Prerequisites

- Nodejs 14.x
- AWS Account and Locally configured AWS credential

# Installation

Install project dependencies

```bash
$ npm i -g aws-cdk
$ npm i
$ cdk bootstrap
```

# Usage

## Setup config

Fill [**lib/interfaces/config.ts**](lib/interfaces/config.ts)

```bash
$ vim lib/interfaces/config.ts
```

In order to check out your **Account** run below,

```bash
$ aws sts get-caller-identity --query "Account" --out text
012345678901
```

Set **Region** variable where your source repository is placed.

## Deploy CDK Stacks on AWS

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
