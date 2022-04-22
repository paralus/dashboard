FROM node:16 AS builder
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install --pure-lockfile

COPY . .
RUN yarn run build

FROM nginx:1.21.1
EXPOSE 80
COPY ./deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
