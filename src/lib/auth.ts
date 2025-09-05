import { User } from './types';

// Mock users data
const users: User[] = [
  {
    id: '1',
    email: 'admin@compliedu.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: '2',
    email: 'rgukt@example.com',
    password: 'admin123',
    role: 'institute',
    institutionId: '1'
  },
  {
    id: '3',
    email: 'vit@example.com',
    password: 'vit123',
    role: 'institute',
    institutionId: '2'
  },
  {
    id: '4',
    email: 'iit@example.com',
    password: 'iit123',
    role: 'institute',
    institutionId: '3'
  }
];

const CURRENT_USER_KEY = 'compliedu_current_user';

export const login = (email: string, password: string): User | null => {
  console.log('=== LOGIN DEBUG ===');
  console.log('Raw inputs:', { email, password });
  
  // Clean inputs
  const cleanEmail = email.trim().toLowerCase();
  const cleanPassword = password.trim();
  
  console.log('Cleaned inputs:', { cleanEmail, cleanPassword });
  console.log('Available users:');
  users.forEach((u, index) => {
    console.log(`  ${index + 1}. Email: "${u.email}" | Password: "${u.password}" | Role: "${u.role}"`);
  });
  
  const user = users.find(u => {
    const emailMatch = u.email.toLowerCase() === cleanEmail;
    const passwordMatch = u.password === cleanPassword;
    console.log(`Checking user ${u.email}: emailMatch=${emailMatch}, passwordMatch=${passwordMatch}`);
    return emailMatch && passwordMatch;
  });
  
  console.log('Found user:', user);
  
  if (user) {
    // Save to localStorage
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    console.log('User saved to localStorage:', user);
    console.log('=== LOGIN SUCCESS ===');
    return user;
  }
  
  console.log('=== LOGIN FAILED ===');
  return null;
};

export const logout = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
  console.log('User logged out');
};

export const getCurrentUser = (): User | null => {
  try {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    if (stored) {
      const user = JSON.parse(stored);
      console.log('Current user from storage:', user);
      return user;
    }
    console.log('No current user found in storage');
    return null;
  } catch (error) {
    console.error('Error reading current user:', error);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const user = getCurrentUser();
  const isAuth = user !== null;
  console.log('Is authenticated:', isAuth, user);
  return isAuth;
};

export const resetPassword = (email: string): boolean => {
  console.log('Password reset requested for:', email);
  // Mock implementation - in real app, this would send reset email
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    console.log('Password reset email would be sent to:', email);
    return true;
  }
  console.log('User not found for password reset:', email);
  return false;
};