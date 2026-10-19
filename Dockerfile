# PokéSurvivor — web tĩnh phục vụ bằng nginx.
# Dùng cho Dokploy với Build Type = "Dockerfile" (Dockerfile Path: Dockerfile, Context: .).
# Cũng chạy được trên bất kỳ host nào có Docker:
#   docker build -t pokesurvivor .
#   docker run -p 8080:80 pokesurvivor
#
# Chỉ copy những gì cần publish. dev.html, tools/, docs/, tests/ và các file .md
# bị loại ra ngoài (xem .dockerignore): như vậy không lộ code chưa obfuscate
# và các công cụ nội bộ.
FROM nginx:1.27-alpine

# Nén (gzip), cache, trang 404 và header riêng.
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

# Trang chính và các file ở thư mục gốc.
COPY index.html 404.html robots.txt sitemap.xml manifest.webmanifest sw.js version.json ./

# Game (app.min.js + locales đã đóng gói) và stylesheet.
COPY css ./css
COPY js ./js
COPY assets ./assets

# Các trang SEO (tiếng Tây Ban Nha và tiếng Anh) và các mục còn lại.
COPY apoyar ./apoyar
COPY contacto ./contacto
COPY en ./en
COPY guia ./guia
COPY legendarios ./legendarios
COPY logros ./logros
COPY movimientos ./movimientos
COPY novedades ./novedades
COPY objetos ./objetos
COPY pokedex ./pokedex
COPY shinies ./shinies
COPY tipos ./tipos

EXPOSE 80
