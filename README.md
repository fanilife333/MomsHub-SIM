# MomsHub SIM - SATUSEHAT FHIR R4 Connector

Proyek ini berisi _backend logic_ berbasis Node.js untuk integrasi sistem RME MomsHub SIM dengan platform SATUSEHAT. Implementasi ini berfokus pada alur _chaining_ ID yang benar untuk **11 Resource Kebidanan** sesuai standar FHIR R4.

## 1. Persiapan Lingkungan

### 1.1. Dependencies

Pastikan Node.js terinstal. Instal _library_ yang dibutuhkan di _root folder_:

```bash
npm install express node-fetch@2 body-parser
```

### 1.2. Konfigurasi Kredensial

File `config/config.json` **dikecualikan** dari repositori. File ini secara manual dan diisi dengan kredensial Sandbox serta mengatur _flag_ `IS_MOCK_ENABLED` sesuai kebutuhan.

## 2\. Prosedur Uji Coba Lokal (Mocking)

Untuk pengujian _logic_ alur data tanpa koneksi ke SATUSEHAT:

1.  Ubah `"IS_MOCK_ENABLED": true` di `config/config.json`.
2.  Jalankan _Mocking Server_ di terminal pertama:
    ```bash
    node mockServer.js
    ```
3.  Jalankan Alur Data utama di terminal kedua:
    ```bash
    node index.js
    ```
    _Verifikasi:_ Output konsol akan menunjukkan 11 POST request sukses dengan ID fiktif, memvalidasi _chaining logic_.

## 3\. Transisi ke Sandbox SATUSEHAT

1.  Hentikan `mockServer.js`.
2.  Ubah `"IS_MOCK_ENABLED": false` di `config/config.json`.
3.  Pastikan kredensial Sandbox sudah aktif dan terisi.
4.  Jalankan alur utama:
    ```bash
    node index.js
    ```

<!-- end list -->

```


```
