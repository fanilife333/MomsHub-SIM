// index.js (Modifikasi untuk Chaining ID)
const { getAccessToken } = require("./services/tokenService");
const { postFhirResource } = require("./services/fhirConnector");

// Import semua 11 payload (pastikan sudah ada di folder fhir-models)
const orgPayload = require("./fhir-models/organization/organization-rsia.fhir.json");
const pracPayload = require("./fhir-models/practitioner/practitioner-bidan-retno.fhir.json");
const locPayload = require("./fhir-models/location/location-poli-kia.fhir.json");
const patientPayload = require("./fhir-models/patient/patient-siti-aminah.fhir.json");
const encounterPayload = require("./fhir-models/encounter/encounter-ANC-siti.fhir.json");
const conditionPayload = require("./fhir-models/condition/condition-ANC-siti.fhir.json");

// --- OBSERVATION & LAB PAYLOADS ---
const obsTTVPayload = require("./fhir-models/observation/observation-ANC-vitalsign-siti.fhir.json");
const obsTFU_DJJPayload = require("./fhir-models/observation/observation-ANC-tfu-djj-siti.fhir.json");
const obsHbPayload = require("./fhir-models/observation/observation-ANC-lab-hb-siti.fhir.json");

// --- SERVICE & REPORT PAYLOADS ---
const serviceReqPayload = require("./fhir-models/service-request/servicerequest-ANC-lab-hb-siti.fhir.json");
const diagReportPayload = require("./fhir-models/diagnostic-report/diagnosticreport-ANC-usg-siti.fhir.json");

async function runFhirFlow() {
  console.log("=======================================");
  console.log("=== STARTING FHIR MOCKING FLOW (11 RESOURCES) ===");
  console.log("=======================================");

  // 1. Dapatkan Access Token
  const accessToken = await getAccessToken();
  if (!accessToken) return;

  // Variabel untuk menyimpan semua ID fiktif
  let IDs = {};

  // ======================================
  // LANGKAH 1: PRASYARAT
  // ======================================
  // 1a. POST Organization
  IDs.orgId = await postFhirResource("Organization", orgPayload, accessToken);
  if (!IDs.orgId) return;

  // 1b. POST Practitioner
  IDs.pracId = await postFhirResource("Practitioner", pracPayload, accessToken);
  if (!IDs.pracId) return;

  // 1c. POST Location (Membutuhkan ID Organization)
  let locationPayload = JSON.parse(JSON.stringify(locPayload));
  locationPayload.managingOrganization.reference = `Organization/${IDs.orgId}`;
  IDs.locId = await postFhirResource("Location", locationPayload, accessToken);
  if (!IDs.locId) return;

  console.log("\n--- PRASYARAT LENGKAP ---\n");

  // ======================================
  // LANGKAH 2: PASIEN & KUNJUNGAN (Patient & Encounter)
  // ======================================
  // 2a. POST Patient
  IDs.patientId = await postFhirResource(
    "Patient",
    patientPayload,
    accessToken
  );
  if (!IDs.patientId) return;

  // 2b. POST Encounter (Membutuhkan Patient, Location, Organization ID)
  let encPayload = JSON.parse(JSON.stringify(encounterPayload));
  encPayload.subject.reference = `Patient/${IDs.patientId}`;
  encPayload.location[0].location.reference = `Location/${IDs.locId}`;
  encPayload.serviceProvider.reference = `Organization/${IDs.orgId}`;
  IDs.encId = await postFhirResource("Encounter", encPayload, accessToken);
  if (!IDs.encId) return;

  console.log("\n--- PASIEN & KUNJUNGAN LENGKAP ---\n");

  // ======================================
  // LANGKAH 3: LAYANAN KLINIS & REPORT
  // ======================================
  // 3a. POST ServiceRequest (Permintaan Lab Hb)
  let srvReqPayload = JSON.parse(JSON.stringify(serviceReqPayload));
  srvReqPayload.subject.reference = `Patient/${IDs.patientId}`;
  srvReqPayload.encounter.reference = `Encounter/${IDs.encId}`;
  srvReqPayload.requester.reference = `Practitioner/${IDs.pracId}`;
  IDs.srvReqId = await postFhirResource(
    "ServiceRequest",
    srvReqPayload,
    accessToken
  );
  if (!IDs.srvReqId) return;

  // 3b. POST Condition (Diagnosis - Kehamilan Normal)
  let condPayload = JSON.parse(JSON.stringify(conditionPayload));
  condPayload.subject.reference = `Patient/${IDs.patientId}`;
  condPayload.encounter.reference = `Encounter/${IDs.encId}`;
  IDs.condId = await postFhirResource("Condition", condPayload, accessToken);
  if (!IDs.condId) return;

  // ======================================
  // LANGKAH 4: OBSERVATION (Pengukuran)
  // ======================================
  // 4a. POST Observation (TTV Lengkap)
  let obsTTV = JSON.parse(JSON.stringify(obsTTVPayload));
  obsTTV.subject.reference = `Patient/${IDs.patientId}`;
  obsTTV.encounter.reference = `Encounter/${IDs.encId}`;
  obsTTV.performer[0].reference = `Practitioner/${IDs.pracId}`;
  await postFhirResource("Observation", obsTTV, accessToken);

  // 4b. POST Observation (TFU & DJJ)
  let obsTFU_DJJ = JSON.parse(JSON.stringify(obsTFU_DJJPayload));
  obsTFU_DJJ.subject.reference = `Patient/${IDs.patientId}`;
  obsTFU_DJJ.encounter.reference = `Encounter/${IDs.encId}`;
  obsTFU_DJJ.performer[0].reference = `Practitioner/${IDs.pracId}`;
  IDs.obsTFU_DJJ_Id = await postFhirResource(
    "Observation",
    obsTFU_DJJ,
    accessToken
  ); // Simpan ID ini untuk DiagnosticReport

  // 4c. POST Observation (Hasil Lab Hb)
  let obsHb = JSON.parse(JSON.stringify(obsHbPayload));
  obsHb.subject.reference = `Patient/${IDs.patientId}`;
  obsHb.encounter.reference = `Encounter/${IDs.encId}`;
  obsHb.performer[0].reference = `Practitioner/${IDs.pracId}`;
  obsHb.basedOn[0].reference = `ServiceRequest/${IDs.srvReqId}`; // Hubungkan ke ServiceRequest
  await postFhirResource("Observation", obsHb, accessToken);

  // 4d. POST DiagnosticReport (Ringkasan USG)
  let diagReport = JSON.parse(JSON.stringify(diagReportPayload));
  diagReport.subject.reference = `Patient/${IDs.patientId}`;
  diagReport.encounter.reference = `Encounter/${IDs.encId}`;
  diagReport.performer[0].reference = `Practitioner/${IDs.pracId}`;
  diagReport.result[0].reference = `Observation/${IDs.obsTFU_DJJ_Id}`; // Rujuk ke Observation TFU/DJJ
  await postFhirResource("DiagnosticReport", diagReport, accessToken);

  console.log("=======================================");
  console.log("=== 11 RESOURCE MOCKING FLOW COMPLETE! 🎉 ===");
  console.log("=== Backend Logic Anda Sudah Teruji. ===");
  console.log("=======================================");
}

runFhirFlow();
