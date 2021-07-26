# TypeScript Scheduled Task Deployment for OGP
Generated from opengovsg/ts-template

## How to use

### Requirements

- Create a cluster and a task definition. In the task definition, create a container named `run`. The name of this container is currently hard-coded in the Github workflow. For that container, specify any image name - it will be updated by the workflow when your code is pushed.
[Reference](https://docs.aws.amazon.com/AmazonECS/latest/userguide/create_cluster.html)
- Create a scheduled task on Cloudwatch with the schedule needed. [Reference](https://docs.aws.amazon.com/AmazonECS/latest/userguide/scheduled_tasks.html)
### Set these secrets in GitHub Actions 
```
AWS_ACCESS_KEY_ID - authenticating to AWS services
AWS_SECRET_ACCESS_KEY  - authenticating to AWS services
ECR_REPO - name of ECR repository
ECR_URL - <accountid>.dkr.ecr.ap-southeast-1.amazonaws.com
ECS_CLUSTER_NAME - name of cluster
TASK_DEF_JOB01 - name of task definition for job01
TASK_DEF_JOB02 - name of task definition for job02
```
### Write your code
Write the code in the `/backend` folder, commit, and push. A new task definition should be created. The Cloudwatch rule should display the updated task definition as well. 