'use server'
import pool from "@/app/lib/db";
import { getCurrentUser } from './auth';
import { redirect } from 'next/navigation';

export async function createBooking(bookingData) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/3s/login');
  }

  const { busId, journeyDate, seats, totalAmount, stripePaymentIntentId } = bookingData;

  if (!busId || !journeyDate || !seats || !Array.isArray(seats) || seats.length === 0 || !totalAmount || !stripePaymentIntentId) {
    return { error: "Missing required fields" };
  }

  for (const seat of seats) {
    if (!seat.number || !seat.name || !seat.mobile) {
      return { error: "Each seat must have number, name, and mobile" };
    }
  }

  try {
    const seatNumbers = seats.map(seat => seat.number);
    const bookedSeats = await pool.query(
      `SELECT seat_number FROM seats 
       WHERE bus_id = $1 AND booked_date = $2 AND seat_number = ANY($3) AND status = 'booked'`,
      [busId, journeyDate, seatNumbers]
    );

    if (bookedSeats.rows.length > 0) {
      const bookedSeatNumbers = bookedSeats.rows.map(row => row.seat_number);
      return { 
        error: "Some seats are already booked", 
        bookedSeats: bookedSeatNumbers 
      };
    }

    const bookingRes = await pool.query(
      `INSERT INTO bookings
       (user_id, bus_id, journey_date, total_seats, total_amount, payment_status, stripe_payment_intent_id)
       VALUES ($1,$2,$3,$4,$5,'paid',$6)
       RETURNING id`,
      [user.id, busId, journeyDate, seats.length, totalAmount, stripePaymentIntentId]
    );

    const bookingId = bookingRes.rows[0].id;

    for (const seat of seats) {
      await pool.query(
        `INSERT INTO seats 
         (bus_id, seat_number, status, passenger_name, passenger_phone, booked_date, booked_by, booking_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [busId, seat.number, "booked", seat.name, seat.mobile, journeyDate, user.id, bookingId]
      );
    }

    return { success: true, bookingId };
  } catch (error) {
    return { error: error.message };
  }
}

export async function getUserBookings() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/3s/login');
  }

  try {
    const result = await pool.query('SELECT * FROM bookings WHERE user_id = $1', [user.id]);
    return result.rows;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getTicketDetails(ticketId) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/3s/login');
  }

  try {
    const ticket = await pool.query('SELECT * FROM bookings WHERE id = $1', [ticketId]);
    
    if (ticket.rows.length === 0) {
      throw new Error("Ticket not found");
    }

    const seats = await pool.query('SELECT * FROM seats WHERE booking_id = $1', [ticketId]);
    
    return { 
      ticket: ticket.rows[0], 
      seats: seats.rows 
    };
  } catch (error) {
    throw new Error(error.message);
  }
}