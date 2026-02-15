import { getBuses } from '@/app/actions/buses';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import styles from '../bus/bus.module.css'
//Bus List
async function selectBus(formData) {
  'use server'
  
  const busId = formData.get('busId');
  const date = formData.get('date');
  
  if (!busId || !date) {
    return;
  }
  
  const cookieStore = await cookies();
  cookieStore.set('selectedBusId', busId, { maxAge: 3600, httpOnly: true });
  cookieStore.set('selectedDate', date, { maxAge: 3600, httpOnly: true });
  
  redirect(`/3s/seats`);
}

export default async function BusListPage() {
  const cookieStore = await cookies();
  const source = cookieStore.get('searchSource')?.value;
  console.log('source: ', source);
  const destination = cookieStore.get('searchDestination')?.value;
  console.log('destination: ', destination);
  
  if (!source || !destination) {
    return (
      <div>
        <h1>Invalid Search</h1>
        <p>Please search for buses first.</p>
        <a href="/3s">← Back to Search</a>
      </div>
    );
  }

  const buses = await getBuses({ source, destination });
  console.log('buses: ', buses);

  return (
    <div className={styles.busContainer}>
      <div className={styles.backBar}>
      <a className={styles.back} href="/3s">← Back to Search</a>
      <p className={styles.h1}>From: <strong>{source}</strong> To: <strong>{destination}</strong></p>
      </div >

      {buses.length === 0 ? (
        <p>No buses found for this route.</p>
      ) : (
        <div className={styles.BusListPage}>
          {buses.map((bus) => (
            <div key={bus.id} className={styles.bus}>
              <h3>{bus.bus_name}</h3>
              <p>Bus Number: {bus.bus_number}</p>
              <p>Capacity: {bus.capacity} seats</p>
              <p>Fare: ₹{bus.fare}</p>
              
              <form action={selectBus} style={{ marginTop: '10px' }}>
                <input type="hidden" name="busId" value={bus.id} />
                <label htmlFor={`date-${bus.id}`}>Select Journey Date:</label>
                <input 
                  type="date" 
                  id={`date-${bus.id}`}
                  name="date"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                <button type="submit">Select Seats</button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}