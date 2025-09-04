
const axios = require('axios');
const PostHog = require('posthog-node');

// Initialize PostHog client (using mock API key and host for simulation)
const posthog = new PostHog.PostHog(
  process.env.POSTHOG_API_KEY || 'phc_mock_api_key',
  {
    host: process.env.POSTHOG_API_HOST || 'http://localhost:8000',
  }
);

const simulateBulkSchedule = async () => {
  console.log('Simulating bulk schedule campaign...');

  const sheetData = [
    {
      postContent: "Simulated post 1 from sheet. #Test",
      imageUrl: "https://example.com/sim1.jpg",
      scheduledDate: "2025-09-04T10:00:00Z",
      platform: "facebook"
    },
    {
      postContent: "Simulated post 2 from sheet. #Automation",
      imageUrl: "https://example.com/sim2.jpg",
      scheduledDate: "2025-09-04T14:00:00Z",
      platform: "twitter"
    },
    {
      postContent: "Simulated post 3 from sheet. #Growth",
      imageUrl: "https://example.com/sim3.jpg",
      scheduledDate: "2025-09-05T09:00:00Z",
      platform: "instagram"
    }
  ];

  try {
    // Simulate user registration event
    const userId = `user_${Date.now()}`;
    posthog.capture({
      distinctId: userId,
      event: 'user_registered',
      properties: {
        source: 'simulated_bulk_schedule_campaign',
      },
    });
    console.log(`Simulated user registration for user: ${userId}`);

    // Simulate bulk schedule initiation
    posthog.capture({
      distinctId: userId,
      event: 'bulk_schedule_initiated',
      properties: {
        sheet_url: 'https://docs.google.com/spreadsheets/d/simulated/edit',
        sheet_name: 'SimulatedSheet',
        num_posts_in_sheet: sheetData.length,
      },
    });
    console.log('Simulated bulk schedule initiation.');

    // Simulate calling the Edge Function (even if it's not actually deployed, we simulate its success)
    // In a real scenario, this would be an actual HTTP call to the deployed function
    const simulatedEdgeFunctionResponse = {
      status: 'success',
      message: 'Posts scheduled successfully',
      postsScheduled: sheetData.length,
    };

    if (simulatedEdgeFunctionResponse.status === 'success') {
      posthog.capture({
        distinctId: userId,
        event: 'bulk_schedule_successful',
        properties: {
          posts_scheduled: simulatedEdgeFunctionResponse.postsScheduled,
          platforms: sheetData.map(d => d.platform),
        },
      });
      console.log(`Simulated bulk schedule successful. Posts scheduled: ${simulatedEdgeFunctionResponse.postsScheduled}`);

      // Simulate individual post scheduling events
      for (const post of sheetData) {
        posthog.capture({
          distinctId: userId,
          event: 'post_scheduled',
          properties: {
            platform: post.platform,
            scheduled_at: post.scheduledDate,
          },
        });
      }
      console.log('Simulated individual post scheduling events.');

    } else {
      posthog.capture({
        distinctId: userId,
        event: 'bulk_schedule_failed',
        properties: {
          error_message: simulatedEdgeFunctionResponse.message,
        },
      });
      console.log(`Simulated bulk schedule failed: ${simulatedEdgeFunctionResponse.message}`);
    }

    // Simulate conversion to paid plan for a subset of users
    if (Math.random() > 0.5) { // 50% chance of conversion
      posthog.capture({
        distinctId: userId,
        event: 'plan_selected',
        properties: { plan: 'Marketer' },
      });
      posthog.capture({
        distinctId: userId,
        event: 'subscription_started',
        properties: { plan: 'Marketer', amount: 19.00 },
      });
      console.log(`Simulated user ${userId} converted to Marketer plan.`);
    }

  } catch (error) {
    console.error('Error during simulation:', error);
  } finally {
    // Flush PostHog events before exiting
    await posthog.shutdown();
    console.log('Simulation complete.');
  }
};

simulateBulkSchedule();
