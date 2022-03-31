FROM node:16 AS builder
WORKDIR /app
COPY . .
RUN npm install --force
ENV PATH /app/node_modules/.bin:$PATH
EXPOSE 3000
CMD ["npm", "run", "start"]

# FROM nginx:1.21.1
# EXPOSE 80
# COPY ./deploy/nginx.conf /etc/nginx/conf.d/default.conf
# COPY --from=builder /app/build /usr/share/nginx/html
