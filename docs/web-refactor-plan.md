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

### `data/catalog/` (commit lên git, 61MB, gzip 6,7MB)

- `manifest.json`: tổng số icon, collection, số icon đã lên R2 theo hash
- `collections.json`: thông tin tóm tắt các collection, mỗi collection một dòng
- `collections/{site}/{slug}.json`: icon của từng collection, mỗi icon một dòng, sắp theo slug để git diff gọn
- Định dạng record: `packages/catalog/src/schema.ts`. `files` chỉ ghi khi tên file khác quy tắc `{slug}-{id}.svg` (6.612/243.929 icon)

Mỗi record icon có `hash` theo từng variant, **chỉ khi** object đã nằm trên R2 ở `svg/{hash}.svg`. Đây cũng là **trạng thái đồng bộ R2**: lần publish sau hash nào đã có thì bỏ qua, không cần gọi R2. Icon chưa có hash dùng key R2 cũ `{site}/{collection}/icons/{file}`, nên web chạy được trong lúc chuyển dần.

Khác kế hoạch ban đầu:

- **Không chia file 500 icon.** Chèn một icon sẽ đẩy ranh giới các phần, làm diff lan ra nhiều file. Collection lớn nhất chỉ ~700KB và runtime không đọc file này
- **Không có `facets.json`.** Số đếm là dữ liệu dẫn xuất, tính lúc build cùng index
- `r2-sync-state.json` vẫn còn ở máy local, nhưng chỉ để đếm quota R2 (dung lượng, lượt ghi) và chứa danh sách key cũ. Xoá được khi xoá các object key cũ trên R2

**Không commit** các file `metadata.json` gốc của crawler (tổng 241MB).

### Lúc build

`prebuild`/`predev` chạy `scripts/build-catalog-index.ts`: đọc `data/catalog/` (~2–3s), sinh vào `apps/web/data/` (gitignore):

- `index.bin` (46MB): các cột số (site, collection, category, style…), chỉ mục từ khoá → danh sách icon, danh sách icon theo từng giá trị bộ lọc, thứ tự A–Z/Z–A có sẵn, thư mục collection/brand, summary
- `details.bin` (35MB): tags, variant, hash của từng icon. Đọc theo vị trí (pread) khi mở trang chi tiết, không nạp vào RAM

Đo thực tế (243.929 icon), so với bản cũ:

|                        | Cũ (`catalog-index.json.gz` + StateManager) | Mới                                                  |
| ---------------------- | ------------------------------------------- | ---------------------------------------------------- |
| Nạp lúc cold start     | ~0,8s, heap ~284MB                          | ~40ms, RSS +65MB                                     |
| Truy vấn lưới/tìm/lọc  | 100–170ms                                   | 0,05–5ms                                             |
| Offset tối đa          | 12.000                                      | không giới hạn, có `nextCursor`                      |
| `/api/catalog/summary` | 335KB                                       | 169KB (bỏ `gridSizes`, rút gọn danh sách collection) |
| 72 icon trong lưới     | object đầy đủ                               | 27KB, chỉ các trường lưới cần                        |

RAM cao hơn mục tiêu 20–40MB ban đầu, chủ yếu vì chuỗi id/slug/title (14MB) và danh sách token (10MB). Vẫn thấp hơn bản cũ 4 lần, nên chưa tối ưu thêm.

Tìm kiếm: mỗi từ trong truy vấn phải là chuỗi con của một token của icon (title, slug, tên collection, category, style, author, tags). Kết quả giống hệt bản cũ với truy vấn một từ. Truy vấn nhiều từ ("arrow left") cho **nhiều** kết quả hơn bản cũ (khớp đủ các từ, không cần đúng cụm), và icon có title/slug chứa nguyên cụm được xếp trước.

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
  catalog/        schema data/catalog, sinh index (build) + truy vấn (runtime)
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
| 1   | Dữ liệu                  | `publish` (upload theo hash, sinh `data/catalog/`), `index.bin` lúc build, API cursor, cho `app.js` dùng nguồn mới. Xoá `catalog-index.json.gz` | 3–4 ngày  | Xong (11/2026) |
| 2   | Trang chi tiết           | React + SSR, studio, panel Export, color picker có màu gần đây và độ trong suốt                                                                 | 5–7 ngày  | Xong (11/2026) |
| 3   | Trang collection         | React, cursor                                                                                                                                   | 2–3 ngày  | Xong (11/2026) |
| 4   | Catalog, sidebar, topbar | React, bộ lọc trên URL, cuộn vô hạn. **Xoá `app.js`**, chia nhỏ `globals.css`                                                                   | 4–6 ngày  | Xong (11/2026) |
| 5   | Hoàn thiện               | Sitemap 244k trang, rate limit dùng chung, theo dõi lỗi, đo hiệu năng                                                                           | 2–3 ngày  |                |

