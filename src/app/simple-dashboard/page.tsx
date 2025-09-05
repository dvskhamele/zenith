'use client';

// Reuse the fully styled Simple Dashboard component used inside /dashboard
// to ensure Tailwind styles and the complete UI are applied here as well.
import SimpleDashboardView from '@/app/dashboard/simple-dashboard';

export default function SimpleDashboardPage() {
  return <SimpleDashboardView />;
}
