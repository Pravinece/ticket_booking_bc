import { getBuses } from '@/app/actions/buses';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DateInput from '@/app/components/DateInput';
import { Label } from '@/components/ui/label';
import ToggleSwitch from '@/app/components/ToggleSwitch';

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
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <a href="/3s" className="text-sm text-[#DEE5FF] hover:text-white transition-colors">← Back to Search</a>
          <h1 className="text-2xl font-bold mt-1 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Available Buses
          </h1>
          <p className="text-[#DEE5FF] mt-1 ">
            <span className="capitalize font-medium text-green-200">{source}</span>
            {' → '}
            <span className="capitalize font-medium text-orange-200">{destination}</span>
          </p>
        </div>
      </div>

      {buses.length === 0 ? (
        <Card className="glass liquid-card p-8 text-center">
          <p className="text-[#DEE5FF] text-lg">No buses found for this route.</p>
        </Card>
      ) : (
        <div className="flex justify-between">
          <div className='flex flex-col gap-2 w-[20%] max-h-[calc(100vh-220px)] h-fit p-4 glass-card rounded-3xl'>
              <div className='p-2'>
                <h4 className='text-sm font-bold text-[#DEE5FF]'>Filter Journey</h4>
                <p className='text-white text-[12px]'>bus Type</p>
              </div>
              <div className='p-2'>
                <ToggleSwitch name="ac_sleeper" label="AC sleeper" />
              </div>  

              <div className='p-2'>
                <ToggleSwitch name="non_ac_sleeper" label="Non-AC sleeper" />
              </div>

              <div className='p-2'>
                <Button variant="outline" className="w-full btn">
                  Apply Filters
                </Button>
              </div>

              <div className='bg-blue-950 rounded-3xl flex flex-col justify-evenly p-2'>
                <p className='text-[10px] text-[#53DDFC] border-[#53DDFC] border-1 p-0.5 rounded-2xl w-fit'>PRO Member</p>
                <h4 className='text-sm font-bold text-[#DEE5FF]'>Get 15% off</h4>
                <h6 className='text-[12px] text-amber-50'>Upgrade to Premium and save on every booking this season.</h6>
              </div>

          </div>

          <div className="grid gap-4 w-[78%] h-[calc(100vh-220px)] overflow-y-auto">
          {buses.map((bus) => (
            <div key={bus._id} className="glass-card max-h-40 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-[#DEE5FF]">{bus.bus_name}</h3>
                    <p className="text-sm text-[#DEE5FF]">Bus No: {bus.bus_number}</p>
                    <div className="flex gap-4 mt-2">
                      <span className="inline-flex items-center gap-1 text-sm text-[#DEE5FF] px-3 py-1 rounded-full">
                         {bus.capacity} seats
                      </span>
                      <span className="inline-flex items-center gap-1 text-3xl text-[#53DDFC] px-3 py-1 rounded-full font-semibold">
                        ₹{bus.fare}
                      </span>
                    </div>
                  </div>
                  
                  <form action={selectBus} className="flex items-end gap-3">
                    <input type="hidden" name="busId" value={bus._id} />
                    <div className="space-y-1 text-[#DEE5FF]">
                      <Label htmlFor={`date-${bus._id}`}>Journey Date</Label>
                      <DateInput
                        id={`date-${bus._id}`}
                        name="date"
                        min={new Date().toISOString().split('T')[0]}
                        required
                        className="w-44 text-[#DEE5FF]"
                      />
                    </div>
                    <Button type="submit" className='text-[#DEE5FF] btn'>
                      Select Seats
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      )}
    </div>
  );
}