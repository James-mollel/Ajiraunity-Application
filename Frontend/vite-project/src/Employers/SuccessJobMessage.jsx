import { Link } from 'react-router';
import { CheckCircle, Plus } from 'lucide-react';



export default function JobPostedSuccessMessage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 sm:p-10 text-center transform transition duration-500 hover:shadow-3xl hover:scale-[1.01] border-t-8 border-green-500">
                
                {/* Success Icon */}
                <div className="mb-6">
                    <CheckCircle className="mx-auto h-20 w-20 text-green-500 animate-pulse-slow" />
                </div>
                
                {/* Main Message */}
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                    Success!
                </h1>
                <p className="text-xl text-gray-600 mb-10">
                    Your job listing has been created successfully.
                </p>

                {/* Action Buttons */}
                <div className="space-y-4">
                    
                    {/* View Job Link - Primary Action */}
                    <Link 
                        to="/dashboard-user-employer/all-employers-jobs-posted/"
                        className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-[1.02] active:scale-100"
                    >
                        View it now
                    </Link>

                    {/* Post Another Link - Secondary Action */}
                    <Link 
                        to="/dashboard-user-employer/choose-kind-post-jobs"
                        className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Post another job
                    </Link>
                </div>
            </div>
        </div>
    );
}