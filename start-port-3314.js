const { spawn } = require('child_process');

// Start the Next.js development server on port 3314
const nextServer = spawn('npx', ['next', 'dev', '-p', '3314'], {
  stdio: 'inherit',
  shell: true
});

console.log('Starting Next.js development server on port 3314...');

// Handle server exit
nextServer.on('exit', (code) => {
  console.log(`Next.js server exited with code ${code}`);
});