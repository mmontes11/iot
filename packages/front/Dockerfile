FROM node:12

ARG PORT=80
ENV PORT=${PORT}
ENV WORKDIR /usr/src/iot-front

RUN mkdir ${WORKDIR}

WORKDIR ${WORKDIR}

ADD dist ${WORKDIR}

RUN npm i -g serve

CMD serve -l ${PORT} -s