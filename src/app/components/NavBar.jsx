'use client'
import { useEffect, useState } from 'react'
import styles from '../3s/home.module.css'

export default function NavBar() {
  const [first, setFirst] = useState('home');
  useEffect(() => {
      if(window.location.pathname=='/3s'){
        setFirst('home')
      }else if(window.location.pathname == '/3s/login'){
        setFirst('login')
      }else if(window.location.pathname == '/3s/register'){
        setFirst('register')
      }
  }, [window.location.pathname])
  
  return (
    <nav style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
      <div className={styles.heading}>
        <h2>3S Bus Booking</h2>
      </div>
      <div className={styles.navigator}>
        <a className={first=='home'&& styles.selected} href="/3s" style={{ margin: '0 10px' }}>Home</a>
        <a href="/3s/login" style={{ margin: '0 10px' }}>Login</a>
        <a href="/3s/register" style={{ margin: '0 10px' }}>Register</a>
      </div>
    </nav>
  );
}