FROM node:12

ENV WORKDIR /usr/src/iot-back

RUN mkdir ${WORKDIR}

WORKDIR ${WORKDIR}

COPY package.json ${WORKDIR}

RUN npm install --production

ADD dist ${WORKDIR}

RUN npm i -g cross-env

CMD cross-env NODE_ENV=production node index.js