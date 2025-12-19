import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../AxiosApi/Api";
import toast from "react-hot-toast";
import { AuthContext } from "../AxiosApi/AuthPages";


export default function LoginPage() {
    const [values, setValues] = useState({
        email: "",
        password: "",
    } );

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {refreshAuth} = useContext(AuthContext);

    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => {
        setShowPassword((prev) => !prev); 
        }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value,
        });
        if (errors[name]) {
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
        }
    };


    const validateLogins = (values) => {
        const errors = {};
        if (!values.email.trim()) {
            errors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = "Email address is invalid.";
        }

        if (!values.password.trim()) {
            errors.password = "Password is required.";
        }

        return errors;
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateLogins(values);
        setErrors(validationErrors);
        setIsSubmitting(true);

        if (Object.keys(validationErrors).length === 0) {
            try{
                const resp = await api.post("user-authentications/auth/user/login/", values);
                if (resp.status === 200){

                    toast.success(resp.data.message);

                    const user = await refreshAuth();

                    if ( user && user.role === "EMPLOYER"){
                        navigate("/dashboard-user-employer/");
                    }else if(user && user.role === "WORKER"){
                        navigate("/dashboard-user-job-seeker/");
                    }else{
                        navigate("/");
                    }
                }
            }catch(err){
                if (err.response){
                    const data = err.response.data;
                    
                    if (data.detail){
                        toast.error(data.detail);

                    } else if(typeof data === 'object'){
                        Object.entries(data).forEach(([key, value])=>{
                            const message = Array.isArray(value)? value.join(", ") : value;
                            toast.error(message)
                        });
                    }else{
                        toast.error("Unexpected error occur, Please try again later");
                    }
                }else{
                    toast.error("Network Error!.")
                }
            }finally{
                setIsSubmitting(false)
            }       
           

        } else {
            setIsSubmitting(false);
        }
    };



    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-xl rounded-sm border border-gray-200">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome <span className="text-indigo-700" >Back</span> 👋</h2>
                    <p className="mt-2 text-xs md:text-sm font-normal text-indigo-500">Continue to find jobs, post opportunities, and grow your career or business.</p>
                </div> 

     <form className="mt-8 space-y-4" onSubmit={handleSubmit}>                   
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 sr-only" htmlFor="email_address">Email</label>
          
            <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail strokeWidth={2} size={24} className=" text-indigo-600" aria-hidden="true" />
                    </div>
    
                <input
                    name= "email"
                    type="text" 
                    value={values.email}
                    onChange={handleChange}
                    className={`
                        w-full border  outline-none focus:border-gray-600 text-gray-900 font-light placeholder-gray-600
                        transition duration-150 ease-in-out  
                        ${Mail ? 'pl-10' : ''}
                        ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-400 focus:border-gray-600'}
                        pl-10 py-2.5
                    `}
                    placeholder="Email Address"
                />
                </div>

                     {errors.email &&  ( <p className="text-xs mt-1 text-red-500 font-medium">{errors.email}</p>)}
           </div>


    <div className="">
        <label className="block text-sm font-medium text-gray-700 sr-only" htmlFor="email_address">Password</label>
            <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={24}  className=" text-indigo-600" aria-hidden="true" />
                    </div>
                 <input
                    name= "password"
                    type={showPassword ? "text": "password"}
                    value={values.password}
                    onChange={handleChange}
                    className={`
                        w-full px-4 py-2 border  text-gray-900 placeholder-gray-500
                        transition duration-150 ease-in-out focus:border-gray-600 focus:outline-none
                        ${Lock ? 'pl-10' : ''}
                        ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-400 focus:border-gray-600'}
                    `}
                    placeholder="Password"
                />
                    <button
                        type="button"
                        onClick={togglePassword}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-700"
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    
            </div>
                    {errors.password && <p className="mt-1 text-xs text-red-500 font-medium">{errors.password}</p>}
     </div>


        <div className="flex items-start justify-end">
            <Link to="/forgot-password" className="text-sm underline underline-offset-4 text-gray-700">Reset password</Link>
        </div>
    


        <div>
              <button
                      type="submit"
                            disabled={isSubmitting}
                            className={`
                                group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium text-white
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
                                    <LogIn className="h-5 w-5 mr-2" />
                                    Login
                                </>
                            )}
                        </button>
                    </div>
         </form>

                <div className="text-center">
                    <Link className="text-sm  text-gray-600 hover:text-gray-500" to="/account-type">
                        New to Ajiraunity? <span className="underline underline-offset-4 decoration-indigo-300">Register</span>
                    </Link>
                </div>
                
            </div>
        </div>
    );
}
