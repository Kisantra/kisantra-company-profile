#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:?Set APP_DIR, mis. APP_DIR=/path/ke/app bash deploy.sh}"
BRANCH="${BRANCH:-main}"
log() { printf '\n\033[1;36m==> %s\033[0m\n' "$*"; }

cd "$APP_DIR"

log "Menarik perubahan dari origin/$BRANCH"
git fetch origin "$BRANCH"
git merge --ff-only "origin/$BRANCH"     # ff-only: berhenti jelas jika ada perubahan lokal

log "Membersihkan cache lama (tanpa mem-boot Laravel)"
rm -f bootstrap/cache/*.php               # rm, BUKAN artisan (hindari deadlock saat vendor setengah jalan)

log "Memasang dependensi PHP"
composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

log "Membangun aset frontend"
npm ci
npm run build                             # public/build di .gitignore -> WAJIB di-build di server

log "Menyiapkan cache produksi"
php artisan optimize                      # config + route (view:cache dihindari)
php artisan filament:optimize

log "Merestart worker antrean"
php artisan queue:restart

log "Selesai: $(git rev-parse --short HEAD) $(git log -1 --format=%s)"
