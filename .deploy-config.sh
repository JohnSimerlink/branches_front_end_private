#!/bin/bash
echo "First time deploying! Engaging deployment configuration."
if [ ! -f branches.pem ]; then
    echo "branches.pem not found! get it from john or someone"
fi
chmod 400 branches.pem
cat >> ~/.ssh/config <<- EOM
Host branches
    User ubuntu
    HostName 54.187.114.146
    IdentityFile $(pwd)/branches.pem
EOM
git remote add production branches:branches_front_end.git
touch .deploy-configured
echo "Deploy config finished!"