### Giai đoạn chuyển tiếp (đã kết thúc ở giai đoạn 4)

Trong giai đoạn 2–3, trang chi tiết và trang collection là "đảo" React gắn vào khung do `public/app.js` quản lý, hai bên nói chuyện qua `window.svgcraft*`, event `svgcraft:*` và các `data-*`. Giai đoạn 4 xoá `app.js` cùng toàn bộ cầu nối đó; `packages/svg-tools` không còn bản trùng nào cần đối chiếu.

### Giai đoạn 0 — đã làm

- `tsconfig.base.json`, `apps/web/tsconfig.json` (`allowJs`, file `.jsx` cũ vẫn chạy), `next-env.d.ts`
- ESLint (`next/core-web-vitals` + `prettier`, bỏ qua `public/app.js`), Prettier, Vitest
- `packages/svg-tools`: color, svg-customize, lottie-customize, format, codegen. 38 test, kể cả kiểm tra JSX sinh ra bằng trình biên dịch TypeScript
- Next dùng package dạng TypeScript gốc qua `transpilePackages`, đã chạy thử `next build`
- `npm run check` = format + lint + typecheck + test; `.github/workflows/ci.yml` chạy lệnh này trên push/PR
- Chưa tách: `compileStandaloneAnimatedSvg` và `exportSvgToPng` cần DOM, sẽ chuyển vào `features/` ở giai đoạn 2

### Giai đoạn 1 — đã làm

- `packages/catalog` (TS, không phụ thuộc DOM hay fs): schema, container nhị phân, build index, engine truy vấn. 23 test trên catalog mẫu
- `scripts/publish.ts` (`npm run publish`): đọc `output/`, phân loại như `StateManager` cũ, upload SVG mới lên R2 theo hash (có cầu chì quota, `--max-uploads`), ghi `data/catalog/`. Chạy lại an toàn; dừng giữa chừng thì mất tối đa một collection
- `scripts/build-catalog-index.ts`: chạy trước `next dev`/`next build`
- 5 API `/api/catalog/*` viết lại bằng TS trên index mới, **giữ nguyên URL và dạng response** nên `app.js` không phải sửa. Thêm `nextCursor` và header `X-Catalog-Build`
- Đã đối chiếu với `StateManager` cũ trên 40 truy vấn: tổng số và 24 kết quả đầu khớp, trừ các khác biệt có chủ đích ở trên, thứ tự `gridSizes` (theo bản production) và gợi ý "tương tự" (đếm theo token thay vì nguyên tag)
- Xoá `catalog-index.json.gz`, `build-catalog-index.js`, `sync-to-r2.js`, `catalogServer.js`. Web không còn dùng `StateManager`, chỉ còn `R2Client` và `parseSvgMetadata` từ `@svg-hub/shared`

### Giai đoạn 4 — đã làm

