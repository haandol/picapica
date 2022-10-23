#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { StackProps } from '../lib/interfaces/config';
import { PicaPicaStack } from '../lib/stacks/picapica-stack';

const app = new cdk.App();
new PicaPicaStack(app, 'PicaPicaStack', StackProps);
