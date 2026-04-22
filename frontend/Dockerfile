FROM node:20-alpine AS builder
WORKDIR /workspace/frontend
COPY frontend/package.json package.json
COPY frontend/index.html index.html
COPY frontend/src src
COPY frontend/scripts scripts
RUN npm install
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=builder /workspace/frontend/dist /usr/share/nginx/html
EXPOSE 80