- **`app.js` đã xoá** (5.267 dòng → 0). Thư mục `apps/web/public/` không còn gì. Không còn `<script>` nào ngoài bundle của Next
- **Khung dùng chung** (`features/shell/AppChrome`) nằm trong `app/layout.jsx` nên topbar, sidebar, toast và thanh tiến trình **không bị dựng lại khi chuyển trang**. Mỗi trang là một route thật: `/` (`CatalogPage`), `/collection/*` (`CollectionView`), `/icon/*` (`IconStudio`), đều là Server Component bọc một component client
- **Điều hướng bằng router của Next** (`<Link prefetch={false}>` + `router.push`). Thẻ icon là link thật, nên bấm chuột giữa / Ctrl-click mở tab mới đúng như link bình thường. `prefetch={false}` vì trang có 72 thẻ trong tầm nhìn; thay vào đó prefetch khi con trỏ dừng 150ms trên thẻ
- **Bộ lọc nằm hoàn toàn trên URL** (`features/catalog/filters.ts`, có test): từ khoá, danh mục, kiểu, loại, collection, chữ cái, sắp xếp, yêu thích, chế độ xem. Đổi bộ lọc trên trang chủ dùng `history.replaceState/pushState` (không gọi server). `useSearch()` là một store của URL, rỗng lúc render server để HTML khớp với bản đã cache
- **Danh sách giữ lại khi quay về** (`usePagedList`): tối đa 24 danh sách, kèm mọi trang đã tải. Back trình duyệt và nút "Quay lại" đều khôi phục đúng danh sách và vị trí cuộn, không gọi lại API. Nút "Quay lại" trên trang icon về đúng danh sách đã mở icon, dù đã bấm trước/sau nhiều lần; mở trang icon trực tiếp thì về catalog
- **Đổi bộ lọc không còn nháy trắng:** danh sách cũ ở lại (mờ đi) tới khi danh sách mới về
- **SSR:** `/` có sẵn 72 icon (link thật) và sidebar; phân loại + số đếm đi theo trang (~8KB). 1.578 tên collection chỉ tải khi mở dropdown hoặc ô tìm kiếm
- **CSS chia 6 file** trong `src/styles/` (base, topbar, shell, catalog, detail, collection), giữ nguyên thứ tự cascade: ảnh chụp 5 trang × sáng/tối × desktop/mobile **trùng từng byte** trước và sau khi chia
- JS trang đầu: 122KB gzip (mục tiêu < 150KB)

**Khác bản cũ, có chủ đích:**

- **Yêu thích:** trước đây chỉ lọc trong 72 icon đầu của kết quả nên phần lớn yêu thích không hiện. Giờ lấy đúng các icon đã thích qua `POST /api/catalog/favorites`
- Bộ đếm hiện số thật ("72 / 243.929") thay cho chuỗi cố định "500,000+". Tiêu đề trang, ô tìm kiếm và mô tả vẫn ghi "500,000+" (nội dung quảng bá, chưa đổi)
- Topbar tự cao lên khi các thẻ lọc trong ô tìm kiếm xuống dòng (màn hẹp), trước đây tràn ra ngoài
- Hover Lottie trên thẻ lấy animation qua `/api/lordicon/lottie` (cache 1 ngày). Danh sách thẻ chưa có hash animation nên chưa tải thẳng từ `/cdn/lottie/` như trang chi tiết

**Còn lại:** Playwright vào CI (hiện kiểm tra bằng script cục bộ), `next-intl` (chuỗi dịch đang ở `features/shared/messages.ts`), `nuqs`/TanStack Query nếu cần (`useSearch` + `usePagedList` hiện đủ dùng).

### Giai đoạn 3 — đã làm

- `apps/web/src/features/collection/`: `CollectionView`, `IconCard` (dùng lại cho lưới ở giai đoạn 4), `CollectionHost`. Chuỗi dịch và icon dùng chung chuyển sang `features/shared/`
- **SSR:** `/collection/*` trả sẵn tiêu đề và 72 card là link thật tới trang icon, cache ISR. Trang đã lọc trên URL do client tải (server chỉ render trang chưa lọc để giữ được cache). Collection không tồn tại trả 404 thật
- **Cursor:** "tải thêm" dùng `nextCursor`. Nếu cursor hết hạn do vừa deploy, server trả về từ đầu và client thay danh sách thay vì nối trùng
- Bộ lọc nằm trên URL (`q`, `style`, `category`, `sort`). `category` là mới: trước đây lọc theo chủ đề không ghi lên URL nên không chia sẻ link được
- **Quay lại từ icon:** collection được giữ nguyên dưới trang chi tiết nên còn đủ trang đã tải, bộ lọc và vị trí cuộn, không gọi lại API. Trước đây tải lại từ đầu. Áp dụng cho cả nút "Quay lại" và nút back của trình duyệt
- `app.js` còn ~3.000 dòng: lưới catalog, directory, topbar, sidebar. Hiệu ứng hover Lottie trên card vẫn do `app.js` gắn vào `#collectionView`, chuyển sang React ở giai đoạn 4

### Giai đoạn 2 — đã làm

