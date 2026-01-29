'use client';

export default function BusClient({ buses, date, token }) {
  const viewSeats = async (busId) => {
    try {
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

  return (
    <div style={styles.container}>
      <h1>Available Buses</h1>
      <p>Journey Date: {date}</p>
      
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