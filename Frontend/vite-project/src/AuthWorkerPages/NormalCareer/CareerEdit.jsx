import { useState, useEffect } from "react";
import api from "../../AxiosApi/Api";
import {toast} from "react-hot-toast";

export default function UserEditCareer({data,onSave,onCancel}) {
  
    const [title, setTitle] = useState(data.title || "");
    const [category, setCategory] = useState(data.category?.id || "");
    const [salary, setSalary] = useState(data.salary || "");
    const [currency, setCurrency] = useState(data.currency || "");
    const [payment_period, setPaymentPeriod] = useState(data.payment_period || "");
    const [availability, setAvailability] = useState(data.availability || "");
    const [experience_level, setExperience] = useState(data.experience_level || "");
    const [description, setDescription] = useState(data.description || "");
    

    const [categories,setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    const fetchCategories = async()=>{
                try{
                  const resp = await api.get("jobs/users/category/categories-informal/");
                  setCategories(resp.data);
                  console.log(resp.data);
            
                }catch(err){ 
                  console.log(err)
                }
              }


    useEffect(()=>{
      const fetch = async()=>{
         await   fetchCategories();
      }
      fetch();
    },[]); 


    const handleSubmit= async(e)=>{
        e.preventDefault();
        setShowDialog(true);
    };

    const handleMakePublic = ()=>{
        finalSubmitToBackend(true);
    }

    const handleNotNow=()=>{
        finalSubmitToBackend(false);
    }
        
    
        const finalSubmitToBackend = async (isPublic) => {
            setLoading(true);
        
            try {
                const formData = new FormData();
                 formData.append("title",title)
                 formData.append("salary",salary)
                 formData.append("currency", currency)
                 formData.append("payment_period",payment_period)
                 formData.append("availability",availability)
                 formData.append("experience_level",experience_level)
                 formData.append("description",description)
                 formData.append("public_visible",isPublic)

                if (category){
                    formData.append("category_id", parseInt(category));
                }
                const resp  = await api.patch("user-job-seekers/user/normal/worker/", formData);
                toast.success("Data saved Successfuly?.")
                 await onSave();
                 
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
            }finally{
                setLoading(false);
                setShowDialog(false);
            }

            
        };
        
            
              return (
                <div className="w-full flex justify-center py-4 relative">
                  <div className="w-full max-w-xl bg-white/70 shadow-lg rounded-lg p-6">
                   <div>

                   </div>
                    
            
                    <form className="space-y-4" onSubmit={handleSubmit}>
                      {/* Title */}
                      <div className="flex flex-col space-y-1">
                        <label className="text-base text-neutral-900">Job title</label>
                        <input
                          name="title"
                          onChange={(e)=> setTitle(e.target.value)}
                          value={title}
                          type="text"
                          required
                          className="w-full bg-white outline-none focus:ring-2 focus:ring-gray-800 rounded-lg py-2 px-4 text-lg border border-gray-300"
                          placeholder="e.g., Mason, Gardener, Painter"
                        />
                      </div>
            
                      {/* Category */}
                      <div className="flex flex-col space-y-1">
                        <label className="text-base text-neutral-900">Job category</label>
                        <select
                          name="category"
                          value={category}
                          onChange={(e)=>setCategory(e.target.value)}
                           required
                          className="w-full bg-white focus:ring-2 focus:ring-gray-800 outline-none rounded-lg py-2 px-4 text-lg text-gray-600 border border-gray-300"
                        >
                          <option value="">- Select category -</option>
                            {categories.map((c)=>(
                              <option key={c.id} value={c.id}>{c.display_name}</option>
                            ))}
                        </select>
                      </div>
            
                      {/* Salary */}
                      <div className="flex flex-row space-x-4 items-center">
                          <div className="flex flex-col space-y-1">
                              <label className="text-base text-neutral-900">
                                Expected salary
                              </label>
                              <input
                                name="salary"
                                onChange={(e)=>setSalary(e.target.value)}
                                value={salary}
                                type="number"
                                required
                                placeholder="10000"
                                className="w-full bg-white outline-none focus:ring-2 focus:ring-gray-800 rounded-lg py-2 px-4 text-lg border border-gray-300"
                              />
                          </div>

                       <div className="flex flex-col space-y-1">
                          <label className="text-base text-neutral-900">Currency</label>
                            <select
                              onChange={(e)=>setCurrency(e.target.value)}
                              value={currency}
                              name="currency" 
                              required 
                              className="w-full bg-white outline-none focus:ring-2 focus:ring-gray-800 rounded-lg py-2 px-4 text-lg text-gray-600 border border-gray-300"
                              >
                              <option value="">- Select -</option>
                              <option value="TZS">TZS</option>
                              <option value="USD">USD</option>
                            </select>
                      </div>
                    </div>
            
                      {/* Salary per */}
                      <div className="flex flex-col space-y-1">
                        <label className="text-base text-neutral-900">Payment period</label>
                        <select
                          onChange={(e)=>setPaymentPeriod(e.target.value)}
                          value={payment_period}
                          name="payment_period"
                          required
                          className="w-full bg-white outline-none focus:ring-2 focus:ring-gray-800 rounded-lg py-2 px-4 text-lg text-gray-600 border border-gray-300"
                        >
                          <option value="">- Select -</option>
                          <option value="PerHour">Per Hour</option>
                          <option value="PerDay">Per Day</option>
                          <option value="PerWeek">Per Week</option>
                          <option value="PerMonth">Per Month</option>
                          <option value="Negotiable">Negotiable</option>
                          <option value="PerProject">Per Project</option> 
                        </select>
                      </div>
            
                      {/* Availability */}
                      <div className="flex flex-col space-y-1">
                        <label className="text-base text-neutral-900">Availability</label>
                        <select
                          onChange={(e)=>setAvailability(e.target.value)}
                          value={availability}
                          name="availability" 
                          required 
                          className="w-full bg-white outline-none focus:ring-2 focus:ring-gray-800 rounded-lg py-2 px-4 text-lg text-gray-600 border border-gray-300"
                        >
                          <option value="">- Select -</option>
                          <option value="WeekdaysOnly">Weekdays only</option>
                          <option value="WeekendsOnly">Weekends only</option>
                          <option value="Daily">Daily</option>
                          <option value="Immediate">Immediate</option>
                        </select>
                      </div>


            
                      {/* Experience */}
                      <div className="flex flex-col space-y-1">
                        <label className="text-base text-neutral-900">Experience level</label>
                        <select
                          onChange={(e)=>setExperience(e.target.value)}
                          value={experience_level}
                          name="experience_level"
                          required
                          className="w-full bg-white outline-none focus:ring-2 focus:ring-gray-800 rounded-lg py-2 px-4 text-lg text-gray-600 border border-gray-300"
                        >
                          <option value="">- Select -</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Expert">Expert</option>
                        </select>
                      </div>
            
                      {/* Description */}
                      <div className="flex flex-col space-y-1">
                        <label className="text-base text-neutral-900">Description</label>
                        <textarea
                          onChange={(e)=>setDescription(e.target.value)}
                          value={description}
                          name="description"
                          rows="5"
                          required
                          placeholder="Describe yourself and your experience..."
                          className="w-full bg-white outline-none focus:ring-2 focus:ring-gray-800 rounded-lg p-4 text-lg border border-gray-300"
                        ></textarea>
                      </div>
            
                      {/* Submit button */}
                <div className="flex items-center justify-between" >
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-gray-900 hover:bg-gray-700 text-white py-2 px-4 rounded-md text-lg transition shadow-md"
                             >
                            {loading ? "Saving..." : "Save"}
                        </button>

                    <button 
                           type="button"
                           onClick={onCancel}
                           className="py-2 px-4 bg-red-700 rounded-md text-gray-300 hover:bg-red-400 text-lg shadow-md"
                         >
                        Cancel
                    </button>
                      </div>
                     
                    </form>
                  </div>
            
                  {/* ===== DIALOG OVERLAY ===== */}
                  {showDialog && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4">
                      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">
                          Make Your Profile Public?
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Your profile is ready. Would you like employers to see it
                          immediately?
                        </p>
            
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={handleNotNow} disabled={loading}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-100"
                          >
                           {loading ? "wait..": "Not now"} 
                          </button>
                          <button
                            onClick={handleMakePublic} disabled={loading}
                            className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700"
                          >
                           {loading? "wait...": "Make Public"} 
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
        </div>
            
 )
             
    
}