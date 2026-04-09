import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
  bus_number: { type: String, required: true, unique: true },
  bus_name: { type: String, required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  capacity: { type: Number, required: true },
  fare: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Bus || mongoose.model("Bus", busSchema);