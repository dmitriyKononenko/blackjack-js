FROM node:20-alpine as builder

WORKDIR /app

COPY yarn.lock ./
COPY apps/frontend/package.json ./

RUN yarn install --pure-lockfile --non-interactive --frozen-lockfile

COPY apps/frontend ./

RUN yarn build


FROM nginx:1.19.0

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/build .

ENTRYPOINT ["nginx", "-g", "daemon off;"]
