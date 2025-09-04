import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker'; // For simulating realistic-looking data

// Supabase connection details
const SUPABASE_URL = 'http://localhost:8000';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNzY1NDQ0NCwiZXhwIjoxOTMzMDE0NDQ0fQ.0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function collectUGC() {
  console.log('Starting UGC collection...');

  const campaignHashtags = ["#MyWebAppCreation"]; // From the directive

  for (const hashtag of campaignHashtags) {
    console.log(`Simulating social media scan for hashtag: "${hashtag}"`);
    // In a real scenario, this would interact with social media APIs (e.g., Twitter, Instagram).
    // For now, we simulate finding some posts.
    const numPosts = faker.number.int({ min: 0, max: 3 }); // Simulate finding 0 to 3 posts

    for (let i = 0; i < numPosts; i++) {
      const postContent = faker.lorem.sentence(20) + ` ${hashtag}`;
      const author = faker.internet.userName();
      const platform = faker.helpers.arrayElement(["Twitter", "Instagram", "Facebook"]);

      const newUGC = {
        post_content: postContent,
        hashtag: hashtag,
        author: author,
        platform: platform,
        status: 'Pending' // Initial status
      };

      const { data, error } = await supabase
        .from('ugc_submissions')
        .insert([newUGC]);

      if (error) {
        console.error('Error inserting UGC:', error.message);
      } else {
        console.log(`Collected UGC: "${newUGC.post_content}"`);
      }
    }
  }
  console.log('UGC collection complete.');
}

collectUGC();
