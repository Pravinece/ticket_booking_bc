import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import styles from '../3s/home.module.css'
async function searchBuses(formData) {
  'use server'

  const source = formData.get('source');
  const destination = formData.get('destination');

  if (!source || !destination) {
    return;
  }

  const cookieStore = await cookies();
  cookieStore.set('searchSource', source, { maxAge: 3600, httpOnly: true });
  cookieStore.set('searchDestination', destination, { maxAge: 3600, httpOnly: true });

  redirect(`/3s/bus`);
}

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.imgContainer}>
          <img src="" alt="" />
      </div>
      <div className={styles.formContainer}>
        <form action={searchBuses} className={styles.form}>
          <div className={styles.inputBox}>
          <select name="source" required>
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
            <option value="kodaikanal">Kodaikanal</option>
          </select>
          </div>
          <div className={styles.inputBox}>
          <select name="destination" required>
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
            <option value="kodaikanal">Kodaikanal</option>
          </select>
          </div>
          <div className={styles.inputBox}>
          <button type="submit">Search Buses</button>
          </div>
        </form>
      </div>
    </div>
  );
}