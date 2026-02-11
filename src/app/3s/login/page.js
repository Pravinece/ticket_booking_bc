import { loginUser } from '@/app/actions/auth';
import { redirect } from 'next/navigation';

export default function LoginPage() {
  async function handleLogin(formData) {
    'use server'
    
    const result = await loginUser(formData);
    
    if (result.success) {
      redirect('/3s');
    }
    
    redirect('/3s/login?error=' + encodeURIComponent(result.error));
  }

  return (
    <div>
      <h1>Login to 3S Bus Booking</h1>
      <a href="/3s">← Back to Home</a>
            
      <form action={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" id="email" required />
        </div>
        
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" name="password" id="password" required />
        </div>
        
        <button type="submit">Login</button>
      </form>
      
      <p>
        Don't have an account? <a href="/3s/register">Register here</a>
      </p>
    </div>
  );
}