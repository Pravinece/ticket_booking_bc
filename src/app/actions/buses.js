'use server'
import "@/app/lib/db";
import Bus from "@/app/lib/models/Bus";
import Seat from "@/app/lib/models/Seat";
import { getCurrentUser } from './auth';
import { redirect } from 'next/navigation';

export async function getBuses(payload) {
  try {
    const { source, destination } = payload;
    const filter = {};
    if (source) filter.source = source;
    if (destination) filter.destination = destination;

    const buses = await Bus.find(filter).lean();
    return JSON.parse(JSON.stringify(buses));
  } catch (error) {
    console.error('getBuses error:', error);
    throw new Error(`Failed to fetch buses: ${error.message}`);
  }
}

export async function createBus(formData) {
  const user = await getCurrentUser();
  if (!user) redirect('/3s/login');
  if (user.role !== 'admin') return { error: "Only admin users can create buses" };

  const bus_number = formData.get('bus_number');
  const bus_name = formData.get('bus_name');
  const source = formData.get('source');
  const destination = formData.get('destination');
  const capacity = formData.get('capacity');
  const fare = formData.get('fare');

  if (!bus_number?.trim() || !bus_name?.trim() || !source?.trim() || !destination?.trim() || !capacity || !fare) {
    return { error: "All fields are required" };
  }

  try {
    const existing = await Bus.findOne({ bus_number });
    if (existing) return { error: "Bus number already exists" };

    const bus = await Bus.create({ bus_number, bus_name, source, destination, capacity, fare });
    return { success: true, bus: JSON.parse(JSON.stringify(bus)) };
  } catch (error) {
    return { error: "Internal Server Error" };
  }
}

export async function getBusSeats(payload) {
  let { busId, date } = payload;
  if (!busId || !date) throw new Error("Bus ID and date are required");

  try {
    const bus = await Bus.findById(busId).lean();
    if (!bus) throw new Error("No bus found");

    const seats = await Seat.find({ bus_id: busId, booked_date: date }).lean();

    const existingSeatNumbers = seats.map(s => s.seat_number);
    const allSeats = Array.from({ length: bus.capacity }, (_, i) => {
      const seatNumber = i + 1;
      return {
        seat_number: seatNumber,
        status: existingSeatNumbers.includes(seatNumber) ? 'booked' : 'open'
      };
    });

    return { bus: JSON.parse(JSON.stringify(bus)), seats: allSeats };
  } catch (error) {
    console.log('error: ', error);
    throw new Error(error.message);
  }
}