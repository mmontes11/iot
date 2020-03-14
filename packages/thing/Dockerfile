FROM node:12

ENV WORKDIR /usr/src/thing
ENV COMMONDIR ${WORKDIR}/packages/common
ENV THINGDIR ${WORKDIR}/packages/thing
ENV COMMON packages/common
ENV THING packages/thing

RUN mkdir -p ${WORKDIR}
RUN mkdir -p ${COMMONDIR}
RUN mkdir -p ${THINGDIR}

WORKDIR ${WORKDIR}

COPY ${COMMON} ${COMMONDIR}
COPY ${THING} ${THINGDIR}

COPY package*.json lerna.json ${WORKDIR}/

COPY ${THING}/src ${THINGDIR}

RUN npm install -g lerna cross-env

RUN lerna bootstrap

CMD cross-env NODE_ENV=production node ${THINGDIR}/src/index.js