# TypeScript Scheduled Task Deployment for OGP
Generated from opengovsg/ts-template

This is a template repo you can fork to deploy two jobs that have to run on a schedule to Elastic Container Service. 

There are various ways of deploying scheduled jobs
- Use a cron job on an EC2 instance (`crontab -e`). It is the fastest way, but if you're piping your logs into the instance, you'll need to figure out how to rotate the logs so you don't run out of disk space. 
- Use a lambda and cloudwatch event rule. Simply zip up your code and upload it to a lambda, and point a cloudwatch event rule at it. But you will be subject to a 15 min limit.
- Use ECS and cloudwatch event rule. It's more work, but you can scale your resources as necessary and run long running tasks, with automatic logs. 

## Overview
Elastic Container Service (ECS) helps to spin up Docker container instances. You can run tasks on these container instances - 1) by clicking 'run task' manually, or 2) by creating a service and corresponding instances, or 3) by creating scheduled tasks that will run on a schedule, using Cloudwatch Event Rules. 

We will be using option 3 in this scenario to deploy the two example jobs (see [backend/src/examples](./backend/src/examples)). The first connects to a database, makes a query, then notifies a recipient of the result via email. The second notifies a slack webhook of the result.

There are also two example *task definitions*, one for each job. 

ECS uses the task definition to determine the Docker image to use when creating the container, the command to run, the environment variables to set,  the resources to allocate, the security group / VPC to run the container's instance in, and more. 

## Scaffolding
We will have to set up the following scaffolding in order to deploy a scheduled task via CI/CD:
1) Create a docker image repository in Elastic Container Registry (ECR). The task definition will be updated with the url to this docker image when you deploy.
2) Create a cluster in ECS. This is a logical grouping of instances. 
3) Create a task definition, with the resources, environment variables, and networking configuration you want. The container should be named `run` as it is currently hard-coded in the CI workflow. For your convenience, you can create a definition with any parameters, then create a new revision of that definition using the example task definitions in this repo. 
4) Create a scheduled task in ECS. This will automatically create a rule under Cloudwatch Events, where you can specify a cron schedule. 

A walkthrough with screenshots are available in [docs](./docs)
## CI/CD

CI/CD to deploy these jobs from this repository is achieved using GitHub actions. 

1) It runs a linter and tests, if you have any. 
2) If the branch is `staging` or `production`, and AWS access keys are supplied, it will proceed to the build and deploy steps.
3) The Dockerfile is built, and the image is pushed to the ECR repo.
4) For each job, it determines the task definition to use (depending on the branch).
4.1) It pulls the latest version of the task definition that you have specified, and creates a new revision of that task definition, updating the image url with the new image from 3).
4.2) It pushes the new revision, and updates the Cloudwatch event rule whose name starts with the prefix you specified with the new version. 

### Set these secrets in GitHub Actions 
```bash
AWS_ACCESS_KEY_ID - authenticating to AWS services
AWS_SECRET_ACCESS_KEY  - authenticating to AWS services
ECR_REPO - name of ECR repository
ECR_URL - <accountid>.dkr.ecr.ap-southeast-1.amazonaws.com

ECS_CLUSTER_NAME_STAGING - name of cluster
ECS_CLUSTER_NAME_PRODUCTION - name of cluster

TASK_DEF_JOB01_STAGING - name of task definition for job01
RULE_PREFIX_JOB01_STAGING - prefix that the cloudwatch event rule starts with for job01

TASK_DEF_JOB01_PRODUCTION - name of task definition for job01
RULE_PREFIX_JOB01_PRODUCTION - prefix that the cloudwatch event rule starts with for job01


# If you want to test this out with a second job, uncomment the section under 'deploy-job02' in the .github/workflows/ci.yml flow and set these variables
TASK_DEF_JOB02_STAGING - name of task definition for job02
RULE_PREFIX_JOB02_STAGING - prefix that the cloudwatch event rule starts with for job02

TASK_DEF_JOB02_PRODUCTION - name of task definition for job02
RULE_PREFIX_JOB02_PRODUCTION - prefix that the cloudwatch event rule starts with for job02
```
### Verify that the deployment is correct 
1. Check that ECR contains the image that you built and pushed
2. Check that the latest task definition contains the image url that was just pushed
3. Check that the Cloudwatch event rule's target has been updated to the latest version of the task definition

### Other environment variables for the examples 
1. `CRONITOR_JOB_01, CRONITOR_JOB_02` : Cronitor.io is a service that notifies you if your job doesn't run at an expected time. You can create a monitor, then specify the link as an environment variable in the task definition
2. `SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS`: Credentials for sending emails. You can create SMTP credentials using Amazon SES, Postmark, etc.
3. `MAIL_TO`: Emails to send the notification to
4. `MAIL_FROM`: Email to send the notification from
5. `SLACK_HOOK_URI`: Webhook url, for notifying a slack channel. 
6. `DB_URI` : URI of a postgres instance to connect to. Most jobs that I've run include connecting to a db, verifying some data or building a report, then sending the result to various recipients. 
7. `JUMPHOST_URI, JUMPHOST_KEY_FILE_PATH, JUMPHOST_PORT, JUMPHOST_PROXY_PORT`: I use these for connecting locally to a remote db that's in a private subnet behind a jumphost. With these, the util createPgClient will set up a tunnel. 
