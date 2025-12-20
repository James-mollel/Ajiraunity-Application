import { useEffect, useRef, useState } from "react";
import {toast} from 'react-hot-toast';
import api from "../../AxiosApi/Api";
import FullScreenLoader from "../../Components/Loader";

export default function EmployerProfileInfo() {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState(null);
  const [isDragg, setIsDragg] = useState(false);

  // Form data 

  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [phone, setPhone] = useState("");

  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadProfile, setLoadProfile] = useState(false);


  // Form data 

  const imageRef = useRef(null); 

  const processFile =(selectedImage)=>{
    if(selectedImage && selectedImage.type.startsWith("image/")){
       setImage(selectedImage);
       console.log("File size Image ", selectedImage.size)

       const imageUrl = URL.createObjectURL(selectedImage);
       setUrl(imageUrl);
    }
  }

  const handleImage=(event)=>{
    const actualImage = event.target.files[0];
    processFile(actualImage);

  }

  const removeImage =()=>{
    if(url){
      URL.revokeObjectURL(url);
    }
    setUrl(null);
    setImage(null)
  }

  const handleHiddenImageClick=()=>{
    imageRef.current.click();
  }

  const preventDefaultFeatues =(e)=>{
    e.preventDefault();
    e.stopPropagation();
  }

  const handleDragOvers=(e)=>{
    preventDefaultFeatues(e);

    if(isDragg === false){
      setIsDragg(true);
    }
  }

  const handleDragLeaves=(e)=>{
    preventDefaultFeatues(e);

    if(e.currentTarget.contains(e.relatedTarget)){
      return;
    }
    setIsDragg(false);
  }

  const handleDrops =(e)=>{
    preventDefaultFeatues(e);
    setIsDragg(false);

    const draggedImages = e.dataTransfer.files;

    if(draggedImages.length > 0){
       processFile(draggedImages[0]);
    }
}


  const dropZoneStyle = `
       flex justify-center items-center p-8 flex-col 
       ${isDragg ? 'border-pink-700 bg-gray-100 shadow-lg shadow-pink-500/40'
                  :'border-indigo-500/50 hover:bg-gray-200'}
       border-2 transition duration-300 group
       border-dashed rounded-xl bg-gray-100 cursor-pointer
        `;

        useEffect(()=>{
          const loadData = async()=>{
           await fetchInitProfileInfo();
          };
          loadData(); 
          
        },[]);



    

        const fetchInitProfileInfo = async ()=>{
          try{
            setLoadProfile(true);
            const resp =await api.get("user-authentications/auth-employer/profile-data/");
            const profile = resp.data;
            if (!profile) return;

            setFname(profile.first_name || "")
            setLname(profile.last_name || "")
            setPhone(profile.phone_number || "")
            setGender(profile.gender || "")

            setEmail(profile.user)

            if (profile.avatar){ 
                   setUrl(profile.avatar);
                  
            }

          }catch(err){
            toast.error("failed to fetch user profile, please try again!")
          }finally{
            setLoadProfile(false);
          }

        };

    



    const handleSubmit = async (e)=>{
          e.preventDefault();
          setLoading(true);

          try{
            const form = new FormData();
            form.append("first_name", fname);
            form.append("last_name", lname);
            form.append("phone_number", phone);
            form.append("gender", gender);

            if (image instanceof File) form.append("avatar", image);

            const resp = await api.patch("user-authentications/auth-employer/profile-data/", form, {
              headers : {
                "Content-Type": "multipart/form-data",
              },
            });
            toast.success("Profile updated successfully!")

            // if (image && url && url.startsWith("blob:")) {
            //     URL.revokeObjectURL(url);
            // }
            
          }catch(err){
            if (err.response){
              const data = err.response.data;

              if (data.detail){
               toast.error(data.detail)
              }
              else if (typeof data === 'object'){
                Object.entries(data).forEach(([key, value])=>{
                  const message = Array.isArray(value) ? value.join(", ") : value;
                  toast.error(message);
                });
              }else{
                toast.error("Unexpected error occur, Please try again later!.")
              }

            }else{
              toast.error("Network error, Please try again later!.")
            }
            console.log("Error saving a profile ", err);
          } finally{
            setLoading(false);
          }

        }

        if (loadProfile){
            return <FullScreenLoader/>;
        }

  return (
            
        <div className="min-h-screen py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="w-full bg-white/40 py-6 px-4 my-4 rounded-md shadow-md">
                 <h1 className="text-2xl text-gray-600 font-bold">Manage Your Profile</h1>
            </div>
            
            <form onSubmit={handleSubmit} encType="multipart/form-data" >  
            
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
                <div className="bg-white/55 rounded-md shadow-md  p-6 text-center">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Profile Image</h3>
                    <input type="file" className="hidden" ref={imageRef} accept="image/*" onChange={handleImage} />
                    
                    {url ? (
                    <div className="flex flex-col items-center space-y-4">
                        <img
                        src={url}
                        alt="Profile Photo"
                        className="w-48 h-48 rounded-full object-cover"
                        />
                        <div>
                            <button onClick={removeImage} className="py-2 px-4 bg-teal-700 rounded-sm text-white">Change</button>
                            <div className="flex items-center space-x-1 mt-3">
                                <p className="text-sm text-gray-600"></p> <p className="text-xs truncate max-w-[210px] inline-block text-neutral-600">{image ? `current ${image.name}`:" "}</p>
                            </div>
                        </div>  
                    </div>
                    ):(
                        <div 
                        onClick={handleHiddenImageClick}
                        onDragEnter={handleDragOvers}
                        onDragLeave={handleDragLeaves}
                        onDragOver={handleDragOvers}
                        onDrop={handleDrops}
                        className={dropZoneStyle}
                        >
                        <svg className="w-10 h-10 mb-3 text-indigo-400 group-hover:text-indigo-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                        </svg>

                        <p className="mb-2 text-sm text-gray-600 font-semibold">
                                <span className="text-blue-600 group-hover:text-indigo-500 font-bold transition-colors">Click to upload</span> or **drag to upload**
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Profile Image (PNG, JPG) - Max 5MB
                            </p>
                        </div>
                    )}

                </div>


                {/* Profile Form Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-6">Personal Information</h3>
                <div className="space-y-5">

                    <div className="flex items-center space-x-4">
                        <div>
                        <label htmlFor="firstName" className="text-sm font-medium text-gray-600 block mb-2">
                            First name
                            </label>
                            <input
                            type="text"
                            value={fname}
                            onChange={(e)=> setFname(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>
                        <div>
                        <label htmlFor="firstName" className="text-sm font-medium block text-gray-600 mb-2">
                            Last name
                            </label>
                            <input
                            type="text" 
                            value={lname}
                            onChange={(e)=>setLname(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>
                    </div>


                    <div className="flex items-center space-x-4">
                        <div>
                        <label htmlFor="firstName" className="text-sm font-medium text-gray-600 block mb-2">
                            Email
                            </label>
                            <input
                            value={email}
                            type="email" readOnly
                            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>
                        <div>
                        <label htmlFor="firstName" className="text-sm font-medium block text-gray-600 mb-2">
                            Phone number
                            </label>
                            <input
                            type="text" placeholder="+255 712 456 772"
                            value={phone}
                            onChange={(e)=>setPhone(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <div>
                        <label htmlFor="firstName" className="text-sm font-medium block text-gray-600 mb-2">
                            Gender
                            </label>
                            <select value={gender} onChange={(e)=> setGender(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 bg-white focus:ring-green-500 focus:border-transparent transition-all duration-200" >
                                <option value="">-select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            
                        </div>
                    </div>
        
                    <button
                        type="submit" disabled = {loading}
                        className="w-full mt-4 px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-md shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                        {loading? "Saving...":"Save"}
                    </button>
                    </div>
                </div>
                </div>
        </form>

            </div>
         </div>
  ); 
}