- `apps/web/src/features/icon-studio/`: `IconStudio` (state + layout), `Stage`, `ExportPanel`, `ColorPicker`/`ColorPopover`, `compile-animated`, `export-file`. Giữ nguyên class CSS cũ trong `globals.css`, chỉ color picker dùng CSS Module; chia `globals.css` ở giai đoạn 4
- **SSR:** `/icon/*` là Server Component, HTML có sẵn tiêu đề, SVG, tag và link icon liên quan. ISR (`revalidate` 1 ngày, render lần đầu theo yêu cầu). Icon không tồn tại trả 404 thật
- **Color picker:** `@uiw/react-color-colorful` (chỉ tải khi mở lần đầu), có độ trong suốt, HEX, màu gốc của icon, 12 màu gần đây (`localStorage`). Trong SVG màu trong suốt ghi thành `rgba()`; trong Lottie thì nhân vào opacity của shape vì Lottie bỏ qua alpha của màu
- `lottie-web` tự host (chunk riêng, chỉ tải cho icon động), bỏ cdnjs. Animation tải thẳng từ `/cdn/lottie/{hash}.json` hoặc CDN, API `/api/lordicon/lottie` chỉ là dự phòng. **Khi có `R2_PUBLIC_URL`:** bật CORS cho bucket để khỏi rơi vào dự phòng
- `sanitizeSvg` bỏ `<script>`, `<foreignObject>`, `on*`, `javascript:` khỏi SVG của bên thứ ba: giờ SVG nằm trong HTML từ server, `<script>` sẽ chạy thật nếu không lọc
- `app.js` từ 5.267 còn ~3.200 dòng. Bỏ `parity.legacy.test.ts` vì không còn bản trùng để đối chiếu
- Sửa kèm: xuất PNG không còn đổi nhầm `stroke-width` khi thẻ `<svg>` thiếu `width`; SVG động không còn nhân độ dày nét hai lần
- **Khác kế hoạch:** chưa dùng Zustand, `nuqs`, TanStack Query, `next-intl`. State của studio gói gọn trong một component nên `useState` là đủ; các thư viện kia dành cho lưới và bộ lọc ở giai đoạn 4. Chuỗi dịch của trang chi tiết tạm để ở `messages.ts`

### Giai đoạn 1b — chuyển hẳn sang storage của mình (11/2026)

- **Upload theo hash:** đã chạy `npm run publish` cho toàn bộ 243.929 icon (240.456 object sau khi gộp trùng). Web không còn đọc key cũ `{site}/{collection}/icons/{file}`; xoá chúng bằng `npm run r2:delete-legacy -- --yes` (chạy không có `--yes` để đếm trước). Route `/output/*` đã bỏ, `/svg/*` chỉ còn phục vụ `output/` khi dev
- **Lottie Lordicon lấy hết về:** crawler lưu animation vào `output/lordicon/{col}/lottie/{slug}.json` (đã giải mã từ `.li`), `npm run lordicon:lottie` tải bù cho icon crawl trước đó. `publish` đẩy lên R2 ở `lottie/{hash}.json` (gzip, ~1,8GB thô), catalog ghi `lottie` hash
- `/api/lordicon/lottie` chỉ đọc `output/` (dev) hoặc R2, **không gọi lordicon.com nữa**. `lordiconStyles` chỉ trả các style đã crawl, bỏ link `media.lordicon.com`
- **`/cdn/svg/{hash}.svg`, `/cdn/lottie/{hash}.json`:** proxy cùng domain ánh xạ thẳng key R2, dùng khi chưa có `R2_PUBLIC_URL`. URL đổi khi nội dung đổi nên cache vĩnh viễn (`immutable`) ở trình duyệt và CDN của Vercel: mỗi file chỉ tốn một lượt gọi function + một lượt đọc R2 cho mỗi region. `/cdn/*` nằm ngoài middleware nên request trúng cache không chạy code nào
- Dev (`next dev`): ảnh lưới vẫn dùng `/svg/*` để đọc `output/` trên máy trước

**Còn lại:**

- **`R2_PUBLIC_URL`:** cần một domain riêng quản lý DNS trên Cloudflare (không dùng được `*.vercel.app`). Có rồi thì trình duyệt tải thẳng từ Cloudflare, không qua Vercel
- Luôn chạy `npm run publish` có upload trước khi push catalog: icon chưa có hash không hiển thị được trên production
