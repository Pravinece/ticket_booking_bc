'use server'
import pool from "@/app/lib/db";
import { getCurrentUser } from './auth';
import { redirect } from 'next/navigation';

export async function getBuses(payload) {
  try {
    const { source, destination } = payload;
    
    let query = "SELECT * FROM buses WHERE 1=1";
    const values = [];

    if (source) {
      values.push(source);
      query += ` AND source = $${values.length}`;
    }

    if (destination) {
      values.push(destination);
      query += ` AND destination = $${values.length}`;
    }

    const buses = await pool.query(query, values);
    return buses.rows;
  } catch (error) {
    throw new Error("Failed to fetch buses");
  }
}

export async function createBus(formData) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/3s/login');
  }

  if (user.role !== 'admin') {
    return { error: "Only admin users can create buses" };
  }

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
    const existing = await pool.query(
      `SELECT * FROM buses WHERE bus_number = $1`, [bus_number]
    );

    if (existing.rows.length > 0) {
      return { error: "Bus number already exists" };
    }

    const bus = await pool.query(
      `INSERT INTO buses (bus_number, bus_name, source, destination, capacity, fare) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [bus_number, bus_name, source, destination, capacity, fare]
    );

    return { success: true, bus: bus.rows[0] };
  } catch (error) {
    return { error: "Internal Server Error" };
  }
}

export async function getBusSeats(payload) {
  let {busId , date} = payload;
  if (!busId || !date) {
    throw new Error("Bus ID and date are required");
  }

  try {
    const bus = await pool.query("SELECT * FROM buses WHERE id = $1", [busId]);
    if (bus.rows.length <= 0) {
      throw new Error("No bus found");
    }
    
    const seats = await pool.query(
      "SELECT seat_number, status FROM seats WHERE bus_id = $1 AND booked_date = $2",
      [busId, date]
    );

    const capacity = bus.rows[0].capacity;
    const existingSeats = seats.rows;
    const existingSeatNumbers = existingSeats.map(s => s.seat_number);
    
    const allSeats = Array.from({ length: capacity }, (_, i) => {
      const seatNumber = i + 1;
      const existingSeat = existingSeats.find(s => s.seat_number === seatNumber);
      return {
        seat_number: seatNumber,
        status: existingSeat ? existingSeat.status : 'open'
      };
    });

    return { bus: bus.rows[0], seats: allSeats };
  } catch (error) {
    console.log('error: ', error);
    throw new Error(error.message);
  }
}