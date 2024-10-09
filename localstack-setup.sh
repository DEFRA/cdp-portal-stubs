#!/bin/bash
export AWS_REGION=eu-west-2
export LOCALSTACK_URL=http://127.0.0.1:4566

aws --endpoint $LOCALSTACK_URL sqs create-queue --queue-name ecr-push-deployments
aws --endpoint $LOCALSTACK_URL sqs create-queue --queue-name ecs-deployments
aws --endpoint $LOCALSTACK_URL sqs create-queue --queue-name ecr-push-events
aws --endpoint $LOCALSTACK_URL sqs create-queue --queue-name github-events
aws --endpoint $LOCALSTACK_URL sqs create-queue --queue-name deployments-from-portal
aws --endpoint $LOCALSTACK_URL sqs create-queue --queue-name run-test-from-portal
aws --endpoint $LOCALSTACK_URL sqs create-queue --queue-name secret_management_updates
aws --endpoint $LOCALSTACK_URL sqs create-queue --queue-name secret_management_updates_lambda
aws --endpoint $LOCALSTACK_URL sns create-topic --name run-test-topic
aws --endpoint $LOCALSTACK_URL sns create-topic --name secret_management
aws --endpoint $LOCALSTACK_URL sns subscribe --topic-arn arn:aws:sns:$AWS_REGION:000000000000:run-test-topic --protocol sqs --notification-endpoint  arn:aws:sqs:$AWS_REGION:000000000000:run-test-from-portal
aws --endpoint $LOCALSTACK_URL sns subscribe --topic-arn arn:aws:sns:$AWS_REGION:000000000000:secret_management --protocol sqs --notification-endpoint  arn:aws:sqs:$AWS_REGION:000000000000:secret_management_updates
aws --endpoint $LOCALSTACK_URL sns subscribe --topic-arn arn:aws:sns:$AWS_REGION:000000000000:secret_management --protocol sqs --notification-endpoint  arn:aws:sqs:$AWS_REGION:000000000000:secret_management_updates_lambda
