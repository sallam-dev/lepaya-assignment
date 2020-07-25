FROM node:14-alpine AS builder
WORKDIR /workdir
COPY . /workdir
RUN yarn --cwd client install --frozen-lockfile
RUN yarn install --frozen-lockfile
RUN ./build.sh

FROM node:14-alpine AS prod-deps
WORKDIR /workdir
COPY . /workdir
RUN yarn install --frozen-lockfile --prod


FROM node:14-alpine
RUN apk --no-cache add ca-certificates
WORKDIR /app
COPY --from=builder /workdir/.build ./
COPY --from=prod-deps /workdir/node_modules node_modules
EXPOSE 9090
ENTRYPOINT ["node", "main.js"]
