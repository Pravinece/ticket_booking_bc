'use client'
import React, { useState } from 'react'
import { useSeatsSocket } from '@/app/hooks/useSeatsSocket'

function SeatsClient({ busId, date }) {
    const { bus, seats, updateSeat } = useSeatsSocket(busId, date)
    const [selected, setSelected] = useState([])
    const [showPayment, setShowPayment] = useState(false)
    const [passengerDetails, setPassengerDetails] = useState([])

    if (!bus || !seats.length) return <div>Loading seats...</div>

    const handleLockSeat = () => {
      if (selected.length === 0) return;
      
      // Lock seats
      selected.forEach(seatNumber => {
        updateSeat(seatNumber, 'locked');
      });
      
      // Initialize passenger details for each seat
      const details = selected.map(seatNum => ({
        seatNumber: seatNum,
        name: '',
        mobile: ''
      }));
      setPassengerDetails(details);
      setShowPayment(true);
    };

    const handlePassengerChange = (index, field, value) => {
      setPassengerDetails(prev => 
        prev.map((p, i) => i === index ? { ...p, [field]: value } : p)
      );
    };

    const handlePayment = async () => {
      // Validate all fields
      const isValid = passengerDetails.every(p => p.name.trim() && p.mobile.trim());
      if (!isValid) {
        alert('Please fill all passenger details');
        return;
      }

      // TODO: Integrate Stripe payment here
      const totalAmount = selected.length * bus.fare;
      
      try {
        // After successful payment, update seats to booked
        selected.forEach(seatNumber => {
          updateSeat(seatNumber, 'booked');
        });
        
        alert('Payment successful!');
        setShowPayment(false);
        setSelected([]);
        setPassengerDetails([]);
      } catch (error) {
        alert('Payment failed');
      }
    };

    const handleCancel = () => {
      // Release locked seats
      selected.forEach(seatNumber => {
        updateSeat(seatNumber, 'open');
      });
      setShowPayment(false);
      setSelected([]);
      setPassengerDetails([]);
    };

    const renderSeats = () => {
      const seatElements = [];

      for (let i = 1; i <= bus.capacity; i++) {
        const seat = seats.find(s => s.seat_number === i);
        const isBooked = seat?.status === 'booked';
        const isLocked = seat?.status === 'locked';
        const isUnavailable = isBooked || isLocked;

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
              cursor: isUnavailable ? 'not-allowed' : 'pointer',
              backgroundColor: isBooked ? '#ff6b6b' : isLocked ? '#ffa500' : selected?.includes(i) ? 'green' : '#f8f9fa'
            }}
            onClick={() => {
              if (isUnavailable) return;
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
    <>
    <div style={{ padding: '20px', filter: showPayment ? 'blur(2px)' : 'none', transition: 'filter 0.3s' }}>
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
              <div style={{ width: '20px', height: '20px', backgroundColor: '#ffa500', border: '1px solid #ccc', marginRight: '5px' }}></div>
              Locked
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '20px', height: '20px', backgroundColor: '#ff6b6b', border: '1px solid #ccc', marginRight: '5px' }}></div>
              Booked
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '400px', textAlign: 'center' }}>
          {renderSeats()}
          <button onClick={handleLockSeat} disabled={selected.length === 0} style={{ marginTop: '20px', padding: '10px 20px', cursor: selected.length === 0 ? 'not-allowed' : 'pointer' }}>Book Seats ({selected.length})</button>
        </div>

        <div style={{ marginTop: '20px' }}>
          <p><strong>Note:</strong> Select seats and click Book to proceed with payment.</p>
        </div>
      </div>

      {/* Payment Slide-in Panel */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: showPayment ? 0 : '-100%',
        width: '100%',
        maxWidth: '500px',
        height: '100vh',
        backgroundColor: 'white',
        boxShadow: '-2px 0 10px rgba(0,0,0,0.3)',
        transition: 'right 0.3s ease-in-out',
        zIndex: 1000,
        overflowY: 'auto',
        padding: '20px'
      }}>
        <h2>Payment Details</h2>
        <button onClick={handleCancel} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>

        <div style={{ marginTop: '30px' }}>
          <h3>Selected Seats: {selected.join(', ')}</h3>
          <p><strong>Total Amount: ₹{selected.length * bus.fare}</strong></p>
          
          <hr style={{ margin: '20px 0' }} />
          
          <h3>Passenger Details</h3>
          {passengerDetails.map((passenger, index) => (
            <div key={index} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
              <h4>Seat {passenger.seatNumber}</h4>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
                <input
                  type="text"
                  value={passenger.name}
                  onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  placeholder="Enter passenger name"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px' }}>Mobile:</label>
                <input
                  type="tel"
                  value={passenger.mobile}
                  onChange={(e) => handlePassengerChange(index, 'mobile', e.target.value)}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  placeholder="Enter mobile number"
                />
              </div>
            </div>
          ))}
          
          <button 
            onClick={handlePayment}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Proceed to Payment (₹{selected.length * bus.fare})
          </button>
        </div>
      </div>
    </>
  )
}

export default SeatsClient