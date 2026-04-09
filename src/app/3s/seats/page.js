import { cookies } from 'next/headers';
import { getBusSeats } from '@/app/actions/buses';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SeatsClient from './SeatsClient';

export default async function SeatsPage() {
  const cookieStore = await cookies();
  const busId = cookieStore.get('selectedBusId')?.value;
  const date = cookieStore.get('selectedDate')?.value;

  if (!busId || !date) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)] p-6">
        <Card className="glass liquid-card p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Invalid Request</h1>
          <p className="text-muted-foreground mb-4">Please select a bus and date first.</p>
          <Button asChild variant="outline">
            <a href="/3s">← Back to Search</a>
          </Button>
        </Card>
      </div>
    );
  }

  try {
    const { bus, seats } = await getBusSeats({ busId, date });
    return <SeatsClient bus={bus} seats={seats} busId={busId} date={date} />
  } catch (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)] p-6">
        <Card className="glass liquid-card p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Error</h1>
          <p className="text-muted-foreground mb-4">{error.message}</p>
          <Button asChild variant="outline">
            <a href="/3s">← Back to Search</a>
          </Button>
        </Card>
      </div>
    );
  }
}