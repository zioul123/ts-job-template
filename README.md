# TypeScript Scheduled Task Deployment for OGP
Generated from opengovsg/ts-template

## Summary
This template helps to update the task definition of a scheduled task running on ECS.

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
TASK_DEF_FAMILY - name of task definition
```
### Write your code
Write the code in the `/backend` folder, commit, and push. A new task definition should be created. The Cloudwatch rule should display the updated task definition as well. 

### Screenshots

### Create an ECS cluster
This is where your task will run
<img width="817" alt="Screenshot 2021-07-05 at 4 09 20 AM" src="https://user-images.githubusercontent.com/33819199/124398161-dec78900-dd46-11eb-9e6c-da950f6b39d2.png">


### Create a task definition
This is where you can set the name of the container to `run`, and set environment variables, and different entry points if you wish.
<img width="1129" alt="Screenshot 2021-07-05 at 3 50 46 AM" src="https://user-images.githubusercontent.com/33819199/124398020-11bd4d00-dd46-11eb-9389-4f4d0d44b63d.png">
<img width="824" alt="Screenshot 2021-07-05 at 3 51 30 AM" src="https://user-images.githubusercontent.com/33819199/124398015-0c600280-dd46-11eb-9f5e-8618145e5558.png">
<img width="946" alt="Screenshot 2021-07-05 at 3 52 28 AM" src="https://user-images.githubusercontent.com/33819199/124398011-079b4e80-dd46-11eb-81c7-1c11fb0e6406.png">



### Create a scheduled task
This is where you set the schedule.

<img width="1267" alt="Screenshot 2021-07-05 at 3 57 07 AM" src="https://user-images.githubusercontent.com/33819199/124398008-01a56d80-dd46-11eb-9b21-25fd0aec1f26.png">

<img width="1412" alt="Screenshot 2021-07-05 at 4 00 06 AM" src="https://user-images.githubusercontent.com/33819199/124398000-f81c0580-dd45-11eb-80bb-056eb6892fbc.png">



