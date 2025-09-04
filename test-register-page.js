// Test registration page functionality

const axios = require('axios');

async function testRegistrationPage() {
  try {
    console.log('Testing registration page...');
    
    // Test accessing the registration page
    const getPage = await axios.get('http://localhost:3002/register');
    console.log('Registration page loaded successfully');
    
    console.log('All registration page tests passed!');
  } catch (error) {
    console.error('Registration page test failed:', error.message);
  }
}

// Run the test
testRegistrationPage();