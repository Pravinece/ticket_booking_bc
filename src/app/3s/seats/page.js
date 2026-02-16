import { cookies } from 'next/headers';
import SeatsClient from './SeatsClient';

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

  return <SeatsClient busId={busId} date={date} />;
}