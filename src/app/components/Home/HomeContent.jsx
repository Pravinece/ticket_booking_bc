'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!source || !destination || !date) {
      alert('Please fill all fields');
      return;
    }
    
    document.cookie = `searchSource=${source}; path=/; max-age=3600`;
    document.cookie = `searchDestination=${destination}; path=/; max-age=3600`;
    document.cookie = `searchDate=${date}; path=/; max-age=3600`;
    
    router.push('/3s/bus');
  };

  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the bus booking system</p>

      <form onSubmit={handleSearch}>
        <select name="source" id="source" value={source} onChange={(e) => setSource(e.target.value)} required>
          <option value="">Select Source</option>
          <option value="chennai">Chennai</option>
          <option value="trichy">Trichy</option>
          <option value="thanjavur">Thanjavur</option>
          <option value="ooty">Ooty</option>
          <option value="tirunelveli">Tirunelveli</option>
          <option value="theni">Theni</option>
          <option value="coimbatore">Coimbatore</option>
          <option value="pattukotai">Pattukotai</option>
          <option value="pudhukottai">Pudhukottai</option>
          <option value="vilupuram">Vilupuram</option>
          <option value="viruthachalam">Viruthachalam</option>
          <option value="salem">Salem</option>
          <option value="sivagangai">Sivagangai</option>
          <option value="madurai">Madurai</option>
          <option value="tiruvarur">Tiruvarur</option>
          <option value="palani">Palani</option>
          <option value="thirutani">Thirutani</option>
          <option value="thiruvannamalai">Thiruvannamalai</option>
          <option value="Kodaikanal">Kodaikanal</option>
        </select>

        <select name="destination" id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} required>
          <option value="">Select Destination</option>
          <option value="chennai">Chennai</option>
          <option value="trichy">Trichy</option>
          <option value="thanjavur">Thanjavur</option>
          <option value="ooty">Ooty</option>
          <option value="tirunelveli">Tirunelveli</option>
          <option value="theni">Theni</option>
          <option value="coimbatore">Coimbatore</option>
          <option value="pattukotai">Pattukotai</option>
          <option value="pudhukottai">Pudhukottai</option>
          <option value="vilupuram">Vilupuram</option>
          <option value="viruthachalam">Viruthachalam</option>
          <option value="salem">Salem</option>
          <option value="sivagangai">Sivagangai</option>
          <option value="madurai">Madurai</option>
          <option value="tiruvarur">Tiruvarur</option>
          <option value="palani">Palani</option>
          <option value="thirutani">Thirutani</option>
          <option value="thiruvannamalai">Thiruvannamalai</option>
          <option value="Kodaikanal">Kodaikanal</option>
        </select>

        <input type="date" name="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        
        <button type="submit">Search Buses</button>
      </form>
    </div>
  );
}