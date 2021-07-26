1. Create a repository in Elastic Container Registry (ECR) for your docker images. From here, you'll get the `ECR_URL` (format: aws_account_id.dkr.ecr.region.amazonaws.com) and `ECR_REPO` (the name of your image) environment variables.
![Create ecr repo](./assets/01-create-ecr-repo.png)

2. Create a task definition in Elastic Container Service (ECS). The name of this task definition will be the value of `TASK_DEF_JOB01` (differently named for each job you want to run)
![Create task def](./assets/02-create-task-definition.png)
![Create task def](./assets/03-create-task-definition.png)
![Create task def](./assets/04-edit-container-config.png)


3. Create a cluster in ECS. The name of this cluster will be the value of `ECS_CLUSTER_NAME`
![Create ecs cluster](./assets/05-create-ecs-cluster.png)
![Create ecs cluster](./assets/06-create-ecs-cluster.png)

4. Create a scheduled task in that cluster. This will automatically create a cloudwatch event rule that runs your task. Start the name of the target id with `job01-...` -- this is the rule-prefix that is used when deploying the task. The security group and VPC settings can also be set here, should you need to access other resources in your VPC.
![Create scheduled task](./assets/08-create-scheduled-task.png)
![Create scheduled task](./assets/07-view-scheduled-rule.png)

5. To deploy, set your environment variables in the github repo. You'll need AWS API keys.
![Deploy](./assets/09-set-secrets.png)
![Deploy](./assets/10-view-actions.png)