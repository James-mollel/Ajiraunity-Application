import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <AlertCircle size={80} className="text-teal-600" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mb-6">Page Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Oops! The page you are looking for doesn't exist or has been moved. 
          Return to the home page to continue searching for opportunities.
        </p>
        <Link
          to="/"
          className="px-8 py-3 bg-teal-600 text-white rounded-full font-bold shadow-lg hover:bg-teal-700 transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}