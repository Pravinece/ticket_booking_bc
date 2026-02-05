import { registerUser } from '@/app/actions/auth';
import { redirect } from 'next/navigation';

export default function RegisterPage({ searchParams }) {
  async function handleRegister(formData) {
    'use server'
    
    const result = await registerUser(formData);
    
    if (result.success) {
      redirect('/3s/login?success=Registration successful. Please login.');
    }
    
    redirect('/3s/register?error=' + encodeURIComponent(result.error));
  }

  return (
    <div>
      <h1>Register for 3S Bus Booking</h1>
      <a href="/3s">← Back to Home</a>
      
      {searchParams?.error && (
        <div style={{ color: 'red', margin: '10px 0' }}>
          Error: {searchParams.error}
        </div>
      )}
      
      <form action={handleRegister}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" name="name" id="name" required />
        </div>
        
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" id="email" required />
        </div>
        
        <div>
          <label htmlFor="password">Password (min 8 characters):</label>
          <input type="password" name="password" id="password" minLength="8" required />
        </div>
        
        <button type="submit">Register</button>
      </form>
      
      <p>
        Already have an account? <a href="/3s/login">Login here</a>
      </p>
    </div>
  );
}