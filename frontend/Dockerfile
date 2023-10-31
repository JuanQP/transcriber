FROM node:20-alpine as builder

ARG ARG_BACKEND_URL
ENV VITE_BACKEND_URL=${ARG_BACKEND_URL}
WORKDIR /app

COPY package*.json /app/
RUN npm install

COPY . .
RUN npm run build

FROM nginx:1.25-alpine
COPY --from=builder /app/dist/ /usr/share/nginx/html/
