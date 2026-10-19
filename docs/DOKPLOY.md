# Deploy lên Dokploy (server riêng)

Giải pháp thay thế GitHub Pages để phục vụ `pokesurvivor.com` từ server có
[Dokploy](https://dokploy.com). Game vẫn là web tĩnh: Dokploy chỉ đóng gói các
file vào một container nginx và lo phần HTTPS.

## Các file cần thiết (đã có trong repo)

| File | Công dụng |
|---|---|
| `Dockerfile` | Chỉ copy **những gì** cần publish và phục vụ bằng nginx. |
| `.dockerignore` | Loại ra `dev.html`, `tools/`, `docs/`, `tests/`, `.git`… |
| `deploy/nginx.conf` | Nén gzip, cache đúng, `404.html` và `/pokedex` → `/pokedex/index.html`. |

> Không dùng build type **Static** với thư mục gốc của repo: nó sẽ serve cả
> `dev.html`, `tools/` và `docs/`, tức là lộ code chưa obfuscate và công cụ nội
> bộ. `Dockerfile` tránh được chuyện đó.

## 1. Trước khi deploy: tạo bản build

Dokploy chỉ serve những gì có trong repo, mà `index.html`, `js/app.min.js` và
`version.json` đều **được sinh ra**:

```
node tools/build.js && node tools/export_data.js && python tools/make_seo_pages.py
```

Sau đó commit và push (không có chữ ký của AI). Nếu quên bước build, server sẽ
publish bản cũ.

## 2. Tạo application trong Dokploy

1. **Create Application** → tên: `pokesurvivor`.
2. **General → Provider** — chọn **Git** (không cần kết nối tài khoản GitHub):
   - *Repository URL*: `https://github.com/JPTER78/pokesurvivor.git`
   - *Branch*: `main`
   - *Build Path*: `/`

   *(Cách khác, nếu muốn upload thẳng: provider **Drag and Drop .zip** — nén thư mục
   dự án thành .zip rồi tải lên. Mỗi lần cập nhật phải upload lại.)*
3. **Build Type**: **Dockerfile**
   - *Dockerfile Path*: `Dockerfile`
   - *Docker Context Path*: `.`
4. **Advanced → Ports**: không cần chỉnh gì; container lắng nghe ở cổng `80`.
5. **Deploy**.

Lần build đầu sẽ hơi lâu (khoảng 80 MB sprite: 13.000 file).

> **Tự động deploy mà không cần OAuth**: sau khi Deploy lần đầu, Dokploy hiện một
> *Webhook URL*. Vào GitHub → repo → **Settings → Webhooks → Add webhook**, dán URL
> đó, content type `application/json`, secret như Dokploy hiển thị. Chỉ là 1 webhook
> trong repo — không thêm tài khoản nào.

## 3. Domain và HTTPS

**Dokploy → Domains → Add Domain**

- `pokesurvivor.com` → port **80**, bật *HTTPS*, *Certificate Provider*:
  **Let's Encrypt**.
- Làm tương tự với `www.pokesurvivor.com` nếu muốn.

**Cloudflare (DNS của domain)**, vào `pokesurvivor.com → DNS → Records`:

- Bản ghi `A` · name `@` · content: IP của server Dokploy · **tắt Proxy**
  (nube xám, "DNS only"). Để nube cam (proxy) thì Let's Encrypt thường xác thực
  thất bại; nếu sau này muốn bật proxy thì chọn *SSL/TLS → Full (strict)* khi
  chứng chỉ trên server đã chạy.
- Bản ghi `A` (hoặc `CNAME`) · name `www` · cùng đích.

Thay đổi DNS mất từ vài phút đến vài giờ.

## 4. Firebase

Vào <https://console.firebase.google.com> → project **pokesurvival-99a53** →
**Authentication → Settings → Authorized domains**, thêm:

- `pokesurvivor.com`
- `www.pokesurvivor.com` (nếu có dùng)

Nếu không, đăng ký tài khoản và chế độ coop sẽ lỗi `auth/unauthorized-domain`.

## 5. Cập nhật game về sau

Vẫn như mọi khi:

```
node tools/build.js && node tools/export_data.js && python tools/make_seo_pages.py
git add -A
git commit -m "Nội dung đã thay đổi"
git push origin main
```

Với **Auto Deploy** đang bật (Dokploy → General → webhook GitHub), mỗi lần push
server tự build lại và publish. Người chơi vẫn nhận được thông báo cập nhật của
`js/core/updater.js`, vì `version.json` được serve với `no-store` và
`index.html` với `no-cache` (xem `deploy/nginx.conf`).

## 6. Coop bị chặn NAT: dựng TURN miễn phí trên chính VPS này

TURN **không bắt buộc**. Chỉ cần khi người chơi dùng 4G / wifi công ty và hai
máy không nối trực tiếp được (trạng thái `failed` trong phòng chơi). Vì bạn đã
có VPS, `coturn` là mã nguồn mở nên không mất phí dịch vụ — chỉ tốn băng thông.

1. **Dokploy → Create Compose** → dán nội dung `deploy/coturn/docker-compose.yml`,
   rồi vào **Environment** thêm:

   | Biến | Giá trị |
   |---|---|
   | `TURN_USER` | `pokesurvivor` |
   | `TURN_PASS` | mật khẩu dài, ngẫu nhiên (`openssl rand -base64 24`) |
   | `TURN_EXTERNAL_IP` | IP công khai của VPS |

2. Mở firewall trên VPS: `3478/udp`, `3478/tcp` và dải `49160-49200/udp`.
3. DNS (Cloudflare): bản ghi `A` tên `turn` → IP VPS, **tắt proxy**.
4. Điền `js/net/turn-config.js`:

   ```js
   G.TURN_CONFIG = {
     urls: 'turn:turn.pokesurvivor.com:3478',
     username: 'pokesurvivor',
     credential: 'MAT_KHAU_GIONG_TURN_PASS'
   };
   ```

5. Build + commit + push như mục 1 và 5.

**Lưu ý**

- Mật khẩu nằm trong bundle JS công khai, nên `docker-compose.yml` đã đặt giới
  hạn `--quota`, `--total-quota`, `--max-bps`. Đổi mật khẩu định kỳ.
- Chỉ những cặp máy **không nối trực tiếp được** mới đi qua VPS; các cặp khác
  vẫn P2P như cũ (STUN đứng trước trong danh sách ICE nên đường trực tiếp được
  ưu tiên).
- Kiểm tra nhanh: mở
  <https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/>,
  nhập `turn:turn.pokesurvivor.com:3478` + user/pass; thấy dòng `relay` là chạy.

## 7. Kiểm tra ở máy local (tuỳ chọn)

```
docker build -t pokesurvivor .
docker run --rm -p 8080:80 pokesurvivor
```

Rồi mở <http://localhost:8080>.

## Lưu ý

- **Không dùng dịch vụ trả phí**: server là của bạn (VPS cài Dokploy); không
  dùng gói trả phí của Cloudflare hay Firebase. Domain vẫn ở Cloudflare như cũ.
- `CNAME` chỉ GitHub Pages dùng: với Dokploy không cần, nhưng để cũng không sao.
- WebRTC (chế độ coop) cần HTTPS; Let's Encrypt đã lo phần đó.

