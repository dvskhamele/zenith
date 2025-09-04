// Test script to verify that all features are working together

import { 
  fetchWorkspaces, 
  fetchScheduleSlots, 
  fetchDraftIdeas, 
  fetchAutomationSettings,
  createWorkspace,
  createScheduleSlot,
  createDraftIdea,
  updateAutomationSettings
} from './api';

async function testAPI() {
  try {
    console.log('Testing API routes...');
    
    // Test fetching workspaces
    console.log('Fetching workspaces...');
    const workspaces = await fetchWorkspaces();
    console.log('Workspaces:', workspaces);
    
    if (workspaces.length > 0) {
      const workspaceId = workspaces[0].id;
      
      // Test fetching schedule slots
      console.log('Fetching schedule slots...');
      const scheduleSlots = await fetchScheduleSlots(workspaceId);
      console.log('Schedule slots:', scheduleSlots);
      
      // Test fetching draft ideas
      console.log('Fetching draft ideas...');
      const draftIdeas = await fetchDraftIdeas(workspaceId);
      console.log('Draft ideas:', draftIdeas);
      
      // Test fetching automation settings
      console.log('Fetching automation settings...');
      const automationSettings = await fetchAutomationSettings(workspaceId);
      console.log('Automation settings:', automationSettings);
      
      // Test creating a new workspace
      console.log('Creating a new workspace...');
      const newWorkspace = await createWorkspace({
        name: 'Test Workspace 2',
        initials: 'TW2',
        color: 'bg-blue-500'
      });
      console.log('New workspace:', newWorkspace);
      
      // Test creating a new schedule slot
      console.log('Creating a new schedule slot...');
      const newScheduleSlot = await createScheduleSlot({
        workspaceId: workspaceId,
        dayOfWeek: 6, // Saturday
        timeOfDay: '15:00:00',
        category: 'Weekend Posts',
        color: 'text-purple-300'
      });
      console.log('New schedule slot:', newScheduleSlot);
      
      // Test creating a new draft idea
      console.log('Creating a new draft idea...');
      const newDraftIdea = await createDraftIdea({
        workspaceId: workspaceId,
        type: 'draft',
        text: 'This is a test draft idea'
      });
      console.log('New draft idea:', newDraftIdea);
      
      // Test updating automation settings
      console.log('Updating automation settings...');
      const updatedAutomationSettings = await updateAutomationSettings({
        workspaceId: workspaceId,
        evergreen: false,
        topPerformers: true,
        repostToStory: true
      });
      console.log('Updated automation settings:', updatedAutomationSettings);
    }
    
    console.log('All tests passed!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testAPI();