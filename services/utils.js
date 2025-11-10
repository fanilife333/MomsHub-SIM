// services/utils.js
const fs = require("fs").promises;
const path = require("path");
// Path ke file config.json (satu tingkat di atas services/)
const configPath = path.resolve(__dirname, "../config/config.json");

/**
 * Membuka file konfigurasi, memperbarui satu key, dan menyimpan kembali file tersebut.
 */
async function saveConfig(key, value) {
  try {
    // 1. Baca File Konfigurasi Saat Ini
    const configRaw = await fs.readFile(configPath, "utf8");
    let config = JSON.parse(configRaw);

    // 2. Perbarui Nilai
    config[key] = value;

    // 3. Tulis Kembali File ke Disk
    await fs.writeFile(configPath, JSON.stringify(config, null, 2), "utf8");

    console.log(`\n💾 Config updated: ${key} = ${value}`);
    return true;
  } catch (error) {
    console.error(`❌ GAGAL menyimpan konfigurasi ${key}:`, error.message);
    return false;
  }
}

module.exports = {
  saveConfig,
};
