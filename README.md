# TypeScript Scheduled Task Deployment for OGP
Generated from opengovsg/ts-template

This repo shows an example of how to deploy two jobs that have to run on a schedule to Elastic Container Service. 
There are various ways of deploying scheduled jobs
- Use a cron job on an EC2 instance (`crontab -e`). It is the fastest way, but if you're piping your logs into the instance, you'll need to figure out how to rotate the logs so you don't run out of disk space. 
- Use a lambda and cloudwatch event rule. Simply zip up your code and upload it to a lambda, and point a cloudwatch event rule at it. But you will be subject to a 15 min limit.
- Use ECS and cloudwatch event rule. It's more work, but you can scale your resources as necessary and run long running tasks, with automatic logs. 
## How to use

### Requirements
In summary, 
- Create a repo in ECR, and a cluster and a task definition in ECS. In the task definition, create a container named `run`. The name of this container is currently hard-coded in the Github workflow. For that container, specify any image name - it will be updated by the workflow when your code is pushed. You can see the examples to get you started (./backend/src/examples/task-definitions).
[Reference](https://docs.aws.amazon.com/AmazonECS/latest/userguide/create_cluster.html)
- Create a scheduled task in ECS with the schedule needed. [Reference](https://docs.aws.amazon.com/AmazonECS/latest/userguide/scheduled_tasks.html)

Screenshots are available in [docs](./docs)

### Set these secrets in GitHub Actions 
```
AWS_ACCESS_KEY_ID - authenticating to AWS services
AWS_SECRET_ACCESS_KEY  - authenticating to AWS services
ECR_REPO - name of ECR repository
ECR_URL - <accountid>.dkr.ecr.ap-southeast-1.amazonaws.com

ECS_CLUSTER_NAME_STAGING - name of cluster
TASK_DEF_JOB01_STAGING - name of task definition for job01
RULE_PREFIX_JOB01_STAGING - prefix that the cloudwatch event rule starts with for job01
TASK_DEF_JOB02_STAGING - name of task definition for job02
RULE_PREFIX_JOB02_STAGING - prefix that the cloudwatch event rule starts with for job02

ECS_CLUSTER_NAME_PRODUCTION- name of cluster
TASK_DEF_JOB01_PRODUCTION- name of task definition for job01
RULE_PREFIX_JOB01_PRODUCTION - prefix that the cloudwatch event rule starts with for job01
TASK_DEF_JOB02_PRODUCTION- name of task definition for job02
RULE_PREFIX_JOB02_PRODUCTION - prefix that the cloudwatch event rule starts with for job02
```
### Write your code
Write the code in the `/backend` folder, commit, and push. A new task definition should be created. The Cloudwatch rule should display the updated task definition as well. 