// Test registration and login functionality

import { registerUser, loginUser, getCurrentUser, logoutUser } from './auth';

async function testAuth() {
  try {
    console.log('Testing registration...');
    
    // Register a new user
    const registerResult = await registerUser('test@example.com', 'password123');
    console.log('Registration result:', registerResult);
    
    console.log('Testing login...');
    
    // Login with the same user
    const loginResult = await loginUser('test@example.com', 'password123');
    console.log('Login result:', loginResult);
    
    console.log('Testing get current user...');
    
    // Get current user
    const currentUser = await getCurrentUser();
    console.log('Current user:', currentUser);
    
    console.log('Testing logout...');
    
    // Logout
    const logoutResult = await logoutUser();
    console.log('Logout result:', logoutResult);
    
    console.log('All authentication tests passed!');
  } catch (error) {
    console.error('Authentication test failed:', error);
  }
}

// Run the test
testAuth();