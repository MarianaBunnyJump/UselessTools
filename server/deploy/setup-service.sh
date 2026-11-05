#!/usr/bin/env bash
# 一起数数后端 · 第二步：systemd 服务（监听 127.0.0.1:8787，仅 nginx 可达）
set -euo pipefail

APP_DIR=/www/wwwroot/counter
UNIT=/etc/systemd/system/counter.service

test -f "${APP_DIR}/index.mjs" || { echo "missing ${APP_DIR}/index.mjs — 先上传代码"; exit 1; }
mkdir -p "${APP_DIR}/data"

cat > "${UNIT}" <<'EOF'
[Unit]
Description=FunTools counter sync server (一起数数)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
WorkingDirectory=/www/wwwroot/counter
ExecStart=/usr/local/bin/node /www/wwwroot/counter/index.mjs
Environment=PORT=8787
Environment=HOST=127.0.0.1
Environment=DB_PATH=/www/wwwroot/counter/data/counter.db
Environment=TRUST_PROXY=1
Environment=NODE_NO_WARNINGS=1
Restart=always
RestartSec=3
LimitNOFILE=65536
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable counter >/dev/null 2>&1
systemctl restart counter
sleep 1.5
systemctl --no-pager --lines=8 status counter || true
echo "--- health via loopback ---"
curl -sS --max-time 10 http://127.0.0.1:8787/api/v1/health; echo
echo "--- listening ---"
ss -lntp | grep 8787
