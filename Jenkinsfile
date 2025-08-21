pipeline {
    agent any
    tools {
        git 'Default'
    }
    environment {
        AWS_REGION = 'ap-south-1'
        REPO_NAME = 'nodeapp'
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/sam7776/node-project-truscholer.git'
            }
        }
        stage('Login ECR') {
            steps {
                withCredentials([
                    string(credentialsId: 'accesskey', variable: 'AWS_ACCESS_KEY'),
                    string(credentialsId: 'secretkey', variable: 'AWS_SECRET_KEY')
                ]) {
                    sh '''
                    # Configure AWS CLI
                    aws configure set aws_access_key_id $AWS_ACCESS_KEY
                    aws configure set aws_secret_access_key $AWS_SECRET_KEY
                    aws configure set default.region $AWS_REGION
                    
                    # Get Account ID and login to ECR
                    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
                    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
                    
                    # Create repository if it doesn't exist
                    aws ecr describe-repositories --repository-names $REPO_NAME --region $AWS_REGION || \
                    aws ecr create-repository --repository-name $REPO_NAME --region $AWS_REGION
                    '''
                }
            }
        }
        stage('Dockerize Application') {
            steps {
                sh '''
                docker build -t ${REPO_NAME}:${BUILD_NUMBER} .
                '''
            }
        }
        stage('Tag & Push to ECR') {
            steps {
                withCredentials([
                    string(credentialsId: 'accesskey', variable: 'AWS_ACCESS_KEY'),
                    string(credentialsId: 'secretkey', variable: 'AWS_SECRET_KEY')
                ]) {
                    script {
                        sh '''
                        # Configure AWS CLI again for this stage
                        aws configure set aws_access_key_id $AWS_ACCESS_KEY
                        aws configure set aws_secret_access_key $AWS_SECRET_KEY
                        aws configure set default.region $AWS_REGION
                        
                        # Get Account ID
                        ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
                        ECR_URI="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${REPO_NAME}"
                        
                        # Tag and push image
                        docker tag ${REPO_NAME}:${BUILD_NUMBER} ${ECR_URI}:${BUILD_NUMBER}
                        docker tag ${REPO_NAME}:${BUILD_NUMBER} ${ECR_URI}:latest
                        
                        docker push ${ECR_URI}:${BUILD_NUMBER}
                        docker push ${ECR_URI}:latest
                        '''
                    }
                }
            }
        }
    }
}