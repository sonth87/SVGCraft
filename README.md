# SVGCraft — Vector Icon Library, Inspector & Code Studio

**SVGCraft** là kho lưu trữ, tra cứu, tùy chỉnh và xuất mã SVG Vector chuẩn hóa theo chủ đề (Categories), phong cách (Outlined, Filled, Duotone, Multicolor, Monocolor), biến thể Sáng/Tối và xuất trực tiếp sang **SVG XML**, **React JSX**, **Vue SFC**, **HTML `<img>`**, **Data URI** và **PNG (32px–512px)**.

---

## Tính năng nổi bật

- **500.000+ Vector Icons & 1.500+ Bộ sưu tập**: Phân loại chính xác theo 11 chủ đề công nghệ & thiết kế (AI & Machine Learning, Cloud & Infrastructure, Developer Tools, UI Controls, Design, Security, Finance, Social, Productivity, Hardware, Brand Logos).
- **theSVG.org-style Inspector & Code Studio**:
  - Khung xem trước hỗ trợ **Keyline Grid Overlay**, phóng to/thu nhỏ, kéo khung (Pan & Zoom), đổi nền (`Checker`, `Light`, `Dark`) và hiệu ứng **Brand Glow**.
  - Bảng màu tự động trích xuất từ vector XML kèm **Live Color Picker** đổi màu trực tiếp.
  - Xuất ảnh **PNG** sắc nét (`32px`, `64px`, `128px`, `256px`, `512px`) hoặc copy thẳng vào Clipboard.
- **Tối ưu hóa cho Cloudflare R2 (Free Tier Protected) & Vercel (`svgcraft.vercel.app`)**:
  - Chỉ mục nén `data/catalog-index.json.gz` (~2.9 MB) chứa toàn bộ metadata giúp tìm kiếm & lọc tức thời trên Vercel Serverless mà không cần đẩy hàng trăm nghìn file `.svg` lên Git.
  - Tích hợp **Cầu chì bảo vệ hạn mức Free của Cloudflare R2 (`R2Client`)**:
    - Giới hạn cứng dung lượng ở mức **8.5 GB** (dưới mức 10 GB Free Tier).
    - Giới hạn cứng **800.000 Class A operations/tháng** (dưới mức 1.000.000 Free Tier).
    - Tự động nén XML SVG trước khi tải lên và gắn header `Cache-Control: public, max-age=31536000, immutable` để cache 1 năm trên Cloudflare Edge CDN & Vercel Edge Network.

---

## Cấu hình Môi trường (`.env`)

Sao chép `.env.example` thành `.env` (file `.env` đã được chặn hoàn toàn trong `.gitignore`):

```bash
cp .env.example .env
```

Các biến môi trường:
- `R2_ENDPOINT`: S3 API Endpoint của Cloudflare R2
- `R2_BUCKET`: Tên bucket (mặc định: `svg-icon`)
- `R2_ACCESS_KEY_ID`: Access Key ID của R2 API Token
- `R2_SECRET_ACCESS_KEY`: Secret Access Key của R2 API Token
- `R2_PUBLIC_URL`: (Tùy chọn) Custom Domain hoặc Public URL gắn với bucket R2. Nếu để trống trên Vercel, server sẽ tự động proxy từ R2 kèm `s-maxage=31536000` để cache tại Vercel Edge CDN.

---

## Các lệnh chạy

```bash
# Chạy Web Portal tại http://localhost:3000
npm run start:web

# Đóng gói chỉ mục nén data/catalog-index.json.gz (2.9 MB) cho Vercel
npm run build:index

# Kiểm tra trạng thái & số lượng file SVG chờ đẩy lên Cloudflare R2 (Dry-run)
npm run r2:dry-run

# Đồng bộ kho SVG trong output/ lên Cloudflare R2 (có bảo vệ hạn mức Free Tier)
npm run r2:sync
```
