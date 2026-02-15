import { getBusSeats } from '@/app/actions/buses';
import { cookies } from 'next/headers';
import SeatsClient from './SeatsClient';
import { useSocket } from '@/app/actions/socket';
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
    const { bus, seats } = await getBusSeats({ busId, date });
    let socket = await useSocket()
    console.log('bus, seats: ', bus, seats);

    return (
      <SeatsClient bus={bus} seats={seats} date={date}/>
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