FROM node:16.14.0-alpine AS buildui
WORKDIR /build
RUN npm install --force -g yarn 
COPY front/headscale-manager-ui/package.json .
COPY front/headscale-manager-ui/yarn.lock .
RUN yarn install
COPY front/headscale-manager-ui .
RUN yarn build

FROM golang:1.20-bullseye AS buildgo
WORKDIR /go/src/app
ENV GOPROXY=https://goproxy.io,direct
COPY go.mod .
COPY go.sum .
RUN go mod download
COPY . .
COPY --from=buildui /build/dist /go/src/app/front/headscale-manager-ui/dist
RUN go get && \
    go install

FROM debian:stable
COPY --from=buildgo /go/bin/headscale-manager /app/headscale-manager
EXPOSE 8080/tcp
WORKDIR /app
RUN chmod +x /app/headscale-manager
CMD ["/app/headscale-manager"]