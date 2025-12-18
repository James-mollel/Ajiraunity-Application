import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useParams } from "react-router";
import {toast} from "react-hot-toast";
import { useNavigate } from "react-router";
import api from "../AxiosApi/Api";


export default function PasswordChange() {

    const {uid,token}= useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => {
        setShowPassword((prev) => !prev); 
        }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    
        if (errors.password) {
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors.password;
                return newErrors;
            });
        }
    };


    const handlePassword2 = (e) => {
        setPassword2(e.target.value);
        if (errors.password2) {
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors.password2;
                return newErrors;
            });
        }
    };


    const validatePasswords = (values) => {
        const errors = {};
        if (values.password.trim() === "") {
            errors.password = "Password is required.";
        }else if (values.password.length < 6){
            errors.password = "Password is too short!";
        }

        if (values.password2.trim() === ""){
            errors.password2 = "Confirm password required!"
        }else if (values.password2 !== values.password){
            errors.password2 = "Passwords miss match!";
        }

        return errors;
    };



    const handleSubmit = async(e) => {
        e.preventDefault();

        const data = { 
            password : password,
            password2: password2
        };

        const validationErrors = validatePasswords(data);
        setErrors(validationErrors);
        setIsSubmitting(true);

        if (Object.keys(validationErrors).length === 0) {
            console.log("Successfully submitted and ready for API call!");

            try{
                const resp = await api.post(`user-authentications/password/confirm/users/${uid}/${token}/`,{
                    password: password,
                    password2:password2,
                    uidb64: uid,
                    token: token
                });
                if (resp.status === 200){
                    toast.success(resp.data.message);
                    setTimeout(()=>{
                        navigate("/user-login")
                    },2500);
                        
                }

            }catch(err){
                if (err.response){
                    toast.error(err.response.data.detail);
                }else{
                    toast.error("Network Error. Please Try again later")
                }
                
            }finally{
                setIsSubmitting(false);
            }
          
        } else {
            setIsSubmitting(false);
        }
    };



    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-xl rounded-xl border border-gray-200">
                <div className="text-center">
                    <h2 className="mt-2 text-xl font-light  text-gray-800">Choose a new password</h2>
             </div>

     <form className="mt-10 space-y-4" onSubmit={handleSubmit}>                   
        <div className="mb-6">          
            <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock strokeWidth={2} size={24} className=" text-gray-500" aria-hidden="true" />
                    </div>
    
                <input
                    name= "password"
                    type={showPassword ? "text": "password"}
                    value={password}
                    onChange={handlePassword}
                    className={`
                        w-full border rounded-md  outline-none focus:border-gray-600 text-gray-900 font-light placeholder-gray-600
                        transition duration-150 ease-in-out  
                        ${errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-400 focus:border-gray-600'}
                        pl-10 py-2.5
                    `}
                    placeholder="New password"
                />
                 <button
                        type="button"
                        onClick={togglePassword}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-700"
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>

                     {errors.password &&  ( <p className="text-xs mt-1 text-red-500 font-medium">{errors.password}</p>)}
           </div>


    <div className="">
            <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={24}  className=" text-gray-600" aria-hidden="true" />
                    </div>
                 <input
                    name= "password2"
                    type={showPassword ? "text": "password"}
                    value={password2}
                    onChange={handlePassword2}
                    className={`
                        w-full px-4 py-2 border rounded-md  text-gray-900 placeholder-gray-500
                        transition duration-150 ease-in-out focus:border-gray-600 focus:outline-none
                        pl-10
                        ${errors.password2 ? 'border-red-500 focus:border-red-500' : 'border-gray-400 focus:border-gray-600'}
                    `}
                    placeholder="Re-type new password"
                />
                    <button
                        type="button"
                        onClick={togglePassword}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-700"
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    
            </div>
                    {errors.password2 && <p className="mt-1 text-xs text-red-500 font-medium">{errors.password2}</p>}
     </div>



        <div>
              <button
                      type="submit"
                            disabled={isSubmitting}
                            className={`
                                group relative w-full rounded-md flex justify-center py-3 px-4 border border-transparent text-base font-medium text-white
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
                                    Change 
                                </>
                            )}
                        </button>
                    </div>
         </form>
                
            </div>
        </div>
    );
}
