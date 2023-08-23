pipeline{
    agent any

    tools{nodejs "node"}

    stages{
        stage('Cypress  Parallel Test Suit'){
            parallel{
                stage('Slave Node 1'){
                    agent{
                        label 'remote_node_1'
                    }
                    steps{
                        git url: 'https://github.com/azheriqbal/test-CI-CD.git'
                        bat 'npm install'
                        bat 'npm update'
                        bat 'npm run triggerAllTests-dashboard'
                    }
                }

                stage('Slave Node 2'){
                    agent{
                        label 'remote_node_2'
                    }
                    steps{
                        git url: 'https://github.com/azheriqbal/test-CI-CD.git'
                        bat 'npm install'
                        bat 'npm update'
                        bat 'npm run triggerAllTests-dashboard'
                    }
                }
            }
        }
    }
}