
GEARCLONE - Final Project
Web Programming with Node.js

Group Members:
- Nguyễn Bảo Thắng – 522K0025
- Nguyễn Nhật Khoa – 522K0028
- Trần Hoàng Hiếu – 522K0036

---

Project Description:
GEARCLONE is a web-based e-commerce platform for selling computer components and accessories. It includes full functionality for both users and administrators, with account management, product catalog, cart, checkout, discount codes, loyalty points, and order tracking.

---

Technologies Used:
- Frontend: HTML, CSS, Bootstrap, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT & bcrypt
- Email Service: Nodemailer
- Deployment: Docker & Docker Compose

---

How to Run:

1. Build and start containers:
   docker compose up -d --build

2. Access backend container:
   docker exec -it backend bash

3. Seed admin and sample data:
   node seed.js

4. Open in browser:
   http://localhost:8889

---

Default Admin Account:
- Email: baothang0932@gmail.com
- Password: 123456

