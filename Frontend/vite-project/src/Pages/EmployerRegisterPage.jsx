import { Link } from "react-router-dom";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, CornerDownRight } from "lucide-react"; 
import api from "../AxiosApi/Api";
import {toast} from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// --- Input Component for cleaner JSX ---
const FormInput = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    error,
    icon: Icon,
    showToggle = false,       
}) => {

    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword((prev) => !prev); 
        }


    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 sr-only" htmlFor={name}>{label}</label>
            <div className="relative">
                {/* Left Icon */}
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-indigo-400" aria-hidden="true" />
                    </div>
                )}

                {/* Input Field */}
                <input
                    id={name}
                    name={name}
                    type={showToggle && showPassword ? "text" : type}
                    value={value}
                    onChange={onChange}
                    className={`
                        w-full px-4 py-2 border  text-gray-900 placeholder-gray-500
                        transition duration-150 ease-in-out focus:border-gray-800  focus:outline-none
                        ${Icon ? 'pl-10' : ''}
                        ${showToggle ? 'pr-10' : ''}  
                        ${error ? 'border-red-500 focus:border-red-500' : 'border-gray-400 focus:border-gray-800'}
                    `}
                    placeholder={label}
                    autoComplete={name === 'password' || name === 'confPassword' ? 'new-password' : name}
                />

                {/* Right Eye Toggle */}
                {showToggle && (
                    <button
                        type="button"
                        onClick={togglePassword}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                )}
            </div>

            {/* Error message */}
            {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
        </div>
    );
};


// --- Main Page ---
export default function EmployerRegistrationPage() {
    const initialValues = {
        email: "",
        password: "",
        password2: "",
    };

    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

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

    const validateRegistration = (values) => {
        const errors = {};
        if (!values.email.trim()) {
            errors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = "Email address is invalid.";
        }

        if (!values.password.trim()) {
            errors.password = "Password is required.";
        } else if (values.password.length < 8) {
            errors.password = "Password must be at least 8 characters.";
        }

        if (!values.password2.trim()) {
            errors.confPassword = "Confirmation is required.";
        } else if (values.password2 !== values.password) {
            errors.confPassword = "Passwords do not match!";
        }

        return errors;
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const validationErrors = validateRegistration(values);
        setErrors(validationErrors);
        setIsSubmitting(true);

        if (Object.keys(validationErrors).length === 0) {
            console.log("Successfully submitted and ready for API call!");
 
            try{
                const resp = await api.post("user-authentications/signup/employer/",values);
                if(resp.status === 201){
                    toast.success(resp.data.message);
                    navigate("/verify-account");
                    
                }
            } catch(err){

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
            } finally{
                setIsSubmitting(false);
            }

        } else {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-xl rounded-sm border border-gray-200">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Join as a <span className="text-indigo-400">Employer</span></h2>
                    <p className="mt-2 text-sm text-gray-600">Post any kind of job from <span className="font-semibold">office positions</span> to <span className="font-semibold" >daily street tasks</span> and connect with the right people</p>
                   

                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <FormInput
                        label="Email Address"
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        error={errors.email}
                        icon={Mail}
                    />

                    <FormInput
                        label="Password"
                        name="password"
                        type="password"
                        value={values.password}
                        onChange={handleChange}
                        error={errors.password}
                        icon={Lock}
                        showToggle={true}   
                    />

                    <FormInput
                        label="Confirm Password"
                        name="password2"
                        type="password"
                        value={values.password2}
                        onChange={handleChange}
                        error={errors.confPassword}
                        icon={Lock}
                        showToggle={true}  
                    />

                      <p className="text-sm text-gray-600 mt-2">
                        By registering, you agree to our{' '}
                        <Link to="/terms" className="text-indigo-600 hover:underline">Terms of Service</Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>.
                    </p>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`
                                group relative w-full flex justify-center py-2 px-4 border border-transparent text-base font-medium text-white
                                transition duration-150 ease-in-out
                                ${isSubmitting
                                    ? 'bg-indigo-400 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
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
                                    <CornerDownRight className="h-5 w-5 mr-2" />
                                    Sign Up Now
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <Link className="text-sm font-medium text-indigo-600 hover:text-indigo-500" to="/user-login">
                        Already have an account? <span className="underline underline-offset-4 decoration-indigo-300">Sign in</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
