# 1. Mượn một hệ điều hành Linux mini có cài sẵn Node.js
FROM node:22-alpine

# 2. Tạo một thư mục ảo tên là /app bên trong Container
WORKDIR /app

# 3. Copy file quản lý thư viện và cài đặt (Express...)
COPY package*.json ./
RUN npm install

# 4. Copy toàn bộ code của bạn (server.js, my-website) vào Container
COPY . .

# 5. Mở cửa số 80 để đón khách
EXPOSE 80

# 6. Lệnh để chạy Web khi Container khởi động
CMD ["node", "server.js"]
