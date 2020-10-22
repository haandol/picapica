import os
import boto3

client = boto3.client('codebuild')

PROJECT_NAME = os.environ['PROJECT_NAME']

def handler(event, context):
    client.start_build(
        projectName=PROJECT_NAME,
    )