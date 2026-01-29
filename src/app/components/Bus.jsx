'use client';
import { useState, useEffect } from 'react';

export default function Bus() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const source = localStorage.getItem('source');
    const destination = localStorage.getItem('destination');
    
    if (source && destination) {
      fetchBuses(source, destination);
    }
  }, []);

  const fetchBuses = async (source, destination) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/buses?source=${source}&destination=${destination}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await res.json();
      setBuses(data.buses || []);
    } catch (err) {
      alert('Failed to fetch buses');
    } finally {
      setLoading(false);
    }
  };

  const viewSeats = async (busId) => {
    const date = localStorage.getItem('journeyDate');
    
    if (!date) {
      alert('Journey date not found');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/buses/${busId}?date=${date}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await res.json();
      console.log('Seats for bus', busId, ':', data.seats);
    } catch (err) {
      alert('Failed to fetch seats');
    }
  };

  const styles = {
    container: { padding: '20px' },
    busCard: { border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '4px' },
    busButton: { padding: '8px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }
  };

  if (loading) return <div style={styles.container}>Loading buses...</div>;

  return (
    <div style={styles.container}>
      <h1>Available Buses</h1>
      
      {buses.length === 0 ? (
        <p>No buses found</p>
      ) : (
        buses.map((bus) => (
          <div key={bus.id} style={styles.busCard}>
            <h3>{bus.bus_name} ({bus.bus_number})</h3>
            <p>Route: {bus.source} → {bus.destination}</p>
            <p>Capacity: {bus.capacity} | Fare: ₹{bus.fare}</p>
            <button onClick={() => viewSeats(bus.id)} style={styles.busButton}>
              View Seats
            </button>
          </div>
        ))
      )}
    </div>
  );
}