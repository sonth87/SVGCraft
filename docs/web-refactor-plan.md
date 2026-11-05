# SVGCraft Web — Kế hoạch tái cấu trúc

> Trạng thái: **đã chốt** (2026-11-05). Cập nhật file này khi xong mỗi giai đoạn.

## 1. Vì sao phải làm

Số đo thực tế với 243.929 icon / 1.580 collection:

| Vấn đề                                     | Hiện trạng                                                                                                                           |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Server nạp toàn bộ catalog vào RAM         | Giải nén `catalog-index.json.gz` → ~284MB heap mỗi instance, cold start ~0,8s                                                        |
| Tìm kiếm/lọc quét tuần tự                  | 100–170ms CPU mỗi request, offset bị chặn ở 12.000                                                                                   |
| Client tải hết thông tin lúc vào trang     | `/api/catalog/summary` 335KB, trong đó 261KB là toàn bộ collection, 65KB là 2.239 grid size                                          |
| SVG đi vòng qua Vercel function            | Khi thiếu `R2_PUBLIC_URL`, mỗi ảnh trong lưới tốn một lượt gọi function và một lượt đọc R2                                           |
| Lottie tải lại từ lordicon.com mỗi lần xem | ~1,2s                                                                                                                                |
| Không có SEO cho trang chi tiết            | Server chỉ render metadata, phần thân trang do `app.js` vẽ                                                                           |
| Rate limit, quota R2 không đáng tin        | Bộ đếm nằm trong RAM của từng instance serverless                                                                                    |
| God file                                   | `app.js` 5.267 dòng, `globals.css` 2.892 dòng, `stateManager.js` 2.058 dòng dùng chung cho crawler và web, `r2-sync-state.json` 18MB |

## 2. Các quyết định đã chốt

| Chủ đề          | Quyết định                                                                                                       |
| --------------- | ---------------------------------------------------------------------------------------------------------------- |
| Lưu trữ dữ liệu | **Không dùng database.** Catalog là các file JSON rút gọn commit lên git. SVG/Lottie để trên Cloudflare R2 + CDN |
| Ngôn ngữ        | TypeScript cho toàn bộ code mới                                                                                  |
| Style           | CSS Modules theo component, giữ bộ biến màu hiện có trong một file tokens                                        |
| URL             | Giữ nguyên URL hiện tại. Ngôn ngữ đổi trong giao diện, không thêm `/vi` hay `/en`                                |
| CDN             | Custom domain trên Cloudflare cho R2, cấu hình qua biến `R2_PUBLIC_URL` (domain: _chưa điền_)                    |

## 3. Kiến trúc dữ liệu

```
crawl ─► output/ (local, gitignore, như hiện nay)
          └─► npm run publish
                ├─ 1. SVG/Lottie mới hoặc đã đổi ─► R2, đặt tên theo hash (svg/{hash}.svg, lottie/{hash}.json)
                ├─ 2. Sinh JSON rút gọn ─► data/catalog/  (commit lên git)
                └─ 3. git commit + push ─► Vercel tự deploy
```

### `data/catalog/` (commit lên git, ~30–50MB)

- `collections.json`: thông tin tóm tắt các collection
- `facets.json`: số đếm category, style, loại icon, site, nhóm grid
- `collections/{site}/{slug}.json`: icon của từng collection. Mỗi icon một dòng để git diff gọn. Collection lớn chia thành nhiều file, mỗi file 500 icon

Mỗi record icon lưu cả `svgHash` (và `lottieHash` nếu có). Đây cũng là **trạng thái đồng bộ R2**: lần publish sau hash nào đã có thì bỏ qua, nên bỏ được `r2-sync-state.json`.

**Không commit** các file `metadata.json` gốc của crawler (tổng 241MB).

### Lúc build

`next build` đọc `data/catalog/` rồi sinh `search/index.bin`: chỉ mục từ khoá → danh sách icon, danh sách icon theo từng giá trị bộ lọc, thứ tự sắp xếp có sẵn, lưu dạng mảng số. File này là dữ liệu dẫn xuất, **không commit**. Mục tiêu: RAM 20–40MB, mỗi truy vấn dưới 10ms, phân trang bằng cursor.

### Mỗi loại dữ liệu đi từ đâu

| Dữ liệu                       | Nguồn                                                        | Ghi chú                               |
| ----------------------------- | ------------------------------------------------------------ | ------------------------------------- |
| File SVG, Lottie              | Cloudflare CDN, đi thẳng                                     | Cache vĩnh viễn (tên theo hash)       |
| Bộ lọc, số đếm                | API → `facets.json`                                          | CDN cache đến lần deploy sau          |
| Lưới, tìm kiếm, lọc kết hợp   | API `/api/icons` → `index.bin`                               | Mỗi lần một trang, cursor             |
| Trang collection              | API → file JSON của collection                               | Mỗi lần một trang                     |
| Trang chi tiết                | Server Component đọc đúng file JSON của collection chứa icon | ISR, HTML đã render sẵn               |
| Yêu thích, lựa chọn xuất file | localStorage                                                 | Có tài khoản thì chuyển sang KV/Redis |

JSON **không** đặt trong `public/`, để không ai tải được cả catalog chỉ bằng vài vòng lặp.

