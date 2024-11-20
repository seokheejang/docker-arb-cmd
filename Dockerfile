FROM node:18-bullseye-slim
WORKDIR /workspace
COPY ./package.json ./yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build
ENTRYPOINT ["node", "index.js"]
