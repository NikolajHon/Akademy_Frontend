# -------------------------
# 1) Stage: сборка Angular
# -------------------------
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration=production

# -------------------------
# 2) Stage: runtime на Nginx
# -------------------------
FROM nginx:1.24-alpine
WORKDIR /usr/share/nginx/html

# Удаляем дефолтные файлы
RUN rm -rf ./*

# Копируем собранную статику
COPY --from=builder /app/dist/akademy-frontend/browser ./

# **Копируем наш кастомный конфиг**
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
