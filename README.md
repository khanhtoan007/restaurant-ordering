# 🍽️ QR Table Ordering Web App - PERN Stack

## 🧩 Stack & Tech

- **Frontend**: React (TypeScript)
- **Backend**: Express.js (TypeScript)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Other**: RESTful API, modular folder structure, dotenv config

---

## 📌 Use Case Summary

- Khách **không cần đăng nhập**, chỉ cần scan mã QR của bàn đó để xem thực đơn và đặt món cho bàn họ ngồi.
- **Servicer** có thể:
  - Xác nhận đơn hàng (món ăn)
  - Kiểm tra & cập nhật số lượng món hàng
  - Chốt bill và xuất hóa đơn
- **Admin** có đầy đủ quyền của Servicer + Dashboard thống kê

---

## 🗂️ Backend Architecture (Modular Clean Architecture)

```
server/
├── src/
│   ├── app.ts                # Express app init
│   ├── index.ts              # Server entry
│   ├── config/               # Cấu hình Prisma, env
│   ├── modules/              # Feature-based modules
│   │   ├── table/            # Bàn ăn
│   │   ├── menu/             # Món ăn
│   │   ├── order/            # Đơn hàng
│   │   ├── invoice/          # Hóa đơn
│   │   └── user/             # Servicer/Admin
│   ├── middlewares/         # Xử lý middleware chung
│   ├── utils/                # Tiện ích chung
│   └── types/                # Enum, interface...
└── prisma/
    └── schema.prisma         # DB schema Prisma
```

---

## 🧱 Prisma Schema Summary

### Models:

- **Table**: bàn ăn, có QR code (token)
- **MenuItem**: món ăn, giá cả, tồn kho
- **Order**: đơn đặt món của bàn
- **OrderItem**: từng món trong order
- **User**: servicer/admin
- **Invoice**: hóa đơn sau khi chốt bill

### Enums:

```ts
enum OrderStatus {
  PENDING
  CONFIRMED
  COMPLETED
}

enum OrderItemStatus {
  PENDING
  PREPARING
  SERVED
}

enum UserRole {
  SERVICER
  ADMIN
}
```

---

## 🚀 Backend Init Steps

```bash
# Khởi tạo dự án
mkdir server && cd server
npm init -y

# Cài đặt Express, Prisma, TypeScript
npm install express cors dotenv
npm install -D typescript ts-node-dev @types/node @types/express
npm install prisma --save-dev
npm install @prisma/client
npx prisma init

# Tạo tsconfig.json
npx tsc --init
```

### Scripts trong package.json:

```json
"scripts": {
  "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js",
  "prisma:migrate": "prisma migrate dev",
  "prisma:generate": "prisma generate",
  "prisma:studio": "prisma studio"
}
```

---

## 🌐 Frontend Init (React + TypeScript)

```bash
npx npm create vite@latest
cd client
npm install axios react-router-dom
```

---

## ✅ Ghi chú thêm

- Dự án chưa yêu cầu cập nhật real-time.
- Có thể dùng Zod/Yup để validate dữ liệu ở tầng API.
- Các route nên phân quyền theo middleware (servicer vs admin).

---

## ✍️ Author: Generated with ❤️ by ChatGPT

