#!/usr/bin/env bash
# 一起数数后端 · 第一步：安装 Node LTS（不依赖宝塔面板的 Node 管理器）
# 装到 /usr/local/lib/nodejs，软链进 /usr/local/bin，与宝塔 /www/server/nodejs 互不干扰
set -euo pipefail

VER="${NODE_VER:-v24.12.0}"
MIRROR="https://cdn.npmmirror.com/binaries/node"
PKG="node-${VER}-linux-x64"
DIR="/usr/local/lib/nodejs/${PKG}"

if [ -x "${DIR}/bin/node" ]; then
  echo "already installed: ${DIR}"
else
  cd /tmp
  echo "[1/4] download ${PKG}.tar.xz"
  curl -fsSL -o "${PKG}.tar.xz" "${MIRROR}/${VER}/${PKG}.tar.xz"
  echo "[2/4] verify sha256"
  curl -fsSL -o SHASUMS256.txt "${MIRROR}/${VER}/SHASUMS256.txt"
  grep " ${PKG}.tar.xz\$" SHASUMS256.txt > sum.txt
  sha256sum -c sum.txt
  echo "[3/4] extract"
  mkdir -p /usr/local/lib/nodejs
  tar -xJf "${PKG}.tar.xz" -C /usr/local/lib/nodejs
  rm -f "${PKG}.tar.xz" SHASUMS256.txt sum.txt
fi

echo "[4/4] link into PATH"
ln -sf "${DIR}/bin/node" /usr/local/bin/node
ln -sf "${DIR}/bin/npm"  /usr/local/bin/npm
ln -sf "${DIR}/bin/npx"  /usr/local/bin/npx
ln -sf "${DIR}/bin/corepack" /usr/local/bin/corepack 2>/dev/null || true

node -v
echo "--- node:sqlite availability ---"
if node -e "const {DatabaseSync}=require('node:sqlite'); new DatabaseSync(':memory:'); console.log('sqlite: OK without flag')"; then
  echo "SQLITE_FLAG="
elif node --experimental-sqlite -e "const {DatabaseSync}=require('node:sqlite'); new DatabaseSync(':memory:'); console.log('sqlite: OK with --experimental-sqlite')"; then
  echo "SQLITE_FLAG=--experimental-sqlite"
else
  echo "sqlite: UNAVAILABLE — need Node >= 22.5"
  exit 1
fi
