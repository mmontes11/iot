FROM node:8

ENV WORKDIR /usr/src/iot-web

RUN mkdir ${WORKDIR}

WORKDIR ${WORKDIR}

ADD dist ${WORKDIR}

RUN npm i -g serve

CMD ["serve", "-l", "80", "-s"]
