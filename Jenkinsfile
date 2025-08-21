pipeline {
    agent any
    environment {
        AWS_REGION = 'ap-south-1'
        REPO_NAME = 'nodeapp'
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Login ECR') {
            steps {
                withCredentials([
                    string(credentialsId: 'aws-access', variable: 'aws-access'),
                    string(credentialsId: 'aws-secret', variable: 'aws-secret')
                ]) {
                    sh '''
                    aws configure set aws_access_key_id $aws-access
                    aws configure set aws_secret_access_key $aws-secret
                    aws configure set default.region $AWS_REGION

                    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
                    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
                    '''
                }
            }
        }
        stage('Dockerize Application') {
            steps {
                sh '''
                docker build -t nodeapp:${BUILD_NUMBER} .
                '''
            }
        }
        stage('Tag & Push to ECR') {
            steps {
                script {
                    def accountId = sh(
                        script: "aws sts get-caller-identity --query Account --output text",
                        returnStdout: true
                    ).trim()
                    def ecrUri = "${accountId}.dkr.ecr.${env.AWS_REGION}.amazonaws.com/${env.REPO_NAME}"
                    def imageTag = "${env.BUILD_NUMBER}"

                    sh """
                    docker tag ${env.REPO_NAME}:${imageTag} ${ecrUri}:${imageTag}
                    docker push ${ecrUri}:${imageTag}
                    """
                }
            }
        }
    }
}

