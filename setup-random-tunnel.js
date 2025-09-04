const localtunnel = require('localtunnel');

async function startTunnel() {
  try {
    console.log('Setting up localtunnel on port 3001...');
    
    // Don't specify a subdomain to get a random one
    const tunnel = await localtunnel({ 
      port: 3001
    });
    
    console.log('LocalTunnel URL:', tunnel.url);
    console.log('Facebook OAuth should now work with this URL');
    console.log('Use this URL for Facebook OAuth redirect in Supabase dashboard');
    
    // Handle tunnel close
    tunnel.on('close', () => {
      console.log('LocalTunnel closed');
    });
    
    // Keep the process alive
    process.on('SIGINT', () => {
      console.log('Closing tunnel...');
      tunnel.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('Error setting up localtunnel:', error);
  }
}

startTunnel();