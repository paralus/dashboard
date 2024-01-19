FROM node:16 AS builder
WORKDIR /app
COPY package.json .
COPY yarn.lock .

# Sometime yarn install in CI fail due to network timeout. Hence
# timeout has increased to 10 min.
RUN yarn install --pure-lockfile --network-timeout 600000

COPY . .
RUN yarn run build

FROM nginx:1.25.3
EXPOSE 80
COPY ./deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
