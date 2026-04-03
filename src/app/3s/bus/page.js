import { getBuses } from '@/app/actions/buses';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

async function selectBus(formData) {
  'use server'
  
  const busId = formData.get('busId');
  const date = formData.get('date');
  
  if (!busId || !date) return;
  
  const cookieStore = await cookies();
  cookieStore.set('selectedBusId', busId, { maxAge: 3600, httpOnly: true });
  cookieStore.set('selectedDate', date, { maxAge: 3600, httpOnly: true });
  
  redirect(`/3s/seats`);
}

export default async function BusListPage() {
  const cookieStore = await cookies();
  const source = cookieStore.get('searchSource')?.value;
  const destination = cookieStore.get('searchDestination')?.value;
  
  if (!source || !destination) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)] p-6">
        <Card className="glass liquid-card p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Invalid Search</h1>
          <p className="text-muted-foreground mb-4">Please search for buses first.</p>
          <Button asChild variant="outline">
            <a href="/3s">← Back to Search</a>
          </Button>
        </Card>
      </div>
    );
  }

  const buses = await getBuses({ source, destination });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <a href="/3s" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to Search</a>
          <h1 className="text-2xl font-bold mt-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Available Buses
          </h1>
          <p className="text-muted-foreground mt-1">
            <span className="capitalize font-medium text-foreground">{source}</span>
            {' → '}
            <span className="capitalize font-medium text-foreground">{destination}</span>
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl shadow-lg">
          🚌
        </div>
      </div>

      {buses.length === 0 ? (
        <Card className="glass liquid-card p-8 text-center">
          <p className="text-muted-foreground text-lg">No buses found for this route.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {buses.map((bus) => (
            <Card key={bus._id} className="glass liquid-card overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">{bus.bus_name}</h3>
                    <p className="text-sm text-muted-foreground">Bus No: {bus.bus_number}</p>
                    <div className="flex gap-4 mt-2">
                      <span className="inline-flex items-center gap-1 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                        🪑 {bus.capacity} seats
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                        ₹{bus.fare}
                      </span>
                    </div>
                  </div>
                  
                  <form action={selectBus} className="flex items-end gap-3">
                    <input type="hidden" name="busId" value={bus._id} />
                    <div className="space-y-1">
                      <Label htmlFor={`date-${bus._id}`}>Journey Date</Label>
                      <Input
                        type="date"
                        id={`date-${bus._id}`}
                        name="date"
                        min={new Date().toISOString().split('T')[0]}
                        required
                        className="w-44"
                      />
                    </div>
                    <Button type="submit">
                      Select Seats
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}