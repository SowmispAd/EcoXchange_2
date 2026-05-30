const mongoose = require("mongoose");

const platformSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, required: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
);

const PlatformSettings = mongoose.model("PlatformSettings", platformSettingsSchema);

async function getSetting(key, fallback) {
  const row = await PlatformSettings.findOne({ key });
  return row ? row.value : fallback;
}

async function setSetting(key, value) {
  return PlatformSettings.findOneAndUpdate(
    { key },
    { value },
    { upsert: true, new: true },
  );
}

module.exports = { PlatformSettings, getSetting, setSetting };
