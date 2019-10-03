FROM node:12

ENV WORKDIR /usr/src/back
ENV COMMONDIR ${WORKDIR}/packages/common
ENV BACKDIR ${WORKDIR}/packages/back
ENV COMMON packages/common
ENV BACK packages/back

RUN mkdir -p ${WORKDIR}
RUN mkdir -p ${COMMONDIR}
RUN mkdir -p ${BACKDIR}

WORKDIR ${WORKDIR}

COPY ${COMMON} ${COMMONDIR}
COPY ${BACK} ${BACKDIR}

COPY package*.json lerna.json ${WORKDIR}/

COPY ${BACK}/dist ${BACKDIR}

RUN npm install -g lerna cross-env

RUN lerna bootstrap

CMD cross-env NODE_ENV=production node ${BACKDIR}/dist/index.js