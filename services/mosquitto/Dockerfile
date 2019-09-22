FROM eclipse-mosquitto

ARG MQTT_BROKER_USERNAME=mosquitto
ARG MQTT_BROKER_PASSWORD=mosquitto
ENV MQTT_BROKER_USERNAME=${MQTT_BROKER_USERNAME}
ENV MQTT_BROKER_PASSWORD=${MQTT_BROKER_PASSWORD}
ENV WORKDIR /mosquitto

COPY mosquitto.conf ${WORKDIR}/config/mosquitto.conf

ADD scripts/ ${WORKDIR}

RUN chmod +x ${WORKDIR}/*.sh

RUN ${WORKDIR}/generate-passwd.sh ${MQTT_BROKER_USERNAME} ${MQTT_BROKER_PASSWORD}

ENTRYPOINT ["sh", "/mosquitto/mosquitto-entrypoint.sh"]

CMD ["/usr/sbin/mosquitto","-c","/mosquitto/config/mosquitto.conf"]