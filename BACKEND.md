# Backend Specification — CNC Frontend

Tài liệu bàn giao công việc Backend cần triển khai để frontend hoạt động đầy đủ.

Frontend đã viết sẵn các service gọi API theo contract dưới đây. BE chỉ cần triển khai khớp đúng. Trong lúc BE chưa sẵn sàng, bật `NEXT_PUBLIC_USE_MOCK=true` ở `.env.local` để FE chạy trên mock + JSON fallback.

---

## 1. Quy ước chung

### 1.1 Base URL
- Dev: do BE quyết định, FE đọc từ env `NEXT_PUBLIC_API_URL`.
- FE gọi API qua axios với `baseURL = process.env.NEXT_PUBLIC_API_URL`.

### 1.2 Authentication
- Dùng JWT Bearer token.
- FE lưu token vào cookie tên `token` sau khi đăng nhập, gửi qua header:
  ```
  Authorization: Bearer <token>
  ```
- Mọi route gắn nhãn **Admin** ở dưới đều phải verify token và check quyền admin. Trả 401 nếu thiếu/hết hạn token, 403 nếu không phải admin.

### 1.3 Response envelope
Tất cả response thành công bọc trong `data`:
```json
{ "data": { ... } }
```
Hoặc cho list/paginated:
```json
{ "data": [...], "totalPages": 10, "pageNumber": 1, "pageSize": 5 }
```

### 1.4 Error format
```json
{ "error": { "code": "VALIDATION_ERROR", "message": "..." } }
```
Kèm HTTP status code chuẩn (400/401/403/404/500).

### 1.5 CORS
Cho phép origin của FE:
- Dev: `http://localhost:3000`
- Prod: domain thật

Cho phép headers `Authorization`, `Content-Type`. Cho phép methods `GET, POST, PUT, DELETE, OPTIONS`.

---

## 2. Authentication

### `POST /authentication/login`
**Auth**: Public

**Body**:
```json
{ "username": "admin", "password": "******" }
```

**Response 200**:
```json
{ "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik..." }
```

**Lỗi**: 401 nếu sai credentials.

> FE đang gọi tại `services/authentication.js`. Field `data` là raw JWT string (không bọc object).

---

## 3. Pages — Quản lý nội dung trang **(MỚI)**

Mỗi trang public lưu thành 1 record JSON. Admin sửa qua UI `/management/pages/<slug>`, FE public render bằng cách fetch từ BE.

### 3.1 Slug hợp lệ (8 trang)

| Slug | Trang public | Cấu trúc tham khảo |
| --- | --- | --- |
| `trang-chu` | `/` | `default-content/trang-chu.json` |
| `gioi-thieu` | `/gioi-thieu` | `default-content/gioi-thieu.json` |
| `dich-vu` | `/dich-vu` | `default-content/dich-vu.json` |
| `gia-cong` | `/gia-cong` | `default-content/gia-cong.json` |
| `san-pham` | `/san-pham` | `default-content/san-pham.json` |
| `tin-tuc` | `/tin-tuc` | `default-content/tin-tuc.json` |
| `lien-he` | `/lien-he` | `default-content/lien-he.json` |
| `cnc-infor` | (header / footer / nav toàn site) | `default-content/cnc-infor.json` |

### 3.2 Endpoints

#### `GET /pages/:slug`
**Auth**: Public

**Response 200**:
```json
{
  "data": {
    "slug": "trang-chu",
    "content": { "hero": { ... }, "stats": [ ... ], ... },
    "updatedAt": "2026-05-04T10:30:00Z"
  }
}
```

**Response 404**: Khi chưa có record (FE sẽ tự fallback về JSON local, BE chỉ cần trả 404 sạch).

#### `PUT /pages/:slug`
**Auth**: Admin

**Body**:
```json
{ "content": { ... toàn bộ nội dung mới ... } }
```

**Response 200**:
```json
{
  "data": {
    "slug": "trang-chu",
    "content": { ... },
    "updatedAt": "2026-05-04T10:30:00Z"
  }
}
```

**Lỗi**:
- 400: slug không hợp lệ (không nằm trong 8 slug)
- 401/403: không có quyền

