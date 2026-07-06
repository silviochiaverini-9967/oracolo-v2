#!/bin/bash
# Deploy v2: build + copia in /var/www/oracolo_v2 (NON tocca /var/www/oracolo).
set -euo pipefail
npm run build
mkdir -p /var/www/oracolo_v2
cp -r dist/* /var/www/oracolo_v2/
echo "✅ v2 deployato in /var/www/oracolo_v2"
