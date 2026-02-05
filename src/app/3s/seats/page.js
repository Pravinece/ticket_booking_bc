import { getBusSeats } from '@/app/actions/buses';
import { cookies } from 'next/headers';
//Seat List
export default async function SeatsPage() {
  const cookieStore = await cookies();
  const busId = cookieStore.get('selectedBusId')?.value;
  const date = cookieStore.get('selectedDate')?.value;
  
  if (!busId || !date) {
    return (
      <div>
        <h1>Invalid Request</h1>
        <p>Please select a bus and date first.</p>
        <a href="/3s/bus">← Back to Search</a>
      </div>
    );
  }

  try {
    const { bus, seats } = await getBusSeats(busId, date);
    
    const renderSeats = () => {
      const totalSeats = bus.capacity;
      const seatElements = [];
      
      for (let i = 1; i <= totalSeats; i++) {
        const bookedSeat = seats.find(seat => seat.seat_number === i);
        const isBooked = !!bookedSeat;
        
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
              backgroundColor: isBooked ? '#ff6b6b' : '#f8f9fa'
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
        </div>

        <div style={{ marginTop: '20px' }}>
          <p><strong>Note:</strong> This is a read-only view showing seat availability.</p>
          <p>Red seats are already booked. White seats are available.</p>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <a href="/3s">← Back to Search</a>
      </div>
    );
  }
}