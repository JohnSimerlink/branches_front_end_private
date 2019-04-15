# install nginx

# upload ssh key to git
ssh-keygen -t rsa -b 4096
curl -u "johnsimerlink@gmail.com" \
  --data "{\"title\":\"${1}\",\"key\":\"`cat ~/.ssh/id_rsa.pub`\"}" \
  https://api.github.com/user/keys
echo "SSH Key $1 uploaded to github"

# set up front end repo
git clone git@github.com:JohnSimerlink/branches_front_end_private.git --bare
cd branches_front_end_private.git/hooks
cat > post-receive << EOL
#!/bin/sh
GIT_WORK_TREE=/var/www/html git checkout -f
cd /var/www/html
EOL
rm post-update.sample


# set up permissions in web server root
sudo groupadd www
sudo usermod -a -G www ubuntu
sudo chgrp www /var/www/html
sudo chmod g+w html
