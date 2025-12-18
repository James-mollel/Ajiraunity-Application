

import { Briefcase, Wrench, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ChooseWorkerTypePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex flex-col items-center justify-center px-4 py-10">
      
      {/* Header */}
      <div className="max-w-3xl w-full text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
          What are your <span className="text-indigo-600">Skills?</span>
        </h2>
        <p className="text-gray-600 mt-4 text-lg">
          AjiraUnity lets you build two sides of your profile. Choose where you want to start filling in your details.
        </p>
      </div> 

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        
        {/* Street Jobs Card */}
        <div className="group bg-white shadow-xl hover:shadow-2xl rounded-3xl p-8 transition-all duration-300 border-2 border-transparent hover:border-violet-400 flex flex-col justify-between">
          <div className="flex flex-col items-center text-center">
            <div className="bg-violet-100 text-violet-700 p-5 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
              <Wrench size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Skilled Trade & Street Jobs</h3>
            <p className="text-gray-500 mt-3 mb-4 leading-relaxed">
              For hands-on skills like <strong>Masonry, Gardening, Shop attendant,</strong> or <strong>Technical repairs</strong>.
            </p>
            {/* Added Example Tags */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="text-[10px] bg-violet-50 text-violet-600 px-2 py-1 rounded-md font-bold uppercase">Fundi</span>
              <span className="text-[10px] bg-violet-50 text-violet-600 px-2 py-1 rounded-md font-bold uppercase">Mkulima</span>
              <span className="text-[10px] bg-violet-50 text-violet-600 px-2 py-1 rounded-md font-bold uppercase">Dada wa kazi</span>
            </div>
          </div>
          <Link to="/dashboard-user-job-seeker/normal-worker-profile/" 
            className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white w-full py-3 rounded-xl font-bold transition">
            Build Casual Profile <ArrowRight size={18} />
          </Link>
        </div>

        {/* Professional Jobs Card */}
        <div className="group bg-white shadow-xl hover:shadow-2xl rounded-3xl p-8 transition-all duration-300 border-2 border-transparent hover:border-indigo-400 flex flex-col justify-between">
          <div className="flex flex-col items-center text-center">
            <div className="bg-indigo-100 text-indigo-700 p-5 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
              <Briefcase size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Professional Careers</h3>
            <p className="text-gray-500 mt-3 mb-4 leading-relaxed">
              For roles requiring <strong>Certificates, Degrees,</strong> or <strong>Specialized Office Experience</strong>.
            </p>
            {/* Added Example Tags */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md font-bold uppercase">Accountant</span>
              <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md font-bold uppercase">Teacher</span>
              <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md font-bold uppercase">IT Expert</span>
            </div>
          </div>
          <Link to="/dashboard-user-job-seeker/professional-worker-profile/" 
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white w-full py-3 rounded-xl font-bold transition">
            Build Professional Profile <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <div className='text-center mt-12 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200'>
        <p className='text-sm text-gray-600'>
          💡 <strong>Pro-Tip:</strong> You can complete one profile now and add the other later.
        </p>
      </div>  
    </div>
  );
}