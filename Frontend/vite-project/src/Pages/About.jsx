// import React from 'react';
// import { Briefcase, Users, MapPin, Zap, RefreshCw, Layers } from 'lucide-react'; 

// export default function AboutUs() {
//     return (
//         <div className="bg-gray-50 py-16 sm:py-24">
//             <h2>About AjiraUnity</h2>
//             <p>Who We Are</p>
//             <p>
//                 AjiraUnity is an inclusive job platform built to serve everyone 
//                 with an opportunity and everyone looking for work — regardless of
//                  company ownership, education level, or job type.
//             </p>
//             <p>
//                 Unlike traditional job boards that limit job posting to 
//                 registered companies only, AjiraUnity is designed for real life in Tanzania.
//                  We believe that opportunities come from companies, individuals, families, farms, 
//                  workshops, and communities — and all of 
//                 them deserve a place to connect with job seekers.  
//             </p>
//             <h3>
//                  Our Mission
//             </h3>
//             <p>
//                 To bridge the gap between formal (professional) 
//                 and informal (casual/daily) job markets by providing one trusted
//                  platform where opportunities are
//                  visible, accessible, and fair for all.
//             </p>
//             <h2>
//                    What Makes AjiraUnity Different
//             </h2>
//               <p>1. Opportunities Without Barriers</p>
//                <p>At AjiraUnity, having a company is not a requirement to post a job.</p>
//                <span>A large organization like a telecom company can post professional 
//                 roles after company verification.
//                 </span>

//                 <span>An individual without a registered company — a shop owner, farmer, fundi, or household
//                      employer — can still post casual or street jobs easily.
//                 </span>
//                   <span>If you have work to offer, AjiraUnity gives you a voice.</span>


//                   <h2>
//                       2. Two Types of Job Posting
//                   </h2>
//                   <span>Company-Based (Professional) Jobs</span>

//                   <span>
//                     For employers with registered companies or institutions
//                     </span>
//                     <span>

//                       Requires company details and verification
//                   </span>
//                   <ul>
//                     <li>Suitable for roles such as:

//                         Accountants

//                         Software Developers

//                         Teachers

//                         Doctors

//                         Office and corporate positions
//                         </li>
//                   </ul>
//                   <p>Individual (Casual / Informal) Jobs</p>

//                   <span>For individuals or small employers without companies

//                      No company details required</span>

//                      <p>
//                         Suitable for roles such as:

//                             Dada wa kazi za nyumbani

//                             Muuzaji duka

//                             Fundi wa ujenzi (mwashi)

//                             Msaidizi wa fundi

//                             Wakulima wa shamba

//                             Gardeners and daily workers
//                      </p>

//                      <h3>
//                         Jobs can be posted with exact locations across Tanzania, including Dar es Salaam, ilala,  Dodoma udom, Arusha Arusha city Olasiti, and beyond.
//                      </h3>

//                      <h3>
//                         Designed for Real Job Seekers

// AjiraUnity understands that people are more than one skill.

// A job seeker may be:

// A trained Software Developer looking for professional work

// Also skilled as a Gardener and available on weekends

// With AjiraUnity, one profile can:

// Switch between professional career jobs and casual or street jobs

// Set availability (daily, weekends, part-time)

// Explore opportunities that match both skills and current needs

// Education level is not a barrier. Skills, availability, and willingness to work matter.
//                      </h3>


//                      <h4>
//                         Who AjiraUnity Is For

// Employers with companies

// Individuals with short-term or daily work opportunities

// Skilled professionals

// Casual and informal workers

// Students seeking weekend or part-time work

// Anyone looking for honest work or honest workers
//                      </h4>


//                      <h5>

//                         Our Vision

// We envision a Tanzania where:

// No opportunity goes unseen

// No skill is wasted

// Everyone has access to work — from street to suite

// AjiraUnity is not just a job board. It is a community built around opportunity, dignity, and inclusion.
//                      </h5>

//                      <small>AjiraUnity — Opportunities for Everyone.</small>







             
//         </div>
//     );
// }




