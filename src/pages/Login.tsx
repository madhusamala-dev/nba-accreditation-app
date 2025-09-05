import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { login, resetPassword } from '@/lib/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log('Form submitted with:', { email, password });

    try {
      const user = login(email, password);
      if (user) {
        console.log('Login successful, user:', user);
        
        // Dispatch custom event to notify App component
        window.dispatchEvent(new CustomEvent('userLogin'));
        
        // Small delay to ensure state updates
        setTimeout(() => {
          console.log('Redirecting user...');
          if (user.role === 'admin') {
            navigate('/admin/dashboard', { replace: true });
          } else {
            navigate('/institute/dashboard', { replace: true });
          }
        }, 100);
      } else {
        console.log('Login failed, showing error');
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      resetPassword(email);
      setShowForgotPassword(false);
    } else {
      setError('Please enter your email address');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">CompliEdu Technologies</CardTitle>
          <CardDescription>
            {showForgotPassword ? 'Reset your password' : 'Sign in to your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4" variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={showForgotPassword ? handleForgotPassword : handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            {!showForgotPassword && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                showForgotPassword ? 'Send Reset Link' : 'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              variant="link"
              className="text-sm"
              onClick={() => {
                setShowForgotPassword(!showForgotPassword);
                setError('');
              }}
              disabled={isLoading}
            >
              {showForgotPassword ? 'Back to Login' : 'Forgot Password?'}
            </Button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-3 font-medium">Demo Credentials:</p>
            
            <div className="space-y-3 text-xs">
              <div className="p-2 bg-white rounded border">
                <p className="font-medium text-blue-600 mb-1">Admin Account:</p>
                <p className="text-gray-700">admin@compliedu.com</p>
                <p className="text-gray-700">admin123</p>
              </div>
              
              <div className="p-2 bg-white rounded border">
                <p className="font-medium text-green-600 mb-1">Sample Institution Logins:</p>
                <div className="space-y-1">
                  <div>
                    <p className="text-gray-700">rgukt@example.com</p>
                    <p className="text-gray-500">admin123 (RGUKT Basar - Engineering)</p>
                  </div>
                  <div>
                    <p className="text-gray-700">vit@example.com</p>
                    <p className="text-gray-500">vit123 (VIT University - Engineering)</p>
                  </div>
                  <div>
                    <p className="text-gray-700">iit@example.com</p>
                    <p className="text-gray-500">iit123 (IIT Delhi - Engineering)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}