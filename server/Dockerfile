FROM node:22-slim AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:22-slim
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist
ENV PORT=3000
EXPOSE 3000
RUN apt-get update -y && apt-get install -y openssl
CMD ["node", "dist/main.js"]