import React from 'react';
import { Briefcase, Users, MapPin, Zap, RefreshCw, Layers, HeartHandshake, Target } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="bg-gray-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            About AjiraUnity
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            An Inclusive job platform — connecting opportunities from streets to suites, 
            for everyone, regardless of company, education, or job type.
          </p>
        </div>

        {/* Who We Are */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6 text-center">Who We Are</h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto text-center">
            AjiraUnity is built for real life in Tanzania. While traditional job boards only allow registered companies to post jobs, 
            we believe opportunities come from everywhere: big corporations, small shops, farms, homes, workshops, and individuals.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto text-center mt-4">
            Whether you're a telecom giant posting professional roles or a homeowner needing a gardener this weekend — 
            AjiraUnity gives everyone a voice.
          </p>
        </section>

        {/* Mission */}
        <section className="bg-white rounded-2xl shadow-sm py-12 px-8 mb-20">
          <div className="flex items-center justify-center mb-8">
            <Target className="w-12 h-12 text-blue-600 mr-4" />
            <h2 className="text-3xl font-semibold text-gray-900">Our Mission</h2>
          </div>
          <p className="text-xl text-gray-700 text-center max-w-3xl mx-auto">
            To bridge the gap between formal professional jobs and informal daily opportunities, 
            creating one trusted platform where work is visible, accessible, and fair for all Tanzanians.
          </p>
        </section>

        {/* What Makes Us Different - Grid */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold text-gray-900 mb-12 text-center">
            What Makes AjiraUnity Different
          </h2>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Card 1: No Barriers */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="flex items-center mb-6">
                <Zap className="w-10 h-10 text-green-600 mr-4" />
                <h3 className="text-2xl font-semibold">Opportunities Without Barriers</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Anyone with work to offer can post — no company registration required.
              </p>
              <ul className="mt-4 space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Large companies can post verified professional roles
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Individuals, farmers, shop owners, or households can post casual/daily jobs instantly
                </li>
              </ul>
            </div>

            {/* Card 2: Two Types of Jobs */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="flex items-center mb-6">
                <Layers className="w-10 h-10 text-blue-600 mr-4" />
                <h3 className="text-2xl font-semibold">Two Ways to Post Jobs</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-lg mb-2">Company-Based (Professional)</h4>
                  <p className="text-gray-600 text-sm">Requires verification</p>
                  <p className="text-gray-700 mt-1">Accountants • Software Developers • Teachers • Doctors • Corporate roles</p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Individual (Casual / Street Jobs)</h4>
                  <p className="text-gray-600 text-sm">No company needed</p>
                  <p className="text-gray-700 mt-1">
                    Dada wa nyumbani • Mfanyakazi duka • Fundi (mwashi) • Mkulima • Gardener • Msaidizi wa fundi
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Location Highlight */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center bg-blue-50 px-6 py-4 rounded-full">
              <MapPin className="w-6 h-6 text-blue-600 mr-3" />
              <p className="text-lg font-medium text-blue-900">
                Jobs posted with precise locations across Tanzania — from Ilala to Olasiti, Dodoma to Arusha
              </p>
            </div>
          </div>
        </section>

        {/* For Job Seekers */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl py-14 px-8 mb-20">
          <div className="max-w-4xl mx-auto text-center">
            <RefreshCw className="w-14 h-14 mx-auto mb-6" />
            <h2 className="text-3xl font-semibold mb-6">Designed for Real Job Seekers</h2>
            <p className="text-xl leading-relaxed">
              One profile. Multiple possibilities.
            </p>
            <p className="text-lg mt-4 opacity-90">
              A software developer by profession might also be a skilled gardener available on weekends.<br />
              With AjiraUnity, you can switch between professional and casual job searches, set your availability, 
              and find work that fits your life — no matter your education level.
            </p>
          </div>
        </section>

        {/* Who It's For */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold text-gray-900 mb-10 text-center">Who AjiraUnity Is For</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              "Employers with registered companies",
              "Individuals offering daily or casual work",
              "Professional job seekers",
              "Casual and informal workers",
              "Students seeking part-time/weekend jobs",
              "Anyone seeking honest work or honest workers"
            ].map((item) => (
              <div key={item} className="flex items-center bg-white rounded-lg shadow p-6">
                <Users className="w-8 h-8 text-blue-600 mr-4 flex-shrink-0" />
                <p className="text-gray-800 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Vision */}
        <section className="text-center">
          <HeartHandshake className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Our Vision</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            A Tanzania where no opportunity goes unseen, no skill is wasted, and everyone — 
            from street to suite — has fair access to dignified work.
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-10">
            AjiraUnity — Opportunities for Everyone.
          </p>
        </section>
      </div>
    </div>
  );
}