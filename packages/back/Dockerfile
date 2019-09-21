FROM node:12

ENV WORKDIR /usr/src/iot-server

RUN mkdir ${WORKDIR}

WORKDIR ${WORKDIR}

COPY package.json ${WORKDIR}

RUN npm install --production

ADD dist ${WORKDIR}

CMD ["npm", "run", "production"]