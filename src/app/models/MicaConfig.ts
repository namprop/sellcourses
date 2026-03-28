import mongoose from "mongoose";

const micaConfigSchema = new mongoose.Schema({
  defaultPrice60: { type: Number, default: 150000 },
  defaultPrice80: { type: Number, default: 200000 },
});

export default mongoose.models.MicaConfig || mongoose.model("MicaConfig", micaConfigSchema);
