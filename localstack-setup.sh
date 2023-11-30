#!/bin/bash
export AWS_REGION=eu-west-2
export LOCALSTACK_URL=http://127.0.0.1:4566
aws --endpoint $LOCALSTACK_URL sqs create-queue --queue-name ecs-deployments
aws --endpoint $LOCALSTACK_URL sqs create-queue --queue-name ecr-push-events
aws --endpoint $LOCALSTACK_URL sqs create-queue --queue-name github-events
