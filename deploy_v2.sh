#!/bin/bash
set -euo pipefail
npm run build
mkdir -p /var/www/oracolo_v2/assets
rm -rf /var/www/oracolo_v2/assets/*
cp -r dist/* /var/www/oracolo_v2/
echo "✅ v2 deployato (assets ripuliti)"
