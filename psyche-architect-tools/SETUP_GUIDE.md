## Psyche-Architect: Docker & TypeScript Implementation - Setup and Execution Guide

### Understanding the Existing Zenith Application Architecture

Before diving into the Psyche-Architect system, it's important to understand the existing Zenith application. This analysis ensures that the autonomous growth engine operates in harmony with the current project's structure and goals.

**Zenith Project Overview:**
*   **Project Name**: Zenith, a minimalist social media management platform.
*   **Core Technologies**: Next.js (React, TypeScript), Tailwind CSS for styling.
*   **Backend Services**: Utilizes Supabase for database and authentication, PostHog for analytics, and Resend for email services. Sanity.io is also used for content management.
*   **Application Structure**: Follows a typical Next.js App Router structure with dedicated directories for `app` (pages and API routes), `components` (reusable React components), `context` (React Context API for state management), `lib` (utility functions and API integrations), and `types` (TypeScript type definitions). The `src/app` directory contains numerous feature-specific modules (e.g., `ai-assistant`, `dashboard`, `login`, `register`).
*   **Growth Strategy**: Emphasizes a product-led growth model, focusing heavily on SEO, content marketing, user psychology, and leveraging user-generated content for virality. The primary objective is to achieve a sustainable user base of 1,000 daily active users.

**Architectural Sanctity (Crucial Principle):**
As Psyche-Architect, my operational scope is strictly confined to my own generated tools and marketing assets within my local, serverless architecture. I am **forbidden from modifying any files within the existing Zenith application codebase**. All components of the Psyche-Architect system (Docker Compose setup, TypeScript scripts, etc.) reside in the `psyche-architect-tools` directory, separate from the main application.

This document outlines the steps required to set up and run the Psyche-Architect system, implemented using Docker-compose for local services and TypeScript scripts.

### 1. Navigate to the Psyche-Architect Tools Directory

Open your terminal and navigate to the newly created `psyche-architect-tools` directory:

```bash
cd /Users/test/Startups/zenith/psyche-architect-tools
```

### 2. Start Local Infrastructure Services (Docker Compose)

This will spin up Supabase, PostHog, and Ghost using Docker. Ensure Docker Desktop is running.

```bash
docker compose up -d
```

This command will start the following services:
*   **Supabase**: PostgreSQL (port 5432), Kong API Gateway (ports 8000, 8443, 8001, 8444), Auth, Storage, Realtime, and Functions (port 54321).
*   **PostHog**: Web UI (port 8000), PostgreSQL, and Redis.
*   **Ghost**: CMS UI (port 2368) and PostgreSQL.

### 3. Install Node.js Dependencies

Install the required Node.js packages for the TypeScript tools:

```bash
npm install
```

### 4. Compile TypeScript to JavaScript

Compile all TypeScript source files into JavaScript:

```bash
npm run build
```

This will create a `dist` directory containing the compiled JavaScript files.

### 5. Set Up Supabase Database Tables

Once your Docker services are running, execute the `setup-database` script to create the necessary tables in your local Supabase instance:

```bash
npm run start:setup-db
```

**Note:** This script assumes a permissive environment or that you have set up a custom `execute_sql` RPC function in Supabase. In a production environment, database schema management is typically handled via migrations.

### 6. Set Environment Variables

Create a `.env` file in the `psyche-architect-tools` directory and populate it with your API keys:

```
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
POSTHOG_API_KEY=YOUR_POSTHOG_API_KEY
SUPABASE_URL=http://localhost:8000
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNzY1NDQ0NCwiZXhwIjoxOTMzMDE0NDQ0fQ.0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J_0_J
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
GHOST_CONTENT_API_KEY=YOUR_GHOST_CONTENT_API_KEY
```

**Important Notes:**
*   **`GEMINI_API_KEY`**: Obtain this from your Google AI Studio. You can use one from your `project.config` (e.g., `AIzaSyC-co9l3A-6GYHyYK8sG0yMC0E_-LTbAdw`).
*   **`POSTHOG_API_KEY`**: Obtain this from your PostHog instance settings (e.g., `phc_fCgSHCQAoCzBIKGttKYCeCOGa0CFA9tUjY8gS0RBmrJ`).
*   **`SUPABASE_SERVICE_ROLE_KEY`**: This key is highly sensitive and should be kept secret. You can find it in your Supabase project settings under API Keys. For local development, you might use a default one or generate a new one.
*   **`GHOST_CONTENT_API_KEY`**: Obtain this from your Ghost Admin settings (Integrations -> Custom Integrations).

### 7. Deploy Supabase Edge Function Trigger (Manual Step)

To enable the `curated-ugc-webhook` Edge Function, you need to deploy it to your local Supabase instance and set up a database trigger. The SQL for the trigger is located in:

`/Users/test/Startups/zenith/psyche-architect-tools/supabase/triggers/curated_ugc_trigger.sql`

**Action:** Execute the SQL commands in `curated_ugc_trigger.sql` in your Supabase Studio SQL Editor. Ensure the `net` extension is enabled in your Supabase project.

### 8. Run the Perpetual Growth Orchestrator

Finally, execute the orchestrator script to start the simulated perpetual growth loop:

```bash
npm run start:orchestrator
```

This will run a few cycles of the core marketing modules: pSEO, UGC, and Analytics. The system is designed to continuously make the best continued decisions for marketing and user acquisition within this phase. The "Research & Evolve" metacognitive loop is not automatically triggered; it will only be initiated if explicitly instructed. In a real deployment, this orchestrator would be managed by a persistent process manager or a cron job.

### Accessing UIs:
*   **Supabase Studio**: `http://localhost:54323`
*   **PostHog**: `http://localhost:8000`
*   **Ghost CMS**: `http://localhost:2368`

This concludes the setup and execution guide for the Psyche-Architect system.