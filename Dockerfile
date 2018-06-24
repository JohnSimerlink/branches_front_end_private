FROM node:8

RUN apt-get update && apt-get install -y -qq libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++
RUN npm install
RUN npm install -g cross-env
RUN npm install -g webpack
RUN npm install -g webpack-dev-server

ENV NPM_CONFIG_LOGLEVEL warn
ARG app_env
ENV APP_ENV $app_env

RUN mkdir -p /frontend
WORKDIR /frontend
COPY ./ ./


CMD if [ ${APP_ENV} = production ]; \
  then \
  npm install -g http-server && \
  npm run build && \
  cd build && \
  hs -p 80; \
  else \
  webpack-dev-server --inline --hot; \
  fi

EXPOSE 8080