## 4. Kiến trúc giao diện

- Next.js App Router: trang là Server Component. Client Component chỉ dùng cho phần tương tác (bộ lọc, cuộn vô hạn, studio, panel Export, color picker)
- Bộ lọc trên URL (`nuqs`). Client gọi API bằng TanStack Query. Studio dùng một store Zustand nhỏ trong trang chi tiết
- i18n: `next-intl`, bản dịch tách ra file JSON
- `lottie-web` và `@uiw/react-color-colorful` chỉ nạp khi cần

```
apps/web/src/
  app/(catalog)/page.tsx
  app/collection/[...]/page.tsx
  app/icon/[...]/page.tsx
  app/api/{facets,icons,collections}/route.ts
  features/{catalog,collection,icon-studio,export}/
  components/ui/
  lib/{catalog,cdn,i18n,query}/
packages/
  core/           types, taxonomy, slug
  svg-tools/      đổi màu SVG/Lottie, xuất JSX/Vue/DataURI, biên dịch SVG động (hàm thuần, có test)
  catalog-index/  sinh index (publish/build) + truy vấn (runtime)
  storage/        client R2
apps/crawler/     chỉ crawl → output/
scripts/publish.ts
```

## 5. Quản lý

- ESLint, Prettier, `tsc --noEmit`, Vitest (packages), Playwright (luồng chính) chạy trong GitHub Actions
- Giới hạn hiệu năng: JS trang đầu dưới 150KB gzip, response API dưới 30KB
- Kiểm tra biến môi trường bằng zod khi khởi động. Thiếu `R2_PUBLIC_URL` trên production thì báo lỗi ngay, không lặng lẽ chuyển sang proxy
- Rate limit dùng chung giữa các instance (Upstash Redis hoặc WAF của Vercel/Cloudflare)

## 6. Lộ trình

Thay dần từng phần, web vẫn chạy suốt quá trình. Mỗi trang là một route riêng nên trang đã viết lại dùng React, trang chưa viết lại vẫn chạy `app.js`.

| #   | Giai đoạn                | Nội dung                                                                                                                                        | Ước lượng | Trạng thái     |
| --- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------- | -------------- |
| 0   | Nền móng                 | TS, lint, Prettier, Vitest, CI. Tách hàm thuần từ `app.js` sang `packages/svg-tools` kèm test                                                   | 2–3 ngày  | Xong (11/2026) |
| 1   | Dữ liệu                  | `publish` (upload theo hash, sinh `data/catalog/`), `index.bin` lúc build, API cursor, cho `app.js` dùng nguồn mới. Xoá `catalog-index.json.gz` | 3–4 ngày  |                |
| 2   | Trang chi tiết           | React + SSR, studio, panel Export, color picker có màu gần đây                                                                                  | 5–7 ngày  |                |
| 3   | Trang collection         | React, cursor                                                                                                                                   | 2–3 ngày  |                |
| 4   | Catalog, sidebar, topbar | React, bộ lọc trên URL, cuộn vô hạn. **Xoá `app.js`**, chia nhỏ `globals.css`                                                                   | 4–6 ngày  |                |
| 5   | Hoàn thiện               | Sitemap 244k trang, rate limit dùng chung, theo dõi lỗi, đo hiệu năng                                                                           | 2–3 ngày  |                |

### Lưu ý trong giai đoạn chuyển tiếp

- `app.js` không qua bundler nên không import được `packages/svg-tools`. Cho tới giai đoạn 4 sẽ có **hai bản** của các hàm xử lý. Sửa bug ở bản nào thì phải sửa cả bản kia. Test của `svg-tools` là chuẩn để đối chiếu.
- `packages/svg-tools/test/parity.legacy.test.ts` chạy cùng đầu vào qua cả hai bản (màu, SVG, Lottie) và báo lỗi nếu kết quả khác nhau. Xoá file này cùng lúc xoá `app.js`.
- Phần sinh code (JSX, Vue, HTML, format) **cố ý khác** bản cũ vì đã sửa lỗi: JSX hợp lệ cho `style="…"` và `<style>` của SVG động, link `<img>` không còn bị ghép origin vào trước link CDN, SVG minified được xuống dòng khi format. Bản trong `app.js` vẫn còn các lỗi này cho tới giai đoạn 2.

### Giai đoạn 0 — đã làm

- `tsconfig.base.json`, `apps/web/tsconfig.json` (`allowJs`, file `.jsx` cũ vẫn chạy), `next-env.d.ts`
- ESLint (`next/core-web-vitals` + `prettier`, bỏ qua `public/app.js`), Prettier, Vitest
- `packages/svg-tools`: color, svg-customize, lottie-customize, format, codegen. 38 test, kể cả kiểm tra JSX sinh ra bằng trình biên dịch TypeScript
- Next dùng package dạng TypeScript gốc qua `transpilePackages`, đã chạy thử `next build`
- `npm run check` = format + lint + typecheck + test; `.github/workflows/ci.yml` chạy lệnh này trên push/PR
- Chưa tách: `compileStandaloneAnimatedSvg` và `exportSvgToPng` cần DOM, sẽ chuyển vào `features/` ở giai đoạn 2
