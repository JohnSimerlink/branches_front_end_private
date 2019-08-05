#!/bin/bash
echo "First time deploying! Engaging deployment configuration."
if [ ! -f branches_april_2019.pem ]; then
    echo "branches.pem not found! get it from john or someone"
    exit 1
fi
chmod 400 branches_april_2019.pem
cat >> ~/.ssh/config <<- EOM
Host branches
    User ubuntu
    HostName 54.187.114.146
    IdentityFile $(pwd)/branches.pem
EOM
git remote add production branches:branches_front_end.git
touch .deploy-configured
echo "Deploy config finished!"
