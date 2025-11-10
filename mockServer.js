const express = require("express");
const bodyParser = require("body-parser"); // Untuk membaca request body
const app = express();
const PORT = 8080; // Port yang disepakati untuk mocking

// Middleware untuk mem-parsing JSON body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ===============================================
// 1. MOCK ENDPOINT OTENTIKASI (TOKEN)
// POST http://localhost:8080/mock/oauth2/v1/accesstoken
// ===============================================
app.post("/mock/oauth2/v1/accesstoken", (req, res) => {
  console.log("--- Mocking: Token Request Received ---");
  console.log("Client ID:", req.body.client_id);

  // Selalu kirim respons sukses 200 OK dengan Token Fiktif
  res.status(200).json({
    access_token: "MOCK-TOKEN-SUCCESS-2025-KEBIDANAN-PROJECT",
    expires_in: 3600,
    token_type: "Bearer",
  });
});

// ===============================================
// 2. MOCK ENDPOINT FHIR (RESOURCE POST)
// POST http://localhost:8080/mock/fhir-r4/v1/[ResourceName]
// ===============================================
app.post("/mock/fhir-r4/v1/:resourceName", (req, res) => {
  const resourceType = req.params.resourceName;
  const mockId = `mock-${resourceType.toLowerCase()}-${Date.now()}`; // ID Fiktif Unik

  console.log(`--- Mocking: POST ${resourceType} Received ---`);
  console.log("Body Size:", JSON.stringify(req.body).length, "bytes");

  // Simulasikan respons 201 Created dan kembalikan ID fiktif
  res.status(201).json({
    resourceType: resourceType,
    id: mockId, // <-- ID fiktif yang akan dipakai backend utama
    meta: {
      versionId: "1",
      lastUpdated: new Date().toISOString(),
    },
    // Anda bisa menyisipkan kembali data yang di-post di sini jika perlu
  });
});

// ===============================================
// Mulai Server
// ===============================================
app.listen(PORT, () => {
  console.log(`\n✅ MOCKING SERVER BERJALAN di http://localhost:${PORT}`);
  console.log("Siap menerima request dari backend utama Anda.");
});
