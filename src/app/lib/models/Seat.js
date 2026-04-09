import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  bus_id: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
  seat_number: { type: Number, required: true },
  status: { type: String, default: "available" },
  passenger_name: { type: String },
  passenger_age: { type: Number },
  passenger_gender: { type: String },
  passenger_phone: { type: String },
  booked_date: { type: Date },
  booked_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  booking_id: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
}, { timestamps: true });

export default mongoose.models.Seat || mongoose.model("Seat", seatSchema);