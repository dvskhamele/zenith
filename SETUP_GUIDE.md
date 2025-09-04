## Psyche-Architect: Next.js Implementation - Setup and Execution Guide

This document outlines the steps required to set up and run the Psyche-Architect system, implemented using Next.js API routes and a local Supabase instance.

### 1. Apply the Database Schema

First, you need to apply the database schema to your local Supabase instance. The SQL for creating the necessary tables (`keyword_patterns`, `data_source`, `ugc_submissions`) is located in:

`/Users/test/Startups/zenith/supabase/schema.sql`

**Action:** Open your Supabase Studio (usually at `http://localhost:54323` after running `supabase start`) or use the `supabase psql` command-line tool to execute the SQL commands in `schema.sql`.

### 2. Set Up Environment Variables

Create a `.env.local` file in the root of your project (`/Users/test/Startups/zenith/.env.local`) and populate it with the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
POSTHOG_API_KEY=phc_fCgSHCQAoCzBIKGttKYCeCOGa0CFA9tUjY8gS0RBmrJ
POSTHOG_API_HOST=https://eu.i.posthog.com
```

**Important Notes:**
*   **`NEXT_PUBLIC_SUPABASE_ANON_KEY`**: This key is generated when your local Supabase instance starts. You will need to obtain it by running `npx supabase status` (once your Supabase instance is running) and replace `YOUR_SUPABASE_ANON_KEY` with the actual value.
*   **`GEMINI_API_KEY`**: Replace `YOUR_GEMINI_API_KEY` with one of the Gemini API keys from your `project.config` file (e.g., `AIzaSyC-co9l3A-6GYHyYK8sG0yMC0E_-LTbAdw`).

### 3. Install Dependencies

Navigate to your project root (`/Users/test/Startups/zenith`) in your terminal and install the new dependencies:

```bash
npm install
# or
yarn install
```

### 4. Start Local Supabase Instance

Ensure your local Supabase instance is running. You typically start it from your project root:

```bash
npx supabase start
```

**Note:** If you encounter issues starting Supabase (e.g., `spawn bash ENOENT`), you may need to ensure the Supabase CLI is correctly installed and configured in your system's PATH. This is an external dependency that needs to be resolved for the local database to function.

### 5. Start the Next.js Development Server

From your project root, start the Next.js development server:

```bash
npm run dev
# or
yarn dev
```

This will typically start the server on `http://localhost:3001`.

### 6. Trigger the Perpetual Growth Orchestrator

Once both your Next.js development server and local Supabase instance are running, you can trigger the simulated perpetual growth loop by accessing the orchestrator API route. Open your web browser or use `curl` to hit the endpoint:

```
http://localhost:3001/api/perpetual-growth-orchestrator
```

This will initiate a simulated run of the pSEO, UGC, and Analytics modules. In a real deployment, this orchestrator would be triggered by a cron job or a serverless scheduler.

This concludes the setup and execution guide for the Psyche-Architect system.