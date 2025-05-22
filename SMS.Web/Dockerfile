FROM node:alpine as builder
WORKDIR /app

COPY package.json yarn.lock ./ 

# RUN yarn install --frozen-lockfile
RUN yarn install --frozen-lockfile --network-timeout 1000000

COPY . .
RUN ["yarn", "build"]


FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/build .