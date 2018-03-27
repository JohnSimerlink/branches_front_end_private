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
    stage('Build') {
      steps {
        sh 'sudo apt-get install libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++'
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
