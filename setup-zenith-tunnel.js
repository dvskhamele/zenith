const localtunnel = require('localtunnel');

async function startZenithTunnel() {
  try {
    console.log('Setting up localtunnel with zenith-signimus subdomain on port 3001...');
    
    const tunnel = await localtunnel({ 
      port: 3001,
      subdomain: 'zenith-signimus'
    });
    
    console.log('LocalTunnel URL:', tunnel.url);
    console.log('Facebook OAuth should now work with this URL');
    console.log('Make sure to use https://zenith-signimus.loca.lt/auth/callback in Supabase dashboard');
    
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
    console.log('The zenith-signimus subdomain might require a password or be unavailable.');
    console.log('If you have a password, please enter it when prompted.');
  }
}

startZenithTunnel();