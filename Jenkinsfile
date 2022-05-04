pipeline {
  agent any
    
  tools {nodejs "node"}
    
  stages {

    stage('Cloning Git') {
      steps {
        git 'https://github.com/gregouz66/ansible_api_IMDW290'
      }
    }

    stage('Install dependencies') {
      steps {
        sh 'npm install'
      }
    }
    
    stage('Test') {
      steps {
         sh 'npm test'
      }
    }      
  }
}