### 3.3 Schema gợi ý (Postgres)

```sql
CREATE TABLE pages (
  slug VARCHAR(64) PRIMARY KEY,
  content JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Hoặc MongoDB:
```js
{ _id: "trang-chu", content: { ... }, updatedAt: ISODate("...") }
```

### 3.4 Seed dữ liệu lần đầu

Đọc 8 file `default-content/*.json` từ repo FE và `INSERT` vào DB. Nếu không seed, lần đầu FE sẽ render từ JSON fallback (vẫn hoạt động bình thường).

### 3.5 Validation

BE **không** cần validate sâu vào shape của `content` — mỗi trang có schema khác nhau và do FE quản lý. BE chỉ:
- Validate `slug` ∈ danh sách 8 slug hợp lệ
- Validate `content` là JSON object hợp lệ (không null, không array ở root)

---

## 4. Uploads — Lưu ảnh trên server **(MỚI, thay Firebase)**

FE đã chuyển hoàn toàn từ Firebase Storage sang upload trực tiếp lên server BE.

### 4.1 Endpoints

#### `POST /uploads`
**Auth**: Admin

**Body**: `multipart/form-data`
- `file` (File, required): ảnh cần upload
- `folder` (string, optional): thư mục con để phân loại

**Response 200**:
```json
{ "data": { "url": "https://api.example.com/uploads/pages/trang-chu/2026/05/1714839000-hero.jpg" } }
```

`url` phải là URL truy cập được trực tiếp từ browser (absolute URL hoặc path tuyệt đối được serve bởi BE).

#### `DELETE /uploads`
**Auth**: Admin

**Body**:
```json
{ "urls": ["https://api.example.com/uploads/.../hero.jpg", "..."] }
```

**Response 204** (no content).

URL không tồn tại → bỏ qua, không lỗi.

### 4.2 Yêu cầu kỹ thuật

- **Lưu trữ**: filesystem local (`/var/app/uploads/<folder>/<yyyy>/<mm>/<filename>`) hoặc S3/MinIO/R2.
- **Tên file**: thêm timestamp + UUID hoặc hash để tránh trùng. VD: `1714839000-a3f2b1-original.jpg`.
- **Giới hạn**:
  - MIME type: `image/*` (jpg, jpeg, png, webp, gif)
  - Kích thước: ≤ 10MB/file
  - Trả 400 nếu vượt
- **Static file serving**: cấu hình Nginx hoặc Express static serve thư mục `/uploads/**`. Nếu dùng S3, cấu hình bucket public read.

### 4.3 `folder` thường gặp từ FE

| Folder | Dùng ở đâu |
| --- | --- |
| `posts` | Tạo/sửa bài viết |
| `projects` | Tạo/sửa dự án |
| `pages/trang-chu` | Hero, why-choose-us trang chủ |
| `pages/trang-chu/hot-products` | Sản phẩm hot |
| `pages/trang-chu/services` | Dịch vụ trên trang chủ |
| `pages/trang-chu/panel-samples` | Mẫu ván |
| `pages/trang-chu/customer-products` | Sản phẩm khách hàng |
| `pages/gioi-thieu` | Hero, story, facility |
| `pages/gioi-thieu/machinery` | Máy móc |
| `pages/dich-vu` | Hero |
| `pages/dich-vu/services` | Ảnh từng dịch vụ |
| `pages/gia-cong` | Hero |
| `pages/san-pham` | Hero |
| `pages/tin-tuc` | Hero |
| `pages/lien-he` | Hero |

BE không cần whitelist folder — chấp nhận mọi string (sanitize path traversal: chặn `..`, `/`, ký tự đặc biệt).

---

## 5. Posts — Bài viết (đã có)

### `GET /posts`
**Auth**: Public

**Query**: `PageNumber=1&PageSize=5&CategoryName=Tin tức`

**Response 200**:
```json
{
  "data": [
    {
      "postId": "p1",
      "title": "...",
      "description": "<p>HTML từ rich text editor</p>",
      "categoryId": "cat-123",
      "categoryName": "Tin tức",
      "images": ["https://.../1.jpg"],
      "createDate": "2026-04-12",
      "type": "Post"
    }
  ],
  "totalPages": 10,
  "pageNumber": 1,
  "pageSize": 5
}
```

### `GET /posts/:id`
**Auth**: Public — trả về 1 bài.

### `POST /posts`
**Auth**: Admin

**Body**:
```json
{
  "title": "string",
  "description": "<p>HTML</p>",
  "categoryId": "string",
  "images": ["url1", "url2"],
  "type": "Post"
}
```

### `PUT /posts/:id`
**Auth**: Admin — body giống `POST`.

### `DELETE /posts/:id`
**Auth**: Admin.

> Lưu ý: `description` là HTML từ rich text editor (react-quill-new). BE không cần parse, chỉ lưu nguyên text. Cân nhắc sanitize XSS nếu render lại từ user lạ — ở đây editor chỉ admin dùng nên rủi ro thấp.

---

## 6. Projects — Dự án / Sản phẩm

FE hiện tại trong `services/project.js` cũng gọi `/posts` với field `type="Project"` để tách bài viết và dự án.

**Đề xuất giữ chung 1 collection `/posts`** với field `type ∈ {"Post", "Project"}`, lọc khi list:
- `GET /posts?type=Post` → bài viết
- `GET /posts?type=Project` → dự án

Hoặc tách hẳn `/projects` riêng nếu BE muốn — frontend đã abstract, đổi service không khó.

---

## 7. Categories

### `GET /categories?type=Post` hoặc `?type=Project`
**Auth**: Public

**Response 200** — cây danh mục 4 cấp (FE dùng cấp 2/3/4, cấp 1 là root):
```json
{
  "data": [
    {
      "categoryId": "root",
      "name": "Bài viết",
      "children": [
        {
          "categoryId": "cat-news",
          "name": "Tin tức",
          "children": [
            { "categoryId": "cat-news-2026", "name": "Năm 2026", "children": [] }
          ]
        }
      ]
    }
  ]
}
```

---

## 8. Tóm tắt endpoints

| Method | Path | Auth | Mô tả |
| --- | --- | --- | --- |
| POST | `/authentication/login` | Public | Đăng nhập |
| GET | `/pages/:slug` | Public | Lấy nội dung trang |
| PUT | `/pages/:slug` | Admin | Cập nhật trang |
| POST | `/uploads` | Admin | Upload ảnh (multipart) |
| DELETE | `/uploads` | Admin | Xoá ảnh |
| GET | `/posts` | Public | List bài viết / dự án (filter theo type) |
| GET | `/posts/:id` | Public | Chi tiết |
| POST | `/posts` | Admin | Tạo |
| PUT | `/posts/:id` | Admin | Sửa |
| DELETE | `/posts/:id` | Admin | Xoá |
| GET | `/categories` | Public | Cây danh mục |

---

## 9. Thứ tự ưu tiên triển khai

1. **Authentication** — chặn admin endpoints
2. **Uploads** — 4 component (Create/EditPost, Create/EditProject) + tất cả editor đang chờ
3. **Pages** — unblock toàn bộ tính năng "Chỉnh sửa UI"
4. **Posts / Categories** — CRUD chuẩn nếu chưa có

---

## 10. Tham chiếu code phía Frontend

- `services/api.js` — axios instance + interceptor gắn Bearer token
- `services/authentication.js` — login
- `services/page.js` — `getPage` / `updatePage` / `revalidatePage`
- `lib/server/page.js` — server-side fetch với cache + revalidate tags
- `services/upload.js` — `uploadImage` / `deleteImages`
- `services/post.js` — CRUD bài viết
- `services/project.js` — CRUD dự án
- `services/category.js` — list danh mục
- `default-content/*.json` — schema reference cho từng trang

---

## 11. Môi trường

`.env.local` của frontend:
```
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_USE_MOCK=false
```

Khi muốn chạy FE độc lập (BE chưa có):
```
NEXT_PUBLIC_USE_MOCK=true
```
Mock mode tự động bypass mọi gọi API và dùng JSON local + in-memory store.
