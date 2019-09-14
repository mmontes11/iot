FROM node:8

ENV WORKDIR /usr/src/iot-worker

RUN mkdir ${WORKDIR}

WORKDIR ${WORKDIR}

COPY package.json ${WORKDIR}

RUN npm install --production

ADD dist ${WORKDIR}

CMD ["npm", "run", "production"]