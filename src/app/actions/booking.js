'use server'
import "@/app/lib/db";
import Booking from "@/app/lib/models/Booking";
import Seat from "@/app/lib/models/Seat";
import { getCurrentUser } from './auth';
import { redirect } from 'next/navigation';

export async function createBooking(bookingData) {
  const user = await getCurrentUser();
  if (!user) redirect('/3s/login');

  const { busId, journeyDate, seats, totalAmount } = bookingData;

  if (!busId || !journeyDate || !seats || !Array.isArray(seats) || seats.length === 0 || !totalAmount) {
    return { error: "Missing required fields" };
  }

  for (const seat of seats) {
    if (!seat.number || !seat.name || !seat.mobile || !seat.age || !seat.gender) {
      return { error: "Each seat must have number, name, age, gender, and mobile" };
    }
  }

  try {
    const seatNumbers = seats.map(seat => seat.number);
    const bookedSeats = await Seat.find({
      bus_id: busId,
      booked_date: journeyDate,
      seat_number: { $in: seatNumbers },
      status: 'booked'
    });

    if (bookedSeats.length > 0) {
      return { 
        error: "Some seats are already booked", 
        bookedSeats: bookedSeats.map(s => s.seat_number) 
      };
    }

    const booking = await Booking.create({
      user_id: user.id,
      bus_id: busId,
      journey_date: journeyDate,
      total_seats: seats.length,
      total_amount: totalAmount,
      payment_status: 'paid'
    });

    for (const seat of seats) {
      await Seat.create({
        bus_id: busId,
        seat_number: seat.number,
        status: "booked",
        passenger_name: seat.name,
        passenger_age: seat.age,
        passenger_gender: seat.gender,
        passenger_phone: seat.mobile,
        booked_date: journeyDate,
        booked_by: user.id,
        booking_id: booking._id
      });
    }

    return { success: true, bookingId: booking._id.toString() };
  } catch (error) {
    return { error: error.message };
  }
}

export async function getUserBookings() {
  const user = await getCurrentUser();
  if (!user) redirect('/3s/login');

  try {
    const result = await Booking.find({ user_id: user.id }).lean();
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getTicketDetails(ticketId) {
  const user = await getCurrentUser();
  if (!user) redirect('/3s/login');

  try {
    const ticket = await Booking.findById(ticketId).lean();
    if (!ticket) throw new Error("Ticket not found");

    const seats = await Seat.find({ booking_id: ticketId }).lean();
    return JSON.parse(JSON.stringify({ ticket, seats }));
  } catch (error) {
    throw new Error(error.message);
  }
}