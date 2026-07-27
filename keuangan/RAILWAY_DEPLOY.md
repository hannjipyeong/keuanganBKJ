# Deploy Laravel ke Railway

## Kenapa error `railpack process exited` sering terjadi

Biasanya karena auto build steps tidak cocok dengan stack Laravel + PNPM.
Project ini sekarang sudah dipaksa pakai command build/start yang jelas lewat `railway.json`.

## Langkah setup di Railway

1. Buat project baru dari repository ini.
2. Tambah service `PostgreSQL` di Railway.
3. Pastikan web service memakai file `railway.json` dari repo (default akan terbaca otomatis).
4. Set environment variables berikut di service web:

- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL=https://<domain-railway-kamu>`
- `APP_KEY=<hasil php artisan key:generate --show>`
- `DB_CONNECTION=pgsql`
- `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` (dari service PostgreSQL Railway)
- `LOG_CHANNEL=stderr`
- `CACHE_STORE=database`
- `SESSION_DRIVER=database`
- `QUEUE_CONNECTION=database`

## Build & start command yang dipakai

- Build:
  - `composer install --no-dev --optimize-autoloader && corepack enable && pnpm install --frozen-lockfile && pnpm run build`
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
