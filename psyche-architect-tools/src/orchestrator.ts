import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// Paths to the compiled JavaScript files
const SCRIPT_PATHS = {
  setupDatabase: './dist/setup-database.js',
  keywordDiscoverer: './dist/keyword-discoverer.js',
  contentGenerator: './dist/content-generator.js',
  ugcCollector: './dist/ugc-collector.js',
  ugcCurator: './dist/ugc-curator.js',
  analyticsCore: './dist/analytics-core.js',
  researcher: './dist/researcher.js', // Will be created next
};

async function runScript(scriptPath: string) {
  console.log(`\n--- Executing ${scriptPath} ---`);
  try {
    const { stdout, stderr } = await execPromise(`node ${scriptPath}`);
    console.log(stdout);
    if (stderr) {
      console.error(`Errors from ${scriptPath}:`, stderr);
    }
  } catch (error: any) {
    console.error(`Failed to execute ${scriptPath}:`, error.message);
    if (error.stdout) console.error('Stdout:', error.stdout);
    if (error.stderr) console.error('Stderr:', error.stderr);
  }
  console.log(`--- Finished ${scriptPath} ---`);
}

async function perpetualGrowthAndEvolutionLoop() {
  console.log("PHASE 2: PERPETUAL GROWTH & EVOLUTION - Initiating Infinite Loop (Simulated)");

  // Initial database setup (run once)
  console.log("\n--- Running initial database setup ---");
  await runScript(SCRIPT_PATHS.setupDatabase);

  // Simulate a few cycles of the perpetual loop
  for (let cycle = 1; cycle <= 3; cycle++) { // Run for 3 cycles to demonstrate
    console.log(`\n--- PERPETUAL GROWTH & EVOLUTION CYCLE ${cycle} ---
`);

    // EXECUTE - pSEO Engine
    await runScript(SCRIPT_PATHS.keywordDiscoverer);
    await runScript(SCRIPT_PATHS.contentGenerator);

    // EXECUTE - UGC Flywheel
    await runScript(SCRIPT_PATHS.ugcCollector);
    await runScript(SCRIPT_PATHS.ugcCurator);

    // MEASURE & ADAPT - Analytics Core
    await runScript(SCRIPT_PATHS.analyticsCore);

    // RESEARCH & EVOLVE - Metacognitive Loop
    await runScript(SCRIPT_PATHS.researcher);

    console.log(`--- End of PERPETUAL GROWTH & EVOLUTION CYCLE ${cycle} ---
`);
    if (cycle < 3) {
      console.log("Sleeping for a simulated period before next cycle...");
      // In a real deployment, this would be managed by a scheduler (e.g., cron, Kubernetes cron job)
      // For demonstration, we just log the sleep.
      await new Promise(resolve => setTimeout(resolve, 5000)); // Simulate 5 seconds delay
    }
  }

  console.log("\nPHASE 2: PERPETUAL GROWTH & EVOLUTION - Simulated loop finished. In a real deployment, this would run perpetually.");
}

perpetualGrowthAndEvolutionLoop();
