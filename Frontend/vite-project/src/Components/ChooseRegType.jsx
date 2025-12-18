// import { useState } from "react";
// import { Link } from "react-router-dom";

// export default function ChooseRegisterType() {
//   const [selected, setSelected] = useState(""); // 'worker' or 'employer'

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-20">
//       <div className="lg:w-3/4 flex flex-col lg:flex-row gap-8">
//         {/* Worker Card */}
//         <div
//           onClick={() => setSelected("worker")}
//           className={`flex-1 p-8 rounded-2xl shadow-lg cursor-pointer transition-transform duration-300
//             ${selected === "worker" ? "border-4 border-indigo-500 scale-105" : "border border-transparent hover:scale-105"}
//             bg-white`}
//         >
//           <div className="flex items-center mb-6">
//             <div className="text-6xl lg:text-8xl font-bold text-gray-800 mr-6">1.</div>
//             <div>
//               <h2 className="text-2xl font-semibold border-b border-dashed mb-2 text-center ">Create Job Seeker Account</h2>
//               <p className="text-gray-700">Find company jobs or street gigs that match your skills with just one click!</p>
//             </div>
//           </div>
//           <Link
//             to="/register-worker"
//             className="mt-4 inline-block py-2 px-6 rounded-full bg-green-200 text-green-800 font-semibold hover:bg-green-300 transition"
//           >
//             Create Now
//           </Link>
//         </div>

//         {/* Employer Card */}
//         <div
//           onClick={() => setSelected("employer")}
//           className={`flex-1 p-8 rounded-2xl shadow-lg cursor-pointer transition-transform duration-300
//             ${selected === "employer" ? "border-4 border-indigo-500 scale-105" : "border border-transparent hover:scale-105"}
//             bg-white`}
//         >
//           <div className="flex items-center mb-6">
//             <div className="text-6xl lg:text-8xl font-bold text-gray-800 mr-6">2.</div>
//             <div>
//               <h2 className="text-2xl font-semibold border-b border-dashed mb-2 text-center">Create Employer Account</h2>
//               <p className="text-gray-700 text-center mt-3">
//                   Advertise any type of job — from office roles like <span className="font-medium">Software Developer</span> or <span className="font-medium">Accountant </span> <span className="underline" >to</span> daily street tasks such as <span className="font-medium">Mason</span>, <span className="font-medium">House Helper</span>, or <span className="font-medium">Shop Attendant</span> — and connect with the right people fast.
//              </p>
//             </div>

//           </div>
//           <Link
//             to="/register-employer"
//             className="mt-4 inline-block py-2 px-6 rounded-full bg-gradient-to-br from-indigo-200 via-violet-200 to-purple-300 text-violet-800 font-semibold hover:from-indigo-300 hover:to-purple-400 transition"
//           >
//             Create Now
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }




import { useState } from "react";
import { Link } from "react-router-dom";
import { UserCircle, Building2, Briefcase, Home } from "lucide-react"; // Optional: Use icons for faster recognition

export default function ChooseRegisterType() {
  const [selected, setSelected] = useState("");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 py-12">
      {/* Page Heading */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Join  Ajira<span className="text-blue-600">unity</span></h1>
        <p className="mt-3 text-lg text-slate-600">Choose how you want to use the platform today</p>
      </div>

      <div className="lg:w-11/12 xl:w-3/4 flex flex-col lg:flex-row gap-6">
        
        {/* Card 1: Job Seeker */}
        <div
          onClick={() => setSelected("worker")}
          className={`relative flex-1 p-8 rounded-3xl shadow-xl cursor-pointer transition-all duration-300 flex flex-col justify-between
            ${selected === "worker" ? "ring-4 ring-teal-500 scale-105 bg-white" : "bg-white/80 hover:bg-white hover:scale-[1.02] border border-slate-200"}`}
        >
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-teal-100 rounded-2xl text-teal-600">
                <UserCircle size={40} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600 bg-teal-50 px-3 py-1 rounded-full">For Job seekers</span>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-4">I want to find Work</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              One profile for everything. Apply for <span className="font-semibold text-slate-800">Professional Careers</span> or earn extra income with <span className="font-semibold text-slate-800">Street Gigs</span> like Gardening or Delivery.
            </p>
            
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Accountant</span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Gardener</span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Technician</span>
            </div>
          </div>

          <Link
            to="/register-worker"
            className={`w-full text-center py-4 rounded-xl font-bold transition-all
              ${selected === "worker" ? "bg-teal-600 text-white shadow-lg shadow-teal-200" : "bg-slate-100 text-slate-800 hover:bg-slate-200"}`}
          >
            Start Seeking Jobs
          </Link>
        </div>

        {/* Card 2: Employer */}
        <div
          onClick={() => setSelected("employer")}
          className={`relative flex-1 p-8 rounded-3xl shadow-xl cursor-pointer transition-all duration-300 flex flex-col justify-between
            ${selected === "employer" ? "ring-4 ring-indigo-500 scale-105 bg-white" : "bg-white/80 hover:bg-white hover:scale-[1.02] border border-slate-200"}`}
        >
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-indigo-100 rounded-2xl text-indigo-600">
                <Building2 size={40} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">For Employer</span>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-4">I want to Hire</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Post as a <span className="font-semibold text-slate-800">Company</span> for office roles or as an <span className="font-semibold text-slate-800">Individual</span> for local tasks like Masons, Shop Attendants, or House Helpers.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Software Dev</span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Dada wa Kazi</span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Fundi</span>
            </div>
          </div>

          <Link
            to="/register-employer"
            className={`w-full text-center py-4 rounded-xl font-bold transition-all
              ${selected === "employer" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-slate-100 text-slate-800 hover:bg-slate-200"}`}
          >
            Start Posting Jobs
          </Link>
        </div>

      </div>
      
      <p className="mt-8 text-slate-500 text-sm">
        Already have an account? <Link to="/user-login" className="text-teal-600 font-bold hover:underline">Login here</Link>
      </p>
    </div>
  );
}