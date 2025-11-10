// services/fhirConnector.js
const fetch = require("node-fetch");
const config = require("../config/config.json");
// Import saveConfig dari modul utilitas, setelah kita membuatnya
const { saveConfig } = require("./utils");

// ======================================
// FUNGSI 1: PENENTUAN BASE URL
// ======================================
function getBaseUrl(type = "fhir") {
  if (config.IS_MOCK_ENABLED) {
    // Jika Mocking aktif, gunakan URL Mock
    if (type === "auth") {
      return `${config.MOCK_BASE_URL}/oauth2/v1`;
    }
    return `${config.MOCK_BASE_URL}/fhir-r4/v1`;
  }
  // Jika Mocking tidak aktif, gunakan URL Asli
  if (type === "auth") {
    return config.SATUSEHAT_AUTH_BASE;
  }
  return config.fhir_base_url;
}

// ======================================
// FUNGSI 2: POST RESOURCE FHIR
// ======================================
async function postFhirResource(resourceName, payload, accessToken) {
  const url = `${getBaseUrl("fhir")}/${resourceName}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.status === 201) {
      const fhirId = data.id;

      // Logika Penyimpanan ID (Chaining)
      if (resourceName === "Organization") {
        await saveConfig("organization_id_fhir", fhirId);
      }
      // Tambahkan logika penyimpanan ID untuk resource lain jika perlu (misal: last_patient_id)

      console.log(`✅ POST ${resourceName} sukses. ID: ${fhirId}`);
      return fhirId;
    } else {
      console.error(
        `❌ POST ${resourceName} GAGAL. Status: ${response.status}`,
        data
      );
      return null;
    }
  } catch (error) {
    console.error(`❌ Kesalahan koneksi saat POST ${resourceName}:`, error);
    return null;
  }
}

// Export kedua fungsi agar bisa digunakan oleh modul lain
module.exports = {
  getBaseUrl,
  postFhirResource,
};
