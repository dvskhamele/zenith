export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center p-8 bg-slate-800 rounded-xl">
        <h1 className="text-3xl font-bold text-white mb-4">Server is Running!</h1>
        <p className="text-gray-300 mb-6">The Next.js development server is working correctly.</p>
        <a 
          href="/dashboard?tab=calendar" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg inline-block"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}