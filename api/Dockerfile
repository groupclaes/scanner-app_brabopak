# ---- Build ----
FROM groupclaes/npm AS build

# change the working directory to new exclusive app folder
WORKDIR /usr/src/app

# copy package file
COPY package.json ./

# install node packages
RUN npm i

USER root
RUN npm install esbuild --global

# copy project
COPY src/ ./

# build project
RUN esbuild ./index.ts --bundle --platform=node --minify --packages=external --external:'./config' --outfile=index.min.js

# ---- Build ----
FROM groupclaes/npm AS deps

# change the working directory to new exclusive app folder
WORKDIR /usr/src/app

# set current user to node
USER node

# copy package file
COPY package.json ./

# install node packages
RUN npm i

# from base image node
FROM groupclaes/node AS release

# set current user to node
USER node

# change the working directory to new exclusive app folder
WORKDIR /usr/src/app

# copy file and packages from build
COPY --from=build /usr/src/app/index.min.js ./index.js
COPY --from=deps /usr/src/app/node_modules/ ./node_modules

# command to run when intantiate an image
CMD ["node","index.js"]