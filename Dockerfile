FROM node:14-alpine AS builder
WORKDIR /project
RUN yarn install
RUN cd client
RUN yarn install
RUN cd ../
RUN sh build.sh

FROM node:14-alpine AS prod-deps
WORKDIR /project
RUN yarn install --frozen-lockfile --production=true


FROM node:14-alpine
RUN apk --no-cache add ca-certificates
WORKDIR /project
COPY --from=builder /project/.build /project
COPY --from=builder /project/node_modules .
ENTRYPOINT node main.js
