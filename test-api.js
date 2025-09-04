// Simple test script using fetch API

async function testAPI() {
  try {
    console.log('Testing API routes...');
    
    // Test fetching workspaces
    console.log('Fetching workspaces...');
    const workspacesResponse = await fetch('http://localhost:3001/api/workspaces');
    const workspaces = await workspacesResponse.json();
    console.log('Workspaces:', workspaces);
    
    if (workspaces.length > 0) {
      const workspaceId = workspaces[0].id;
      
      // Test fetching schedule slots
      console.log('Fetching schedule slots...');
      const scheduleSlotsResponse = await fetch(`http://localhost:3001/api/schedule-slots?workspaceId=${workspaceId}`);
      const scheduleSlots = await scheduleSlotsResponse.json();
      console.log('Schedule slots:', scheduleSlots);
      
      // Test fetching draft ideas
      console.log('Fetching draft ideas...');
      const draftIdeasResponse = await fetch(`http://localhost:3001/api/draft-ideas?workspaceId=${workspaceId}`);
      const draftIdeas = await draftIdeasResponse.json();
      console.log('Draft ideas:', draftIdeas);
      
      // Test fetching automation settings
      console.log('Fetching automation settings...');
      const automationSettingsResponse = await fetch(`http://localhost:3001/api/automation-settings?workspaceId=${workspaceId}`);
      const automationSettings = await automationSettingsResponse.json();
      console.log('Automation settings:', automationSettings);
    }
    
    console.log('All tests passed!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testAPI();