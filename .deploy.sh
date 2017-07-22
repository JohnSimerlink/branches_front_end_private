#!/bin/bash
if [ -f .deploy-configured ]; then
    git push production master
else
    sh .deploy-config.sh
    git push production master
fi
echo "Deploy script finished! :D :D :D"
