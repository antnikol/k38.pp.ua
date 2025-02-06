# Використовуємо легкий образ Node.js
FROM node:20-alpine

# Встановлюємо робочу директорію
WORKDIR /app

# Копіюємо package.json та package-lock.json
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо решту файлів у контейнер
COPY . .

# Компілюємо TypeScript
RUN npm run build

# Вказуємо порт, який буде використовуватись у контейнері
EXPOSE 3000

# Запускаємо сервер
CMD ["npm", "start"]