export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
      <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">Loading...</h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2">Please wait while we check the API status</p>
    </div>
  );
} 