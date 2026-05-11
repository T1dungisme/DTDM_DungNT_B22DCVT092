# DTDM_DungNT_B22DCVT092
Dự án triển khai ứng dụng web Node.js theo mô hình phân tán 3 lớp (3-Tier Architecture) trên hạ tầng Microsoft Azure, sử dụng Docker 
để container hóa và MongoDB Atlas làm cơ sở dữ liệu đám mây.
----------------------------------------------------------------------------------------------------------------------------------
System Architecture
  Hệ thống được thiết kế để đảm bảo tính sẵn sàng cao và khả năng mở rộng:
    - Web Server (Frontend/Backend): Node.js chạy trong Docker Container trên Azure Virtual Machine (Ubuntu Server).
    - Database (Data Tier): MongoDB Atlas (PaaS) tách biệt hoàn toàn với máy chủ ứng dụng để bảo mật dữ liệu.
    - Networking: Cấu hình Network Security Group (NSG) để kiểm soát lưu lượng truy cập qua các cổng 80 (HTTP), 22 (SSH) và 3000.
----------------------------------------------------------------------------------------------------------------------------------
Tech Stack
  - Cloud Platform: Microsoft Azure (Virtual Machines).
  - Containerization: Docker, Docker Compose.
  - Database: MongoDB Atlas (NoSQL).
  - Backend: Node.js, Express.js.
  - Operating System: Linux (Ubuntu Server).
----------------------------------------------------------------------------------------------------------------------------------
Project Structure
📦 Azure-Web-Deployment
 ┣ 📂 src/              # Toàn bộ mã nguồn ứng dụng Node.js
 ┣ 📂 docs/             # Báo cáo PDF và ảnh minh chứng triển khai
 ┣ 📜 Dockerfile        # Cấu hình build image cho ứng dụng
 ┣ 📜 docker-compose.yml # Quản lý và chạy các container
 ┣ 📜 .gitignore        # Loại bỏ các file nhạy cảm và node_modules
 ┗ 📜 README.md         # Hướng dẫn dự án
----------------------------------------------------------------------------------------------------------------------------------
How to Run
  1. Prerequisites
     - Đã cài đặt Docker và Docker Compose trên máy ảo/máy cục bộ.
     - Chuỗi kết nối (Connection String) từ MongoDB Atlas.
  2. Deployment Steps
     - Clone repository: git clone https://github.com/T1dungisme/Azure-Web-Deployment.git
                         cd Azure-Web-Deployment
     - Cấu hình môi trường: Tạo file .env và thêm chuỗi kết nối database.
     - Khởi chạy hệ thống bằng Docker Compose: docker-compose up -d --build
     - Truy cập: Mở trình duyệt và nhập http://<Public-IP-Azure>.
---------------------------------------------------------------------------------------------------------------------------------- 
Outcomes
  - triển khai thành công ứng dụng web từ môi trường local lên Cloud.
  - Tối ưu hóa quy trình vận hành nhờ Docker, giúp loại bỏ xung đột môi trường.
  - Đảm bảo an toàn dữ liệu bằng cách sử dụng dịch vụ database đám mây độc lập.
