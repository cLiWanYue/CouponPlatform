FROM node:12.13.1-alpine3.10
WORKDIR /server
COPY ./server /server/

RUN sed -i 's/localhost/coupon-db/g' /server/src/config.js \
    && npm i --registry=https://registry.npm.taobao.org
EXPOSE 3000
ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["npm", "run","start"]
