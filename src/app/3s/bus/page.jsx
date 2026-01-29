import { cookies } from 'next/headers';
import BusClient from '../../components/BusClient';

export default async function BusPage() {
  const cookieStore = await cookies();
  const source = cookieStore.get('searchSource')?.value;
  const destination = cookieStore.get('searchDestination')?.value;
  const date = cookieStore.get('searchDate')?.value;
  const token = cookieStore.get('token')?.value;
  
  if (!source || !destination || !date) {
    return <div style={{ padding: '20px' }}>Please search from home page</div>;
  }

  if (!token) {
    return <div style={{ padding: '20px' }}>Please login first</div>;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/buses?source=${source}&destination=${destination}`,
      {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store'
      }
    );

    const data = await res.json();
    const buses = data.buses || [];

    return <BusClient buses={buses} date={date} token={token} />;
  } catch (err) {
    return <div style={{ padding: '20px' }}>Failed to fetch buses</div>;
  }
}