import { registerUser } from '@/app/actions/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

export default async function RegisterPage({ searchParams }) {
  const params = await searchParams;

  async function handleRegister(formData) {
    'use server'
    const result = await registerUser(formData);
    if (result.success) redirect('/3s/login?success=Registration successful. Please login.');
    redirect('/3s/register?error=' + encodeURIComponent(result.error));
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)] p-6">
      <Card className="w-full max-w-md liquid-card glass">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription>Register for 3S Bus Booking</CardDescription>
        </CardHeader>
        <CardContent>
          {params?.error && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm border border-destructive/20">
              {params.error}
            </div>
          )}
          {params?.success && (
            <div className="mb-4 p-3 rounded-xl bg-green-50 text-green-700 text-sm border border-green-200">
              {params.success}
            </div>
          )}
          
          <form action={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input type="text" name="name" id="name" placeholder="Enter your name" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" name="email" id="email" placeholder="Enter your email" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input type="password" name="password" id="password" placeholder="Min 8 characters" minLength="8" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select name="role" id="role" required>
                <option value="">Select Role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Select>
            </div>
            
            <Button type="submit" size="lg" className="w-full">
              Register
            </Button>
          </form>
          
          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{' '}
            <a href="/3s/login" className="text-primary font-medium hover:underline">Login here</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}