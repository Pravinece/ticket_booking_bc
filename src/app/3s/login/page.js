import { loginUser } from '@/app/actions/auth';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;

  async function handleLogin(formData) {
    'use server'
    const result = await loginUser(formData);
    console.log('result: ', result);
    if (result.success) redirect('/3s');
    redirect('/3s/login?error=' + encodeURIComponent(result.error));
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)] p-6">
      <Card className="w-full max-w-md liquid-card glass">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription>Login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          {params?.error && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm border border-destructive/20">
              {params.error}
            </div>
          )}
          
          <form action={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" name="email" id="email" placeholder="Enter your email" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input type="password" name="password" id="password" placeholder="Enter your password" required />
            </div>
            
            <Button type="submit" size="lg" className="w-full">
              Login
            </Button>
          </form>
          
          <p className="text-center text-sm text-muted-foreground mt-4">
            Don't have an account?{' '}
            <a href="/3s/register" className="text-primary font-medium hover:underline">Register here</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}