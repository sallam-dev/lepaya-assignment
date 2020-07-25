FROM node:14-alpine AS builder
WORKDIR /builder
COPY . /builder
RUN yarn install --frozen-lockfile
RUN cd client
RUN yarn install --frozen-lockfile
RUN cd ../
RUN sh build.sh

FROM node:14-alpine AS prod-deps
WORKDIR /deps
RUN yarn install --frozen-lockfile --production=true


FROM node:14-alpine
RUN apk --no-cache add ca-certificates
WORKDIR /app
COPY --from=builder /builder/.build ./
COPY --from=prod-deps /deps/node_modules node_modules
ENTRYPOINT ["node", "main.js"]
