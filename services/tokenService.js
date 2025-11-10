// services/tokenService.js
const fetch = require("node-fetch");
const config = require("../config/config.json");

// Import fungsi penentu URL dari fhirConnector.js
const { getBaseUrl } = require("./fhirConnector");

/**
 * Mendapatkan Access Token dari server (Mocking atau SATUSEHAT asli).
 * @returns {string|null} Access Token atau null jika gagal.
 */
async function getAccessToken() {
  // 1. Tentukan URL Otentikasi
  const authUrl = `${getBaseUrl("auth")}/accesstoken`;

  // Siapkan body (client_id dan client_secret)
  const requestBody = new URLSearchParams();
  requestBody.append("client_id", config.client_id);
  requestBody.append("client_secret", config.client_secret);

  console.log(`\n🔑 Meminta Access Token dari: ${authUrl}`);

  try {
    const response = await fetch(authUrl, {
      method: "POST",
      headers: {
        // Content-Type harus application/x-www-form-urlencoded untuk API Token
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: requestBody,
    });

    const data = await response.json();

    if (response.status === 200) {
      console.log("✅ Access Token Diterima.");
      // Mengembalikan token (fiktif jika mocking aktif)
      return data.access_token;
    } else {
      console.error(
        `❌ Gagal mendapatkan token. Status: ${response.status}`,
        data
      );
      return null;
    }
  } catch (error) {
    console.error(
      "❌ Kesalahan koneksi saat meminta token. Pastikan Mocking Server berjalan (Port 8080)!",
      error
    );
    return null;
  }
}

// Export fungsi agar bisa digunakan di mainApp.js
module.exports = {
  getAccessToken,
};
