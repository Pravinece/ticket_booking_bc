export async function POST(req) {
  const {
    busId,
    journeyDate,
    seats,
    totalAmount,
    stripePaymentIntentId
  } = await req.json();

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Create booking
    const bookingRes = await client.query(
      `INSERT INTO bookings 
      (user_id, bus_id, journey_date, total_seats, total_amount, payment_status, stripe_payment_intent_id)
      VALUES ($1,$2,$3,$4,$5,'paid',$6)
      RETURNING id`,
      [req.user.id, busId, journeyDate, seats.length, totalAmount, stripePaymentIntentId]
    );

    const bookingId = bookingRes.rows[0].id;

    // 2️⃣ Insert passengers + update seats
    for (const seat of seats) {
      await client.query(
        `INSERT INTO booking_passengers 
        (booking_id, seat_id, passenger_name, phone_number, insurance)
        VALUES ($1,$2,$3,$4,$5)`,
        [bookingId, seat.seatId, seat.name, seat.phone, seat.insurance]
      );

      await client.query(
        `UPDATE seats 
         SET status='booked', booking_id=$1, booked_date=$2
         WHERE id=$3`,
        [bookingId, journeyDate, seat.seatId]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json({
      message: "Booking successful",
      bookingId
    });

  } catch (err) {
    await client.query("ROLLBACK");
    return NextResponse.json({ error: err.message }, { status: 500 });
  } finally {
    client.release();
  }
}
