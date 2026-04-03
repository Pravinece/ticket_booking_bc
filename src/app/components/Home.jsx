import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

async function searchBuses(formData) {
  'use server'

  const source = formData.get('source');
  const destination = formData.get('destination');

  if (!source || !destination) return;

  const cookieStore = await cookies();
  cookieStore.set('searchSource', source, { maxAge: 3600, httpOnly: true });
  cookieStore.set('searchDestination', destination, { maxAge: 3600, httpOnly: true });

  redirect(`/3s/bus`);
}

const cities = [
  "chennai", "trichy", "thanjavur", "ooty", "tirunelveli", "theni",
  "coimbatore", "pattukotai", "pudhukottai", "vilupuram", "viruthachalam",
  "salem", "sivagangai", "madurai", "tiruvarur", "palani", "thirutani",
  "thiruvannamalai", "kodaikanal"
];

export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)] p-6">
      <Card className="w-full max-w-lg liquid-card glass">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl mb-4">
            🚌
          </div>
          <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Search Bus Tickets
          </CardTitle>
          <CardDescription className="text-base">
            Find and book your bus tickets across Tamil Nadu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={searchBuses} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">From</label>
              <Select name="source" required>
                <option value="">Select Source</option>
                {cities.map(city => (
                  <option key={city} value={city}>
                    {city.charAt(0).toUpperCase() + city.slice(1)}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">To</label>
              <Select name="destination" required>
                <option value="">Select Destination</option>
                {cities.map(city => (
                  <option key={city} value={city}>
                    {city.charAt(0).toUpperCase() + city.slice(1)}
                  </option>
                ))}
              </Select>
            </div>

            <Button type="submit" size="lg" className="w-full">
              Search Buses
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}