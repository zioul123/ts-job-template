1. Create a repository in Elastic Container Registry (ECR) for your docker images. 
From here, you'll get the `ECR_URL` (format: aws_account_id.dkr.ecr.region.amazonaws.com) and `ECR_REPO` (the name of your image) github action secrets.

![Create ecr repo](./assets/01-create-ecr-repo.png)

2. Create a task definition in Elastic Container Service (ECS). The name of this task definition will be the value of the secret `TASK_DEF_JOB01_STAGING` (differently named for each job you want to run). You may need to create the `ecsTaskExecutionRole` if AWS does not automatically do this for you.  As we are sharing the same Docker image for multiple jobs, you will have to set the correct command for your job in the task definition, in this case, it will be `node,backend/build/examples/job01.js`. The command should be comma delimited

![Create task def](./assets/02-create-task-definition.png)
![Create task def](./assets/03-create-task-definition.png)
![Create task def](./assets/04-edit-container-config.png)


3. Create a cluster in ECS. The name of this cluster will be the value of the secret `ECS_CLUSTER_NAME_STAGING`

![Create ecs cluster](./assets/05-create-ecs-cluster.png)
![Create ecs cluster](./assets/06-create-ecs-cluster.png)

4. Create a scheduled task in that cluster. This will automatically create a cloudwatch event rule that runs your task. Start the name of rule with the prefix that you will set in the secret `RULE_PREFIX_JOB01_STAGING` -- this is the prefix that the github action will look for to determine the rule to update, when your new task definition is pushed. 
The security group and VPC settings can also be set here, should you need to access other resources in your VPC.
![Create scheduled task](./assets/08-create-scheduled-task.png)
![Create scheduled task](./assets/07-view-scheduled-rule.png)

5. To deploy, set your secrets in the github repo. You'll need AWS API keys.
![Deploy](./assets/09-set-secrets.png)
![Deploy](./assets/10-view-actions.png)