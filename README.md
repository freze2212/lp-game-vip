# Landing Page Game VIP (DT8386 / MM8KJC)

Landing page giao diện Cổng Game Quốc Tế Ultimate VIP tích hợp hệ thống tự động cấu hình link chuyển hướng theo tên miền trên Cloudflare Pages & Workers.

## 🚀 Tính năng nổi bật
- **Giao diện Cyberpunk VIP**: Hiệu ứng Cyber Canvas, đếm số người dùng trực tuyến thực tế, terminal kiểm tra IP an toàn, ticker rút tiền/thưởng.
- **Link Routing Động**: Tự động khớp tên miền truy cập (`dt8386.cc`, `mm8kjc.com`,...) với link đích tương ứng trong `domains.json`.
- **Cloudflare Serverless Integration**: Chạy trực tiếp trên Cloudflare Pages / Workers với `_worker.js` và `config.js`.
- **Tối ưu hóa Offline**: Tích hợp sẵn FontAwesome 6.4.0 & Google Fonts nội cục.

## 📁 Thư mục & Cấu trúc File
- `index.html`: Giao diện chính của landing page.
- `domains.json`: File cấu hình ánh xạ tên miền -> link đích.
- `config.js`: Script xử lý cập nhật link CTA động ở client.
- `_worker.js`: Cloudflare Serverless Worker routing.
- `assets/`: Chứa CSS và Font cục bộ.

## ⚙️ Cấu hình Tên Miền (domains.json)
```json
{
  "dt8386.cc": {
    "main_url": "https://daily.td88v5s.com/?inviteCode=20432384"
  },
  "mm8kjc.com": {
    "main_url": "https://dmrfw.mm88r.com/register.html"
  },
  "default": {
    "main_url": "https://daily.td88v5s.com/?inviteCode=20432384"
  }
}
```
