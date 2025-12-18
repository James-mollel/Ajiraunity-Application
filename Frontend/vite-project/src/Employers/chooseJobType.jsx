import { UserRound, Briefcase, Wrench } from "lucide-react";
import { Link } from "react-router";

export default function ChooseJobPostType() {
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="max-w-3xl w-full text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-700">
           What type of job would you like to post?
        </h2>
        <p className="text-gray-600 mt-2">
          Choose the category that matches your job.
        </p>
      </div> 

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Street Jobs Card */}
        <div className="group bg-white shadow-lg hover:shadow-2xl rounded-2xl p-8 transition-all duration-300 border border-transparent hover:border-violet-300 cursor-pointer">
          <div className="flex flex-col items-center text-center">
            <div className="bg-violet-100 text-violet-700 p-4 rounded-full mb-4 group-hover:bg-violet-200 transition">
              <Wrench size={36} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Casual & Daily Jobs (No Company Required)</h3>
              <p className="text-gray-500 mt-2 my-6">
                    Best for individuals hiring for home or casual tasks. Find skilled people like 
                   <strong> Fundi Ujenzi, Dada wa Kazi, House Cleaners, Shop Attendants, Wakulima, </strong> 
                    well digging, repairs, or <strong> Shamba helpers</strong>. No company registration needed.
              </p>
            <Link to="/dashboard-user-employer/post-normal-individual-jobs/" className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-full font-medium transition">
              Post Casual Job
            </Link>
          </div>
        </div>

        {/* Professional Jobs Card */}
        <div className="group bg-white shadow-lg hover:shadow-2xl rounded-2xl p-8 transition-all duration-300 border border-transparent hover:border-indigo-300 cursor-pointer">
          <div className="flex flex-col items-center text-center">
            <div className="bg-indigo-100 text-indigo-700 p-4 rounded-full mb-4 group-hover:bg-indigo-200 transition">
              <Briefcase size={36} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Company & Professional Hiring</h3>
              <p className="text-gray-500 mt-2 my-6">
                       Best for registered businesses, NGOs, or offices. Post formal vacancies for 
                        <strong> Accountants, Software Developers, Teachers, </strong> or 
                         <strong> Engineers</strong>. Manage professional applications and CVs.
             </p>
            <Link to="/dashboard-user-employer/confirm-company-to-post-jobs/" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full font-medium transition">
               Post Professional Job
            </Link>
          </div>
        </div>
      </div>
            <div className='text-center mt-12 mb-8 max-w-2xl mx-auto'>
                  <p className='text-sm text-gray-400 italic leading-relaxed'>
                      Whether you are an individual or a business, you can post any type of job—from 
                      casual daily work to specialized career positions. 
                      We are here to help you find the right person for the job.
                  </p>
           </div>
                
      </div>
  );
}


