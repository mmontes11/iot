FROM eclipse-mosquitto

ENV WORKDIR /mosquitto

COPY mosquitto.conf ${WORKDIR}/config/mosquitto.conf

COPY mosquitto-entrypoint.sh ${WORKDIR}/mosquitto-entrypoint.sh

ENTRYPOINT ["sh", "/mosquitto/mosquitto-entrypoint.sh"]

CMD ["/usr/sbin/mosquitto","-c","/mosquitto/config/mosquitto.conf"]