FROM node:14-alpine AS builder
RUN yarn install
RUN cd client
RUN yarn install
RUN cd ../
RUN sh build.sh

FROM node:14-alpine
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder .build .
ENTRYPOINT node main.js
