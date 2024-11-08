FROM node:latest

ENV DEBIAN_FRONTEND=noninteractive
#RUN apt update && apt upgrade && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app/
COPY package* ./
RUN npm config set strict-ssl false
RUN npm install --omit=dev --loglevel verbose
COPY client/dist ./client/dist/
COPY content ./content/
COPY server ./server/

EXPOSE 3000
ENTRYPOINT [ "/bin/sh", "-c" , "node ./server/server.js" ]
