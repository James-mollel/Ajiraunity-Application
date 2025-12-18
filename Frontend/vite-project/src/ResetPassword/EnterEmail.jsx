import { useState } from "react";
import { Mail } from "lucide-react";
import api from "../AxiosApi/Api";
import {toast} from "react-hot-toast";
import { useNavigate } from "react-router";


export default function EnterEmailResetPassword() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

   

    const handleChange = (e) => {
        setEmail(e.target.value);
        if (errors.email) {
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors.email;
                return newErrors;
            });
        }
    };


    const validateEmail = (email) => {
        const errors = {};
        // if (!email.trim()) {
        //     errors.email = "Email is required.";
        // } else if (!/\S+@\S+\.\S+/.test(email)) {
        //     errors.email = "Email address is invalid.";
        // }

        return errors;
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateEmail(email);
        setErrors(validationErrors);
        setIsSubmitting(true);

        if (Object.keys(validationErrors).length === 0) {
            console.log("Successfully submitted and ready for API call!");

            

            try{
                const resp = await api.post("user-authentications/password-reset/user/", {email});
                if (resp.status === 200){
                    toast.success(resp.data.message);

                    setTimeout(()=>{
                        navigate("/user-login");
                    },2000);
                }

            }
            catch(err){
                if (err.response){
                    toast.error(err.response.data.detail);
                }else{
                    toast.error("Network Error. Please try again later")
                }
                console.log(err);

            }finally{
                setIsSubmitting(false);
            }

         }else{
            setIsSubmitting(false);
         }
    };



    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg w-full space-y-8 p-10 bg-white shadow-xl rounded-xl border border-gray-200">
                <div className="text-center ">
                      <h2 className="text-xl font-semibold text-gray-900 border-b ">
                               Forgot Your Password?</h2>  

                    <p className="text-gray-600 text-xs lg:text-sm text-center mt-5">Please enter your email address to change the password
                         . We'll send you instructions on how to do that</p>
                </div> 

     <form className="mt-8 space-y-4" onSubmit={handleSubmit}>                   
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 sr-only" htmlFor="email_address">Email</label>
          
            <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail strokeWidth={2} size={24} className=" text-gray-500" aria-hidden="true" />
                    </div>
    
                <input
                    name= "email"
                    type="text" 
                    value={email}
                    onChange={handleChange}
                    className={`
                        w-full border rounded-md outline-none focus:border-gray-600 text-gray-900 font-light placeholder-gray-600
                        transition duration-150 ease-in-out  
                        ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-400 focus:border-gray-600'}
                        pl-10 py-2.5
                    `}
                    placeholder="Email Address"
                />
                </div>

                     {errors.email &&  ( <p className="text-xs mt-1 text-red-500 font-medium">{errors.email}</p>)}
           </div>
        <div>
              <button
                      type="submit"
                            disabled={isSubmitting}
                            className={`
                                group relative rounded-md w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium text-white
                                transition duration-150 ease-in-out
                                ${isSubmitting
                                    ? 'bg-gray-500 cursor-not-allowed'
                                    : 'bg-gray-900  focus:outline-none focus:ring-2 focus:ring-offset-2'
                                }
                            `}
                        >
                            {isSubmitting ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <>
                                    Request Password Link
                                </>
                            )}
                        </button>
                    </div>
         </form>

              
                
            </div>
        </div>
    );
}
