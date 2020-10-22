#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CodecommitReplicateStack } from '../lib/codecommit-replicate-stack';

const app = new cdk.App();
new CodecommitReplicateStack(app, 'CodecommitReplicateStack');
