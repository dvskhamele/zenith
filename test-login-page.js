// Test login page functionality

const axios = require('axios');

async function testLoginPage() {
  try {
    console.log('Testing login page...');
    
    // Test accessing the login page
    const getPage = await axios.get('http://localhost:3002/login');
    console.log('Login page loaded successfully');
    
    console.log('All login page tests passed!');
  } catch (error) {
    console.error('Login page test failed:', error.message);
  }
}

// Run the test
testLoginPage();