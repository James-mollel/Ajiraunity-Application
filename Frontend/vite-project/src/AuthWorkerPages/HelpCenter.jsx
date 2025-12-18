// import { useState } from "react";
// import { Search, ChevronDown } from "lucide-react";

// export default function HelpCenter() {
//   const [openIndex, setOpenIndex] = useState(null);
//   const faqs = [
//     {
//       question: "How do I create an account?",
//       answer:
//         "Click on the Sign Up button, choose whether you are a Job Seeker or Employer, and fill in your details. You’ll receive a verification email to activate your account.",
//     },
//     {
//       question: "How can I apply for a job?",
//       answer:
//         "Once logged in as a Job Seeker, browse the available jobs and click Apply on any listing that fits your skills and location.",
//     },
//     {
//       question: "How do employers post jobs?",
//       answer:
//         "Employers can go to their dashboard, click Post a Job, and fill out details like job title, category, location, and description. Once submitted, the job becomes visible to seekers.",
//     },
//     {
//       question: "Is this platform for formal or informal jobs?",
//       answer:
//         "Both! You can find and post professional company roles like Accountants or Developers, as well as individual or street jobs such as Fundi, Housekeeper, Builder, or Farming work.",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4">
//       <div className="max-w-4xl mx-auto text-center">
//         <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Help Center</h1>
//         <p className="text-gray-600 mb-8">
//           Find quick answers, helpful guides, and support to make the most of your experience.
//         </p>

//         {/* Search bar */}
//         <div className="relative max-w-md mx-auto mb-12">
//           <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
//           <input
//             type="text"
//             placeholder="Search for help..."
//             className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* FAQ Section */}
//         <div className="text-left bg-white shadow-sm rounded-2xl divide-y divide-gray-200">
//           {faqs.map((faq, i) => (
//             <div key={i}>
//               <button
//                 onClick={() => setOpenIndex(openIndex === i ? null : i)}
//                 className="w-full flex justify-between items-center text-left px-6 py-4 hover:bg-gray-50"
//               >
//                 <span className="font-medium text-gray-800">{faq.question}</span>
//                 <ChevronDown
//                   className={`w-5 h-5 text-gray-500 transform transition-transform ${
//                     openIndex === i ? "rotate-180" : ""
//                   }`}
//                 />
//               </button>
//               {openIndex === i && (
//                 <div className="px-6 pb-4 text-gray-600 text-sm">{faq.answer}</div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Extra help / contact */}
//         <div className="mt-12 text-gray-600">
//           <p className="text-sm">
//             Still need help? Contact our support team on WhatsApp at{" "}
//             <span className="text-blue-600 font-semibold">YOUR_WHATSAPP_NUMBER_HERE</span> for more information.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { Search, ChevronDown, Briefcase, User, ShieldCheck, MessageCircle } from "lucide-react";

