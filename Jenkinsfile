pipeline {
  agent {
    docker {
      image 'ubuntu:16.04' 
      args '-p 4000:4000' 
    }
  }
  environment {
    CI = 'true' 
  }
  stages {
    stage('Hmm') {
      sh 'echo hello world'
    }
    stage('Build') {
      steps {
        sh 'apt-get update'
        sh 'apt-get install libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++ -y'
        sh 'apt-get install nodejs'
        sh 'apt-get install npm'
        sh 'npm install'
      }
    }
    stage('Test') { 
      steps {
          sh 'npm t' 
      }
    }
  }
}
