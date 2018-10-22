[![Build Status](http://ec2-18-222-10-105.us-east-2.compute.amazonaws.com:8080/buildStatus/icon?job=FrontEndTests)](http://ec2-18-222-10-105.us-east-2.compute.amazonaws.com:8080/job/FrontEndTests/)
## Dev Instructions

- Install [Docker](https://docs.docker.com/install/)
- `npm run pre-dev`
- `npm run dev` - depending on the speed of your machine this may take 5 minutes

Note: since although `node_module` is mounted between the host machine and the guest/docker machine, it is safest to run `npm install` in the docker machine because of OS-specific dependencies. Therefore, the way I add a new package is by manually adding the package & version (get the version from npmjs.com if necessary) into the `package.json` file and then hitting `Ctrl+C` to kill the docker/webpack-dev-server and then typing `npm run dev` again to reboot the docker/webpack-dev-server, which will also install the new package in the `package.json` file, as the `RUN` command in the `Dockerfile` includes an `npm install` statement. Since the docker machine can detect that other previously installed packages exist in the mounted `node_modules` folder, the docker machine will only have to install the new package (but will still take a minute or so to loop through all packages and update any ones that need to be updated). So this whole process is still a bit slow, but not too slow, and it would be better if we could come up with a slightly faster process for adding an npm package.

As of 2018_OCT_14, this setup works on macOS High Sierra 10.13.6 with Docker Version 18.06.0-ce-mac70 (26399)

## Getting Started

This project uses the following technologies:
- [Vue.js](https://vuejs.org/)
- [Vuex](https://vuex.vuejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [SigmaJS](http://sigmajs.org/)
- [InversifyJS](https://github.com/inversify/InversifyJS)

The project is also using WebStorm as the primary development environment.
- [WebStorm](https://www.jetbrains.com/webstorm/)

## How to Contribute
- If you want to contribute, contact John directly at johnsimerlink at gmail dot com

## Documents
- [The Secret Master Plan](http://branches-app.com/theplan)
- [Our Google Drive](https://drive.google.com/drive/folders/0B2TCJxQ4w3a8aE9tVFg1YWJJb1E?usp=sharing)
- [Our Slack Team](https://branches-app.slack.com)
