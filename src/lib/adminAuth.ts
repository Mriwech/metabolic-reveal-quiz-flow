
import { supabase } from '@/integrations/supabase/client';
import * as bcrypt from 'bcryptjs';

// Default admin password (will be replaced with env variable)
const DEFAULT_ADMIN_PASSWORD = 'Mriwech30';

/**
 * Verify admin login credentials
 */
export const verifyAdminLogin = async (username: string, password: string): Promise<boolean> => {
  try {
    console.log('Verifying admin login for username:', username);
    
    // Get the admin user from the database
    const { data, error } = await supabase
      .from('admin_users')
      .select('password_hash')
      .eq('username', username)
      .single();
    
    if (error) {
      console.error('Error fetching admin user:', error);
      return false;
    }
    
    if (!data) {
      console.error('Admin user not found');
      return false;
    }
    
    // If no password hash is set yet, check against default password
    if (!data.password_hash) {
      console.log('No password hash set, checking against default password');
      if (password === DEFAULT_ADMIN_PASSWORD) {
        // Set the password hash for future logins
        const hashedPassword = await bcrypt.hash(password, 10);
        const { error: updateError } = await supabase
          .from('admin_users')
          .update({ password_hash: hashedPassword })
          .eq('username', username);
          
        if (updateError) {
          console.error('Error updating password hash:', updateError);
        } else {
          console.log('Password hash updated successfully');
        }
        return true;
      }
      return false;
    }
    
    // Compare the provided password with the stored hash
    const isValid = await bcrypt.compare(password, data.password_hash);
    console.log('Password validation result:', isValid);
    return isValid;
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
