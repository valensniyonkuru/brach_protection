FROM node:20-alpine
WORKDIR /workspace/qa
COPY qa/package.json package.json
COPY qa/smoke smoke
RUN npm install
CMD ["npm", "test"]
