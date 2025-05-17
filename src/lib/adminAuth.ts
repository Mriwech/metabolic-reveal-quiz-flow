
import { supabase } from '@/integrations/supabase/client';
import * as bcrypt from 'bcryptjs';

// Default admin password (will be replaced with env variable)
const DEFAULT_ADMIN_PASSWORD = 'Mriwech30';

/**
 * Verify admin login credentials
 */
export const verifyAdminLogin = async (username: string, password: string): Promise<boolean> => {
  try {
    // Get the admin user from the database
    const { data, error } = await supabase
      .from('admin_users')
      .select('password_hash')
      .eq('username', username)
      .single();
    
    if (error || !data) {
      console.error('Error fetching admin user:', error);
      return false;
    }
    
    // If no password hash is set yet, check against default password
    if (!data.password_hash) {
      if (password === DEFAULT_ADMIN_PASSWORD) {
        // Set the password hash for future logins
        const hashedPassword = await bcrypt.hash(password, 10);
        await supabase
          .from('admin_users')
          .update({ password_hash: hashedPassword })
          .eq('username', username);
        return true;
      }
      return false;
    }
    
    // Compare the provided password with the stored hash
    return await bcrypt.compare(password, data.password_hash);
  } catch (err) {
    console.error('Error in verifyAdminLogin:', err);
    return false;
  }
};

/**
 * Check if the user is authenticated as admin
 */
export const isAdminAuthenticated = (): boolean => {
  return localStorage.getItem('admin_authenticated') === 'true';
};

/**
 * Set admin authentication state
 */
export const setAdminAuthenticated = (authenticated: boolean): void => {
  if (authenticated) {
    localStorage.setItem('admin_authenticated', 'true');
  } else {
    localStorage.removeItem('admin_authenticated');
  }
};
