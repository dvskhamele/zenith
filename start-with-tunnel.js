const { spawn } = require('child_process');
const localtunnel = require('localtunnel');

// Start the Next.js development server on a different port
const nextServer = spawn('npx', ['next', 'dev', '-p', '3003'], {
  stdio: 'inherit',
  shell: true
});

console.log('Starting Next.js development server on port 3003...');

// When the server is ready, start localtunnel
nextServer.on('spawn', async () => {
  console.log('Next.js server started. Setting up localtunnel...');
  
  // Retry mechanism for localtunnel
  const setupTunnel = async (retries = 5) => {
    for (let i = 0; i < retries; i++) {
      try {
        // Wait a bit for the server to start
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const tunnel = await localtunnel({ 
          port: 3003,
          subdomain: 'zenith-signimus' // This should match the redirect URL in auth.ts
        });
        
        console.log('LocalTunnel URL:', tunnel.url);
        console.log('Facebook OAuth should now work with this URL');
        
        // Handle tunnel close
        tunnel.on('close', () => {
          console.log('LocalTunnel closed');
        });
        
        return;
      } catch (error) {
        console.error(`Error setting up localtunnel (attempt ${i + 1}/${retries}):`, error.message);
        if (i < retries - 1) {
          console.log('Retrying in 3 seconds...');
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
    }
    console.error('Failed to set up localtunnel after all retries');
  };
  
  setupTunnel();
});

// Handle server exit
nextServer.on('exit', (code) => {
  console.log(`Next.js server exited with code ${code}`);
});