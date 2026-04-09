import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Globe, VerifiedIcon } from 'lucide-react';
import { Button } from 'antd';
import { createBus } from '@/app/actions/buses';
import SearchableSelect from './SearchableSelect';

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

async function handleCreateBus(formData) {
  'use server'
  console.log('formData: ', formData);
  const result = await createBus(formData);
  if (result.success) {
    redirect('/3s/bus'); // or show success message
  }
  // handle error
}

const cities = [
  "chennai", "trichy", "thanjavur", "ooty", "tirunelveli", "theni",
  "coimbatore", "pattukotai", "pudhukottai", "vilupuram", "viruthachalam",
  "salem", "sivagangai", "madurai", "tiruvarur", "palani", "thirutani",
  "thiruvannamalai", "kodaikanal"
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-evenly w-full h-full">
      <div className='w-[60%] min-h-[55%] flex justify-evenly items-center'>
        <div className='w-[50%] h-full flex flex-col justify-center p-1 gap-4'>
          <h1 className="text-4xl font-bold text-white">Navigate the <span className='text-[#53DDFC]'>SSS</span> Void.</h1>
          <p className='text-[14px] text-amber-50'>Experience transit reimagined. Premium seating, bio-luminescent routes, and seamless celestial connections.</p>
          <div className='w-full h-16 flex items-center gap-4 justify-around'>
            <div className='border-2 border-[#53DDFC] min-w-[40%] p-4 rounded-lg'>
              <h1 className='text-[20px] text-amber-50 font-bold'>4.9k</h1>
              <p className='text-[14px] text-amber-50'>DAILY ROUTES</p>
            </div>
            <div className='border-2 border-[#53DDFC] min-w-[40%] p-4 rounded-lg'>
              <h1 className='text-[20px] text-amber-50 font-bold ' >24/7</h1>
              <p className='text-[14px] text-amber-50'>PORTAL SUPPORT</p>
            </div>
          </div>
          <div></div>
        </div>

        <div className='glass-card w-[40%] h-full backdrop-blur-lg flex items-center justify-center'>
          <form action={searchBuses} className='w-[90%] h-[80%] flex flex-col items-center justify-evenly'>
            <div className='text-xl font-bold text-white'> <Globe className='inline text-[#53DDFC]' /> Book Your Journey</div>
            <div className='w-[80%]'>
              <SearchableSelect name="source" placeholder="From" options={cities} />
            </div>
            <div className='w-[80%]'>
              <SearchableSelect name="destination" placeholder="To" options={cities} />
            </div>
            <div className='w-[80%]'>
              <Button htmlType="submit" className='w-full btn'>Search Buses</Button>
            </div>
          </form>
        </div>
      </div>

      <div className='w-full h-[30%] flex items-center justify-center'>
        <div className='w-[60%] h-full flex justify-evenly'>
          <div className='w-[55%] h-full border-2 rounded-4xl overflow-hidden'>
            <img src="/bus1.jpeg" alt="" className='w-full h-full object-cover'/>
          </div>
          <div className='w-[35%] h-full bg-[#192540] border-2 border-[#53DDFC] rounded-4xl flex flex-col items-center justify-center gap-4 p-4 hover:shadow-[10px_-10px_0px_-3px_#53DDFC] transition-all duration-300'>
            <span className='text-xl font-bold text-white'> <VerifiedIcon className='inline text-[#53DDFC]'/> A.I Optimized Seating</span>
            <p className='text-[14px] text-amber-50'>Our quantum algorithms ensure maximum comfort based on your bio-metrics and journey duration.</p>
          </div>  
        </div>
      </div>
    </div>
  );
}