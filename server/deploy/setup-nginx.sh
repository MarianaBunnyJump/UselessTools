#!/usr/bin/env bash
# 一起数数后端 · 第三步：Let's Encrypt 子域证书 + Nginx 反向代理（宝塔环境）
# 分两阶段：先只开放 80 端口做 ACME 校验签发证书，成功后再写入 443 反代块。
# 全程不修改 /www/server/panel/vhost/nginx/mariana66.xyz.conf（主站）
set -euo pipefail

DOMAIN="${DOMAIN:-counter.mariana66.xyz}"
VHOST="/www/server/panel/vhost/nginx/${DOMAIN}.conf"
ACME_ROOT=/www/wwwroot/counter-acme
LE_DIR=/etc/letsencrypt/live/${DOMAIN}

mkdir -p "${ACME_ROOT}/.well-known/acme-challenge"

if [ -d "${LE_DIR}" ]; then
  echo "[cert] 已存在证书，跳过签发：${LE_DIR}"
else
  echo "[cert] 阶段一：写入临时 80 端口 vhost（仅服务 ACME 挑战）"
  cat > "${VHOST}" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    location /.well-known/acme-challenge/ {
        root ${ACME_ROOT};
    }

    location / {
        return 404;
    }
}
EOF
  nginx -t
  nginx -s reload
  sleep 1

  echo "[cert] 解析自检：本机直连 ACME 文件"
  echo "probe" > "${ACME_ROOT}/.well-known/acme-challenge/probe.txt"
  curl -sS --max-time 15 "http://${DOMAIN}/.well-known/acme-challenge/probe.txt" || true
  rm -f "${ACME_ROOT}/.well-known/acme-challenge/probe.txt"

  echo "[cert] 复用服务器上已有的 Let's Encrypt 账户签发（非交互）"
  certbot certonly --webroot -w "${ACME_ROOT}" -d "${DOMAIN}" \
    --non-interactive --agree-tos
  echo "[cert] 签发完成：$(ls ${LE_DIR})"
fi

echo "[nginx] 阶段二：写入正式 443 反代 vhost"
cat > "${VHOST}" <<EOF
# ============================================================
# ${DOMAIN} — 一起数数同步后端（Node 127.0.0.1:8787 反代）
# 由部署脚本生成 · 证书: Let's Encrypt webroot
# 后端代码: /www/wwwroot/counter/index.mjs · 服务: counter.service
# ============================================================
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    location /.well-known/acme-challenge/ {
        root ${ACME_ROOT};
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name ${DOMAIN};

    ssl_certificate     ${LE_DIR}/fullchain.pem;
    ssl_certificate_key ${LE_DIR}/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    access_log /www/wwwlogs/${DOMAIN}.log;
    error_log  /www/wwwlogs/${DOMAIN}.error.log;

    # 照片上传上限 2MB，留一倍余量
    client_max_body_size 4m;

    location / {
        proxy_pass http://127.0.0.1:8787;
        proxy_http_version 1.1;
        proxy_set_header Host              \$host;
        proxy_set_header X-Real-IP         \$remote_addr;
        proxy_set_header X-Forwarded-For   \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_connect_timeout 5s;
        proxy_read_timeout    30s;
        proxy_send_timeout    30s;
    }
}
EOF

nginx -t
nginx -s reload
echo "[nginx] reload 完成"

echo "--- 公网健康检查 ---"
curl -sS --max-time 15 "https://${DOMAIN}/api/v1/health"; echo
echo "--- 证书有效期与自动续期 ---"
openssl x509 -in "${LE_DIR}/cert.pem" -noout -enddate
systemctl list-timers 2>/dev/null | grep -i certbot || echo "NO_CERTBOT_TIMER"
crontab -l 2>/dev/null | grep -i certbot || echo "NO_CERTBOT_CRON"
