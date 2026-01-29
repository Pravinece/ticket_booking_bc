'use client';
import React, { useState } from 'react'
import styles from '../Home/Home.module.css'
import LoginModal from '../LoginModal';

function NavBar() {
    const [showLogin, setShowLogin] = useState(false);
    
  return (
    <>
    <div>NavBar</div>
    <button onClick={() => setShowLogin(true)}>Login</button>
    <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  )
}

export default NavBar