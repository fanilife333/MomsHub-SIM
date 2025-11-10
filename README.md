# MomsHub SIM - SATUSEHAT FHIR R4 Integration

Proyek ini berisi implementasi _backend logic_ untuk integrasi sistem RME MomsHub SIM dengan platform SATUSEHAT menggunakan standar FHIR R4.
Alur utama yang diimplementasikan mencakup 11 resource kebidanan, lengkap dengan logika _chaining_ ID dan _mocking_ lokal untuk pengujian independen.

## Persiapan Proyek

1.  **Dependencies:** Pastikan Node.js terinstal. Instal library yang diperlukan:
    ```bash
    npm install express node-fetch@2 body-parser
    ```
2.  **Konfigurasi Kredensial:**
    File `config/config.json` **TIDAK TERMASUK** dalam repositori (terdapat dalam `.gitignore` karena berisi rahasia). Anda harus membuatnya secara manual.

    Buat file `config/config.json` dengan struktur berikut:

    ```json
    {
      "client_id": "[ISI CLIENT ID ANDA]",
      "client_secret": "[ISI CLIENT SECRET ANDA]",
      "organization_id_portal": "[UUID ID PORTAL FASYANKES]",
      "organization_id_fhir": "",
      "IS_MOCK_ENABLED": true,
      "SATUSEHAT_AUTH_BASE": "[https://api-satusehat-stg.dto.kemkes.go.id/oauth2/v1](https://api-satusehat-stg.dto.kemkes.go.id/oauth2/v1)",
      "MOCK_BASE_URL": "http://localhost:8080/mock",
      "fhir_base_url": "[https://api-satusehat-stg.dto.kemkes.go.id/fhir-r4/v1](https://api-satusehat-stg.dto.kemkes.go.id/fhir-r4/v1)"
    }
    ```

## Panduan Pengujian (Mocking Lokal)

Untuk menguji seluruh alur _chaining_ ID tanpa bergantung pada Sandbox SATUSEHAT yang mungkin sedang mengalami gangguan:

1.  **Jalankan Mocking Server:** Buka terminal pertama di _root folder_ dan jalankan server palsu.

    ```bash
    node mockServer.js
    # Pastikan server berjalan di port 8080
    ```

2.  **Jalankan Alur Utama:** Buka terminal kedua dan jalankan alur _backend_ yang akan mengirimkan 11 POST request secara otomatis ke Mocking Server.
    ```bash
    node index.js
    ```

**Hasil yang Diharapkan:**

- Konsol akan menunjukkan 11 POST request sukses (Status 201 Created).
- ID fiktif (`mock-organization-...`) akan dikembalikan dan digunakan untuk _chaining_ di _resource_ berikutnya.
- File `config/config.json` akan diperbarui dengan ID Organisasi fiktif.

## Transisi ke SATUSEHAT Sandbox

Setelah kredensial Sandbox diterima dan diyakini aktif:

1.  Hentikan `mockServer.js`.
2.  Ubah `config/config.json`:
    - Set **`"IS_MOCK_ENABLED": false`**
    - Kosongkan **`"organization_id_fhir": ""`** (untuk memicu POST Organization pertama ke server asli).
3.  Jalankan alur utama di Terminal 2: `node index.js`.

---

Sekarang Anda bisa menambahkan, _commit_, dan _push_ file `README.md` ini ke GitHub!

```bash
git add README.md
git commit -m "Add README file with project documentation and usage guide"
git push
```
