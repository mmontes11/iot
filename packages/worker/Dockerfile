FROM node:12

ENV WORKDIR /usr/src/worker
ENV COMMONDIR ${WORKDIR}/packages/common
ENV WORKERDIR ${WORKDIR}/packages/worker
ENV COMMON packages/common
ENV WORKER packages/worker

RUN mkdir -p ${WORKDIR}
RUN mkdir -p ${COMMONDIR}
RUN mkdir -p ${WORKERDIR}

WORKDIR ${WORKDIR}

COPY ${COMMON} ${COMMONDIR}
COPY ${WORKER} ${WORKERDIR}

COPY package*.json lerna.json ${WORKDIR}/

COPY ${WORKER}/dist ${WORKERDIR}

RUN npm install -g lerna cross-env

RUN lerna bootstrap

CMD cross-env NODE_ENV=production node ${WORKERDIR}/dist/index.js