'use client'
import React, { useState } from 'react'
import { useSeatsSocket } from '@/app/hooks/useSeatsSocket'

function SeatsClient({ busId, date }) {
    const { bus, seats, updateSeat } = useSeatsSocket(busId, date)
    const [selected, setSelected] = useState([])

    if (!bus || !seats.length) return <div>Loading seats...</div>

    const handleLockSeat = () => {
      selected.forEach(seatNumber => {
        updateSeat(seatNumber, 'booked');
      });
      setSelected([]);
    };

    const renderSeats = () => {
      const seatElements = [];

      for (let i = 1; i <= bus.capacity; i++) {
        const seat = seats.find(s => s.seat_number === i);
        const isBooked = seat?.status === 'booked';

        seatElements.push(
          <div
            key={i}
            style={{
              width: '40px',
              height: '40px',
              margin: '5px',
              border: '1px solid #ccc',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',     
              cursor: isBooked ? 'not-allowed' : 'pointer',
              backgroundColor: isBooked ? '#ff6b6b' : selected?.includes(i) ?'green':' #f8f9fa'
            }}
            onClick={() => {
              if (isBooked) return;
              setSelected(prev => 
                prev.includes(i) ? prev.filter(seat => seat !== i) : [...prev, i]
              );
            }}
            >
            {i}
          </div>
        );
      }

      return seatElements;
    };

  return (
    <div style={{ padding: '20px' }}>
        <h1>Seat Layout</h1>
        <a href={`/3s/bus`}>← Back to Buses</a>

        <div>
          <h2>{bus.bus_name}</h2>
          <p>Bus Number: {bus.bus_number}</p>
          <p>Date: {date}</p>
          <p>Fare per seat: ₹{bus.fare}</p>
        </div>

        <div style={{ margin: '20px 0' }}>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#f8f9fa', border: '1px solid #ccc', marginRight: '5px' }}></div>
              Available
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#ff6b6b', border: '1px solid #ccc', marginRight: '5px' }}></div>
              Booked
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '400px', textAlign: 'center' }}>
          {renderSeats()}
          <button onClick={handleLockSeat}>Book Seats</button>
        </div>

        <div style={{ marginTop: '20px' }}>
          <p><strong>Note:</strong> This is a read-only view showing seat availability.</p>
          <p>Red seats are already booked. White seats are available.</p>
        </div>
      </div>
  )
}

export default SeatsClient