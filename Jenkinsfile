pipeline {
    environment {
        registry = "linea/perseus"
        registryCredential = 'Dockerhub'
        dockerImage = ''
        deployment = 'perseus'
        namespace = 'scienceportal-dev'
        namespace_prod = 'scienceportal'
        commit = ''
    }
    agent any

    stages {
        stage('Test') {
            steps {
                sh 'yarn install'
                sh 'yarn lint'
                sh 'yarn test'
            }
        }
        stage('Creating version.json') {
            steps {
                sh './version.sh && cat ./src/assets/json/version.json'
            }
        }
        stage('Building and push image') {
            when {
                allOf {
                    expression {
                        env.TAG_NAME == null
                    }
                    expression {
                        env.BRANCH_NAME.toString().equals('master')
                    }
                }
            }
            steps {
                script {
                sh 'docker build -t $registry:$GIT_COMMIT .'
                docker.withRegistry( '', registryCredential ) {
                    sh 'docker push $registry:$GIT_COMMIT'
                    sh 'docker rmi $registry:$GIT_COMMIT'
                }
                sh """
                  curl -D - -X \"POST\" \
                    -H \"content-type: application/json\" \
                    -H \"X-Rundeck-Auth-Token: $RD_AUTH_TOKEN\" \
                    -d '{\"argString\": \"-namespace $namespace -commit $GIT_COMMIT -image $registry:$GIT_COMMIT -deployment $deployment\"}' \
                    https://run.linea.gov.br/api/1/job/d9c7e7af-603a-4d70-80f6-375ff1a33780/executions
                  """
            }
        }
    }
        stage('Building and Push Image Release') {
            when {
                expression {
                    env.TAG_NAME != null
                }
            }
            steps {
                script {
                sh 'docker build -t $registry:$TAG_NAME .'
                docker.withRegistry( '', registryCredential ) {
                    sh 'docker push $registry:$TAG_NAME'
                    sh 'docker rmi $registry:$TAG_NAME'
                }

                sh """
                  curl -D - -X \"POST\" \
                    -H \"content-type: application/json\" \
                    -H \"X-Rundeck-Auth-Token: $RD_AUTH_TOKEN\" \
                    -d '{\"argString\": \"-namespace $namespace_prod -commit $TAG_NAME -image $registry:$TAG_NAME -deployment $deployment\"}' \
                    https://run.linea.gov.br/api/1/job/d9c7e7af-603a-4d70-80f6-375ff1a33780/executions
                  """
            }
        }
    }
  }
}
