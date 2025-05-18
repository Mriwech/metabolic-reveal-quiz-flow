
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { verifyAdminLogin, isAdminAuthenticated, setAdminAuthenticated } from '@/lib/adminAuth';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const [username, setUsername] = useState('admin'); // Pre-fill with admin
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (isAdminAuthenticated()) {
      navigate('/admin/dashboard');
    }
    
    // Check if admin user exists, if not create it
    const checkAdminUser = async () => {
      const { data, error } = await supabase
        .from('admin_users')
        .select('id')
        .eq('username', 'admin');
        
      if (error) {
        console.error('Error checking admin user:', error);
        return;
      }
      
      if (!data || data.length === 0) {
        // Create admin user if it doesn't exist
        const { error: insertError } = await supabase
          .from('admin_users')
          .insert({ username: 'admin', password_hash: '' });
          
        if (insertError) {
          console.error('Error creating admin user:', insertError);
        } else {
          console.log('Admin user created successfully');
        }
      }
    };
    
    checkAdminUser();
  }, [navigate]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Attempting login with username:', username);
      const isValid = await verifyAdminLogin(username, password);
      
      if (isValid) {
        setAdminAuthenticated(true);
        toast.success('Login successful');
        navigate('/admin/dashboard');
      } else {
        toast.error('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
