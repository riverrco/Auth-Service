FROM node:10-alpine

WORKDIR /usr/src/auth

COPY ./package.json .

RUN npm install && npm install knex pm2 -g

COPY . . 

EXPOSE 9091

CMD ["npm", "run", "start:prod"]