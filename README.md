# Belajar Mandiri Backend API

Backend untuk media pembelajaran interaktif "Belajar Mandiri". Dibuat menggunakan Node.js, Express.js, PostgreSQL, dan diwadahi dengan Docker.

## Persyaratan
- [Docker](https://www.docker.com/) dan [Docker Compose](https://docs.docker.com/compose/) harus sudah terinstal pada komputer Anda.

## Struktur Project Modular
Backend ini mengikuti praktik terbaik (*best practice*) dengan arsitektur modular:
- `docker/`: Berisi SQL script untuk inisialisasi database.
- `src/config/`: Konfigurasi database pool.
- `src/controllers/`: Logika bisnis dari request dan response API.
- `src/models/`: Encapsulation query SQL database.
- `src/routes/`: Router API Express.js.
- `src/services/`: Logika analisis otomatis rekomendasi belajar anak (*assessment rules*).
- `src/middlewares/`: Global error handling dan validator data input.
- `src/utils/`: Standardisasi format response API.

---

## Cara Menjalankan Backend & Database

1. Buka terminal Anda pada folder `PROTOTYPE/backend`.
2. Jalankan perintah berikut untuk mengunduh image, melakukan build container, dan menjalankan server secara *background* (detached mode):
   ```bash
   docker-compose up --build -d
   ```
3. Docker Compose akan menginisialisasi dua kontainer:
   - `belajar_mandiri_db`: Menjalankan database PostgreSQL (port `5432` terpetakan ke host).
   - `belajar_mandiri_backend`: Menjalankan server Express.js di port `5000`.

4. Untuk memantau log aktivitas server secara realtime, jalankan perintah:
   ```bash
   docker-compose logs -f
   ```

5. Untuk mematikan server dan database, jalankan:
   ```bash
   docker-compose down
   ```

---

## Skema Database Relasional

Skema database terbuat otomatis saat database dijalankan pertama kali melalui file `docker/init.sql`:

1. **Tabel `user`**:
   - `user_id` (UUID, Primary Key)
   - `name` (VARCHAR, Nullable)
   - `created_at` (TIMESTAMP)

2. **Tabel `log_game`**:
   - `log_id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key → `user.user_id`)
   - `response_time` (INTEGER, waktu pengerjaan game dalam detik)
   - `wrong_answer_count` (INTEGER, jumlah jawaban salah)
   - `hint_count` (INTEGER, jumlah klik bantuan suara/tts)
   - `played_at` (TIMESTAMP)

3. **Tabel `analytical_results`**:
   - `analytic_id` (UUID, Primary Key)
   - `log_id` (UUID, Foreign Key → `log_game.log_id`)
   - `pattern_found` (TEXT, pola belajar teridentifikasi)
   - `recommendation` (TEXT, rekomendasi belajar hasil evaluasi)
   - `analyzed_at` (TIMESTAMP)

---

## Dokumentasi REST API

### 1. Health Check
* **Endpoint**: `GET /api`
* **Response**:
  ```json
  {
    "status": "success",
    "message": "Welcome to Belajar Mandiri API. System is up and running!",
    "timestamp": "2026-07-04T14:00:00.000Z"
  }
  ```

### 2. User API
* **Registrasi / Buat User Baru**: `POST /api/users`
  * Body: `{"name": "Anak Budi"}`
  * Response: `{ "status": "success", "data": { "user_id": "...", "name": "Anak Budi", "created_at": "..." } }`
* **Ambil Semua User**: `GET /api/users`
* **Ambil Detail User**: `GET /api/users/:user_id`
* **Edit Nama User**: `PUT /api/users/:user_id`
  * Body: `{"name": "Anak Budi Baru"}`
* **Hapus User**: `DELETE /api/users/:user_id`

### 3. Log Game & Analisis API
Setiap kali log game dibuat (`POST /api/logs`), sistem backend akan otomatis memicu analisis rekomendasi belajar anak berdasarkan data waktu respon, salah menjawab, dan bantuan yang digunakan. Hasil analisis tersebut otomatis disimpan ke tabel `analytical_results`.

* **Simpan Log Game**: `POST /api/logs`
  * Body:
    ```json
    {
      "user_id": "UUID-PENGGUNA",
      "response_time": 45,
      "wrong_answer_count": 1,
      "hint_count": 2
    }
    ```
  * Response:
    ```json
    {
      "status": "success",
      "data": {
        "log": {
          "log_id": "...",
          "user_id": "...",
          "response_time": 45,
          "wrong_answer_count": 1,
          "hint_count": 2,
          "played_at": "..."
        },
        "analysis": {
          "analytic_id": "...",
          "log_id": "...",
          "pattern_found": "Memahami Sebagian Materi",
          "recommendation": "Bagus! Kamu sudah memahami sebagian besar materi dengan baik. Sedikit latihan lagi kamu pasti bisa meraih skor sempurna!",
          "analyzed_at": "..."
        }
      }
    }
    ```
* **Ambil Riwayat Log Game User**: `GET /api/logs/user/:user_id`
* **Ambil Seluruh Hasil Analisis & Rekomendasi Belajar User**: `GET /api/analytics/user/:user_id`
  * Response berisi data gabungan analisis dan data log game pendukungnya secara historis untuk mempermudah visualisasi di halaman Laporan/Prestasi.
