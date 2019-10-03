FROM node:12

ENV WORKDIR /usr/src/biot
ENV COMMONDIR ${WORKDIR}/packages/common
ENV CLIENTDIR ${WORKDIR}/packages/client
ENV BACKDIR ${WORKDIR}/packages/back
ENV BIOTDIR ${WORKDIR}/packages/biot
ENV COMMON packages/common
ENV CLIENT packages/client
ENV BACK packages/back
ENV BIOT packages/biot

RUN mkdir -p ${WORKDIR}
RUN mkdir -p ${COMMONDIR}
RUN mkdir -p ${CLIENTDIR}
RUN mkdir -p ${BACKDIR}
RUN mkdir -p ${BIOTDIR}

WORKDIR ${WORKDIR}

COPY ${COMMON} ${COMMONDIR}
COPY ${CLIENT} ${CLIENTDIR}
COPY ${BACK} ${BACKDIR}
COPY ${BIOT} ${BIOTDIR}

COPY package*.json lerna.json ${WORKDIR}/

COPY ${BIOT}/dist ${BIOTDIR}

RUN npm install -g lerna cross-env

RUN lerna bootstrap

CMD cross-env NODE_ENV=production node ${BIOTDIR}/dist/index.js