export default function HelpCenter() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const faqs = [
    // EMPLOYER SECTION
    {
      icon: <Briefcase className="text-blue-600 w-5 h-5 mr-2" />,
      category: "For Employers",
      question: "How do I post a job?",
      answer: `
        Once you’ve logged in as an Employer, go to your dashboard and click the “Post Job” button.
        You’ll be asked: “What kind of job do you want to post?”
        - If you have a company, choose **Company-based Job** and fill in your company’s information (name, description, location, contact).
        - If you don’t have a company, choose **Individual Job (Casual/Daily Work)** and just write simple job info like:
        “Wafanyakazi 4 wa ujenzi wanahitajika Arusha, malipo 20,000/day, kazi ijumaa.”
        Our platform is designed to make both professional and street-level job posting simple and quick.
      `,
    },
    {
      icon: <Briefcase className="text-blue-600 w-5 h-5 mr-2" />,
      category: "For Employers",
      question: "What are company-based jobs?",
      answer: `
        Company-based jobs are formal career positions posted by organizations or businesses. 
        They usually require education, experience, or a CV — for example, accountant, software engineer, or teacher. 
        As an Employer, adding company details builds trust with applicants and makes your posts look more professional.
      `,
    },
    {
      icon: <Briefcase className="text-blue-600 w-5 h-5 mr-2" />,
      category: "For Employers",
      question: "Can I post small or informal jobs?",
      answer: `
        Yes, absolutely! Many people need quick help — maybe for construction, painting, cleaning, or short-term work. 
        You can post simple, short job ads for these, even if you don’t have a registered company. 
        Just describe what you need, how many workers, where, when, and how much you’ll pay.
      `,
    },

    // JOB SEEKER SECTION
    {
      icon: <User className="text-green-600 w-5 h-5 mr-2" />,
      category: "For Job Seekers",
      question: "How do I create my career profile?",
      answer: `
        After signing up as a Job Seeker and verifying your email, open your dashboard and click “Career Profile”.
        You’ll be asked what kind of jobs you’re looking for:
        - **Company-based jobs:** upload your CV, add your education, skills, and experience. This helps employers find and trust you easily.
        - **Casual/Daily jobs:** fill in short details like name, job title (e.g., fundi ujenzi), your location, expected pay, and your availability (e.g., weekends only or daily). 
        This keeps things simple but effective for quick job matching.
      `,
    },
    {
      icon: <User className="text-green-600 w-5 h-5 mr-2" />,
      category: "For Job Seekers",
      question: "Can I apply for both formal and daily jobs?",
      answer: `
        Of course! You’re free to explore any kind of job that fits your situation. 
        Maybe you’re a teacher who also does farming on weekends — we make it possible to connect with both kinds of opportunities on one platform.
      `,
    },
    {
      icon: <User className="text-green-600 w-5 h-5 mr-2" />,
      category: "For Job Seekers",
      question: "How can I increase my chances of getting hired?",
      answer: `
        - Keep your profile complete and updated.
        - Add a clear photo and describe your skills honestly.
        - If applying for formal jobs, upload your latest CV.
        - For casual jobs, mention your location and availability clearly.
        - Respond fast when contacted by an employer — active users are more likely to get jobs.
      `,
    },

    // ACCOUNT SECTION
    {
      icon: <ShieldCheck className="text-purple-600 w-5 h-5 mr-2" />,
      category: "Account & Verification",
      question: "Why do I need to verify my email?",
      answer: `
        Email verification protects your account and ensures you receive updates about your applications and new job posts. 
        Without verification, your account stays inactive and you might miss important messages.
      `,
    },
    {
      icon: <ShieldCheck className="text-purple-600 w-5 h-5 mr-2" />,
      category: "Account & Verification",
      question: "What if I didn’t get the verification email?",
      answer: `
        - Check your spam or junk folder.
        - Try resending the email from the login page.
        - Make sure you typed your email correctly.
        - If still not received, contact our support team for quick help.
      `,
    },

    // GENERAL SECTION
    {
      icon: <MessageCircle className="text-orange-600 w-5 h-5 mr-2" />,
      category: "General Support",
      question: "How can I contact support?",
      answer: `
        We’re always ready to help! You can contact our support team through:
        - WhatsApp: +255 700 123 456
        - Email: support@jobconnect.co.tz
        Our team will respond as soon as possible to guide you with account issues, job posts, or profile setup.
      `,
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Help Center
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Whether you’re an <strong>Employer</strong> posting jobs or a <strong>Job Seeker</strong> finding work — this page helps you
            understand how to use the platform, step by step, with easy examples and answers.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-12">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search questions or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl shadow-md divide-y divide-gray-200 text-left">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex justify-between items-center px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    {faq.icon}
                    <div>
                      <p className="text-xs uppercase text-gray-400">
                        {faq.category}
                      </p>
                      <h3 className="font-semibold text-gray-800 text-base">
                        {faq.question}
                      </h3>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openIndex === i && (
                  <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center py-10 text-gray-500">
              No results found. Try searching for another topic.
            </p>
          )}
        </div>

        {/* Support */}
        <div className="mt-14 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Still need help?
          </h2>
          <p className="text-gray-600 mb-3">
            Our support team is here for you. Whether you’re stuck on registration, posting jobs, or setting up your profile, we’ll walk you through it.
          </p>
          <p className="text-gray-700 font-medium">
            📱 WhatsApp: <span className="text-blue-700">+255 700 123 456</span>
          </p>
          <p className="text-gray-700 font-medium">
            ✉️ Email: <span className="text-blue-700">support@jobconnect.co.tz</span>
          </p>
        </div>
      </div>
    </div>
  );
}
