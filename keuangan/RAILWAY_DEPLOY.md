# Deploy Laravel ke Railway

## Kenapa error `railpack process exited` sering terjadi

Biasanya karena auto build steps tidak cocok dengan stack Laravel + PNPM.
Project ini sekarang sudah dipaksa pakai command build/start yang jelas lewat `railway.json`.

## Langkah setup di Railway

1. Buat project baru dari repository ini.
2. Tambah service database internal dan namai `MySQL`.
3. Pastikan web service memakai file `railway.json` dari repo (default akan terbaca otomatis).
4. Di service web, buka `Variables` lalu paste isi ini:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://<domain-railway-kamu>
APP_KEY=<hasil dari php artisan key:generate --show>
DB_CONNECTION=mysql
DB_URL=${{MySQL.DATABASE_URL}}
LOG_CHANNEL=stderr
CACHE_STORE=database
SESSION_DRIVER=database
QUEUE_CONNECTION=database
```

### Persis untuk MySQL internal Railway

Kalau Railway tidak menerima `DB_URL`, isi manual pakai field ini:

- `DB_HOST=<MYSQLHOST>`
- `DB_PORT=<MYSQLPORT>`
- `DB_DATABASE=<MYSQLDATABASE>`
- `DB_USERNAME=<MYSQLUSER>`
- `DB_PASSWORD=<MYSQLPASSWORD>`

Kalau kamu pakai `DB_HOST` dkk, tetap pertahankan:

- `DB_CONNECTION=mysql`

## Build & start command yang dipakai

- Build:
  - `composer install --no-dev --optimize-autoloader && corepack enable && pnpm install --no-frozen-lockfile && pnpm run build`
- Start:
  - `php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}`

## Jika masih gagal build

1. Klik `Redeploy` lalu pilih `Clear build cache`.
2. Pastikan branch terbaru sudah ter-push.
3. Cek log build paling bawah, cari error pertama (bukan error turunan).
4. Jika error terkait env, pastikan semua env di atas sudah terisi.

## Jika error port / healthcheck

- Service web wajib bind ke `0.0.0.0` dan `$PORT`.
- Konfigurasi ini sudah ditangani oleh `Procfile` dan `railway.json`.
