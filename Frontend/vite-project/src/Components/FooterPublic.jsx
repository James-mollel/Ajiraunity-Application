import  { useState } from 'react';
import { Link } from 'react-router';
import { Facebook, Youtube, Linkedin, Instagram, Mail, Phone,
  X, MessageSquare, Star, Loader,
  MapPin
 } from 'lucide-react'; // Optional: install lucide-react
import api from '../AxiosApi/Api';
import toast from 'react-hot-toast';

const FooterPublic = () => {
  const currentYear = new Date().getFullYear();

  const [showModel, setShowModel] = useState(false)
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const [messageError, setMessageError] = useState("")
  const [ratingError, setRatingError] = useState("")

  const [loading, setLoading] = useState(false);

  const submitFeedBack = async(e)=>{
     e.preventDefault();
     setLoading(true);

   

     if (!rating){
      setRatingError("Please provide a rating!");
      setLoading(false);
      return;
     }

     if(message.trim().length < 3){
       setMessageError("Please provide a valid feedback message!")
       setLoading(false);
       return;
     }
      
     try{
       const data = {
        rating: rating,
        message : message.trim(),
        email : email.trim(),

      }
      const resp = await api.post("user-authentications/user-feedback/", data);
         toast.success("Feedback submitted successfully!")
         setShowModel(false);

         setRating(0);
         setMessage("");
         setEmail("");
         setMessageError("");
         setRatingError("");

     }catch(err){
        if (err.response){
                    const data = err.response.data;
                    
                    if (data.detail){
                        toast.error(data.detail);

                    } else if(typeof data === 'object'){
                        Object.entries(data).forEach(([key, value])=>{
                            const message = Array.isArray(value)? value.join(", ") : value;
                            toast.error(`${ key.charAt(0).toUpperCase() + key.slice(1)} : ${message}`)
                        });
                    }else{
                        toast.error("Unexpected error occur, Please try again later");
                    }
                }else{
                    toast.error("Network Error!. Could not connect to the server.")
                }
     }finally{
      setLoading(false);
     }
  }

  const TikTokIcon = ({ size = 18, className = "" }) => (
                <svg
                    role="img"
                    viewBox="0 0 24 24"
                    width={size}
                    height={size}
                    fill="currentColor"
                    className={className}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <title>TikTok</title>
                    <path d="M12.004 2c.657 0 1.303.06 1.94.176a5.674 5.674 0 0 0 1.63 3.61 5.68 5.68 0 0 0 3.61 1.63v3.777a9.459 9.459 0 0 1-3.777-.792v6.533c0 3.383-2.744 6.126-6.126 6.126S3.155 20.317 3.155 16.934c0-3.382 2.744-6.126 6.126-6.126.34 0 .675.028 1.004.082v3.894a2.338 2.338 0 1 0 2.72 2.31V2z"/>
                </svg>
             );


  return (
    <footer id='site-footer' className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                A
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Ajira<span className="text-blue-500">unity</span></span>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-xs">
               An inclusive job platform built to serve everyone with an opportunity and everyone
               looking for work — regardless of company ownership, education level, or job type.
            </p>
            
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-slate-900 rounded-full hover:bg-blue-600 transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="p-2 bg-slate-900 rounded-full hover:bg-blue-600 transition-colors">
                <Youtube size={18} />
              </a>
              <a href="#" className="p-2 bg-slate-900 rounded-full hover:bg-blue-600 transition-colors">
                <Facebook size={18} />
              </a>
               <a href="#" className="p-2 bg-slate-900 rounded-full hover:bg-blue-600 transition-colors">
                <Instagram size={18} />
              </a>

              <a
                    href="#"
                    aria-label="TikTok"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-900 rounded-full hover:bg-black transition-colors"
                    >
                            <TikTokIcon size={18} />
            </a>

            </div>
          </div>

          {/* For Candidates */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase text-xs tracking-widest">For Job Seekers</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/all-jobs" className="hover:text-blue-400 transition-colors">Browse Jobs</Link></li>
              <li><Link to="/user-login" className="hover:text-blue-400 transition-colors">Manage Profile</Link></li>
              <li><Link to="/user-login" className="hover:text-blue-400 transition-colors">Applied Jobs</Link></li>
              <li><Link to="/account-type" className="hover:text-blue-400 transition-colors">Create Account</Link></li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase text-xs tracking-widest">For Employers</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/user-login" className="hover:text-blue-400 transition-colors">Post a Job </Link></li>
              <li><Link to="/user-login" className="hover:text-blue-400 transition-colors">Dashboard</Link></li>
              <li><Link to="/user-login" className="hover:text-blue-400 transition-colors">Manage Companies</Link></li>
              <li><Link to="/user-login" className="hover:text-blue-400 transition-colors">Review Applications</Link></li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase text-xs tracking-widest">Help & Support</h4>
            <ul className="space-y-4 text-sm">
                <li>
                   <Link to="/about-us" className='hover:text-indigo-500'>
                      <span>About</span>   
                   </Link>
                </li>
                 <li>
                   <Link to="/about-us#faqs">
                        <span className='hover:text-indigo-600'>Frequently Asked Questions</span>  
                   </Link>
                 </li>
                  

                  <li>
                      <span className='hover:text-indigo-600' >Contact Us</span>
                  </li>

                <li>
                <div className='flex items-center space-x-4'>  
                       <MapPin size={16} className='text-blue-500'/>
                      <p className='hover:text-indigo-500'>Arusha, Tanzania</p>    
               </div>
                </li>
                 
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-blue-500" />
                <Link to="mailto:support@ajiraunity.com">
                     <span className='hover:text-indigo-600' >support@ajiraunity.com</span>
                </Link>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-blue-500" />
                 <Link to="tel:+255613764321">
                     <span className='hover:text-indigo-600' >+255 613 764 321</span>   
                 </Link>
              </li>
              
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {currentYear} Ajiraunity. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>



{ showModel && (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
         <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            {/* Header */}
           <div className="flex items-center justify-between border-b px-6 py-4">
                <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                            <MessageSquare size={20} />
                       </div>
                    <h3 className="text-lg font-semibold text-gray-900">Send Feedback</h3>
                </div>
                <button
                      onClick={()=>setShowModel(false)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      >
                      <X size={18} />
                </button>
            </div>


         <form onSubmit={submitFeedBack}> 
              <div className="space-y-5 px-6 py-5">
                  <p className="text-sm text-gray-600">
                        Help us improve <span className="font-semibold text-gray-900">Ajira<span className='text-indigo-700'>unity</span> </span> by sharing your experience.
                  </p>


            {/* Rating */}
            <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Your rating</label>
               {ratingError &&  <p className="mb-2 block text-sm text-red-600">{ratingError}</p> } 
                    <div className="flex gap-2">
                             {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="transition"
                                        >
                                      <Star
                                        size={22}
                                        className={rating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                                        />
                                   </button>
                                 ))}
                      </div>
             </div>


            {/* Message */}
            <div>
                 <label className="mb-2 block text-sm font-medium text-gray-700">Your feedback</label>
                 {messageError && <p className='text-red-600'>{messageError}</p>}
                     <textarea
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us what worked well or what we can improve…"
                        className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                        />
            </div>


            {/* Email */}
             <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                        Email <span className="text-gray-400">(optional)</span>
                </label>
                <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border text-gray-900 border-gray-300 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                      />
               </div>
            </div>


            {/* Footer */}
            <div className="flex flex-col-reverse gap-3 border-t px-6 py-4 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={()=>setShowModel(false)}
                            className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                            Cancel
                         </button>

                       <button
                           type="submit"
                           disabled={loading}
                           className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-indigo-700"
                        >
                         { loading? (
                           <div className='flex items-center justify-center'>  
                             <Loader className='animate-spin text-white'/>
                                  
                           </div>
                           
                         ): <span> Submit Feedback </span> }
                       </button>
             </div>
         </form> 
    </div>
 </div>

      )}

<button
  onClick={() => setShowModel(true)}
  className="
    fixed bottom-6 right-6 z-40
    flex items-center gap-2
    rounded-full bg-indigo-600 px-5 py-3
    text-sm font-semibold text-white
    shadow-lg shadow-indigo-500/30
    hover:bg-indigo-700 hover:scale-105
    transition-all duration-300
  "
>
  <MessageSquare size={18} />
  Feedback
</button>

  


    </footer>
  );
};

export default FooterPublic;