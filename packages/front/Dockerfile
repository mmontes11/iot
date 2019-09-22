FROM node:12

ARG FRONT_PORT=80
ENV FRONT_PORT=${FRONT_PORT}
ENV WORKDIR /usr/src/iot-web

RUN mkdir ${WORKDIR}

WORKDIR ${WORKDIR}

ADD dist ${WORKDIR}

RUN npm i -g serve

CMD serve -l ${FRONT_PORT} -s