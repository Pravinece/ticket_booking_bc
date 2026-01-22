import pool from "@/app/lib/db";
import { NextResponse } from "next/server";
import { verifyToken, authResponse } from "@/app/lib/auth";


export async function POST(req) {
  const user = await verifyToken(req);
  if (!user) {
    return authResponse();
  }

  const { busId, journeyDate, seats, totalAmount, stripePaymentIntentId } = await req.json();

  // Validation
  if (!busId || !journeyDate || !seats || !Array.isArray(seats) || seats.length === 0 || !totalAmount || !stripePaymentIntentId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  for (const seat of seats) {
    if (!seat.number || !seat.name || !seat.mobile) {
      return NextResponse.json({ error: "Each seat must have number, name, and mobile" }, { status: 400 });
    }
  }

  try {
    // Check if seats are already booked
    const seatNumbers = seats.map(seat => seat.number);
    const bookedSeats = await pool.query(
      `SELECT seat_number FROM seats 
       WHERE bus_id = $1 AND booked_date = $2 AND seat_number = ANY($3) AND status = 'booked'`,
      [busId, journeyDate, seatNumbers]
    );

    if (bookedSeats.rows.length > 0) {
      const bookedSeatNumbers = bookedSeats.rows.map(row => row.seat_number);
      return NextResponse.json({ 
        error: "Some seats are already booked", 
        bookedSeats: bookedSeatNumbers 
      }, { status: 409 });
    }

    // Create booking
    const bookingRes = await pool.query(
      `INSERT INTO bookings
       (user_id, bus_id, journey_date, total_seats, total_amount, payment_status, stripe_payment_intent_id)
       VALUES ($1,$2,$3,$4,$5,'paid',$6)
       RETURNING id`,
      [user.id, busId, journeyDate, seats.length, totalAmount, stripePaymentIntentId]
    );

    const bookingId = bookingRes.rows[0].id;

    // Insert passenger seats
    for (const seat of seats) {
      await pool.query(
        `INSERT INTO seats 
         (bus_id, seat_number, status, passenger_name, passenger_phone, booked_date, booked_by, booking_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [busId, seat.number, "booked", seat.name, seat.mobile, journeyDate, user.id, bookingId]
      );
    }

    return NextResponse.json({
      message: "Booking successful",
      bookingId
    });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
