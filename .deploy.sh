#!/bin/bash
if [ ! -f .deploy-configured ]; then
    sh .deploy-config.sh
fi

echo "Deploy configuration detected. Building, then committing build, then pushing to production"
datetime=$(date '+%d/%m/%Y %H:%M:%S');
npm run build
git add dist
git commit -m "Build and Deploy: $datetime"
git push origin master
git push production master


echo "Deploy script finished! :D :D :D"
