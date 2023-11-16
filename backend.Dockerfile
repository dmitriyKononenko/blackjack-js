
FROM node:20-alpine

WORKDIR /app

COPY yarn.lock ./
COPY apps/backend/package.json ./
COPY apps/backend/tsconfig.json ./
COPY apps/backend/tsconfig.build.json ./

RUN yarn install --pure-lockfile --non-interactive --frozen-lockfile

COPY apps/backend/src ./

RUN yarn build

CMD ["node", "dist/main.js"]
