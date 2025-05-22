FROM node:18-alpine as builder
RUN mkdir /app && chown -R node:node /app
USER node
WORKDIR /app
COPY --chown=node:node . .
RUN yarn install --frozen-lockfile --network-timeout 1000000 
RUN yarn build && npm prune --production

FROM node:18-alpine 
ENV NODE_ENV production
EXPOSE 5000
USER node
WORKDIR /usr/src/app

COPY --from=builder --chown=node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/package.json .

CMD [ "node", "dist/index.js" ]
