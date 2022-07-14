FROM node:14.18

WORKDIR /gva_web/
COPY . .

RUN yarn && yarn build

FROM nginx:alpine
LABEL MAINTAINER="qingshia@foxmail.com"

COPY .docker-compose/nginx/conf.d/my.conf /etc/nginx/conf.d/my.conf
COPY --from=0 /gva_web/dist /usr/share/nginx/html
RUN cat /etc/nginx/nginx.conf
RUN cat /etc/nginx/conf.d/my.conf
RUN ls -al /usr/share/nginx/html
