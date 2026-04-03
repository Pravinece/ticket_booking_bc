import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bus_id: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
  journey_date: { type: Date, required: true },
  total_seats: { type: Number, required: true },
  total_amount: { type: Number, required: true },
  payment_status: { type: String, default: "pending" },
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema);