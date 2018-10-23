FROM node:8

RUN apt-get update && apt-get install -y -qq libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++
RUN npm install -g cross-env
# RUN npm install -g webpack
# RUN npm install -g webpack-cli
# RUN npm install -g webpack-dev-server

ENV NPM_CONFIG_LOGLEVEL warn
ARG app_env
ENV APP_ENV $app_env

RUN mkdir -p /frontend

# when we run the container we should ensure that -v has the hosts branches_front_end directory bound to the container's /frontend
# e.g. something like: `docker run -it -p 8080:8080 -v \"$(pwd)\":/frontend {{IMAGE_NAME}}`, where $(pwd) is the branches_front_end root directory
#ALSO: the webpack-dev-server line seems to freeze somewhere after the at-loader step . . . even after waiting 20 minutes
CMD cd /frontend && echo "Running npm install" && npm install && \
  if [ "$APP_ENV" = "production" ]; \
  then \
  npm install -g http-server && \
  npm run build && \
  cd dist && \
  echo "server static build files from dist\\" && \
  hs -p 80; \
  else \
  echo "running hot reload dev server via webpack-dev-server\\" && \
  UV_THREADPOOL_SIZE=128 ./node_modules/.bin/webpack-dev-server --display-reasons --display-chunks --loglevel verbose --progress --inline --hot --host 0.0.0.0; \
  fi

EXPOSE 8080
