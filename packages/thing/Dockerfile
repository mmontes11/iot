FROM node:12.21-alpine3.12

ENV WORKDIR /usr/src/iot-thing

RUN mkdir -p ${WORKDIR}

WORKDIR ${WORKDIR}

COPY package.json ${WORKDIR}

RUN npm install --production

ADD src ${WORKDIR}

RUN npm i -g cross-env

CMD cross-env NODE_ENV=production node index.js