'use client'
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function useSeatsSocket(busId, date) {
  const [seats, setSeats] = useState([]);
  const [bus, setBus] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io('http://localhost:3001');
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      socketInstance.emit('joinBus', { busId, date });
    });

    socketInstance.on('seats:data', ({ bus, seats }) => {
      setBus(bus);
      setSeats(seats);
    });

    socketInstance.on('seat:changed', ({ seatNumber, status }) => {
      setSeats(prev => prev.map(seat => 
        seat.seat_number === seatNumber ? { ...seat, status } : seat
      ));
    });

    return () => socketInstance.disconnect();
  }, [busId, date]);

  const updateSeat = (seatNumber, status) => {
    socket?.emit('seat:update', { busId, date, seatNumber, status });
  };

  return { bus, seats, updateSeat };
}
