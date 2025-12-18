import { cache, useEffect, useState } from "react";
import api from "../AxiosApi/Api";
import {toast} from "react-hot-toast";

export default function CareerInfoNormalWorker() {
  const [data, setData] = useState({
    title: "",
    category: "",
    salary: "",
    payment_period: "",
    availability: "",
    experience_level: "",
    description: "",
  });

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
    fetchCategories();
  },[]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resp  = api.post("fill normal worker data");
    }catch(err){
      console.log(err)
    }

    // Your API request will go here later...

    setTimeout(() => {
      setLoading(false);
      setShowDialog(true); // Show dialog when submit is done
    }, 800);
  };
 
  const handleMakePublic = () => {
    setShowDialog(false);
    // handle API call to make public
  };

  const handleNotNow = () => {
    setShowDialog(false);
  };

  return (
    <div className="w-full flex justify-center py-4 relative">
      <div className="w-full max-w-xl bg-white/70 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 text-center my-6">
          Create Your Worker Profile
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="flex flex-col space-y-1">
            <label className="text-base text-neutral-900">Job title</label>
            <input
              name="title"
              onChange={handleChange}
              value={data.title}
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
              value={data.category}
              onChange={handleChange}
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
          <div className="flex flex-col space-y-1">
            <label className="text-base text-neutral-900">
              Expected salary
            </label>
            <input
              name="salary"
              onChange={handleChange}
              value={data.salary}
              type="text"
              required
              placeholder="10,000 Tsh"
              className="w-full bg-white outline-none focus:ring-2 focus:ring-gray-800 rounded-lg py-2 px-4 text-lg border border-gray-300"
            />
          </div>

          {/* Salary per */}
          <div className="flex flex-col space-y-1">
            <label className="text-base text-neutral-900">Payment period</label>
            <select
              onChange={handleChange}
              value={data.payment_period}
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
              onChange={handleChange}
              value={data.availability}
              name="availability" 
              required 
              className="w-full bg-white outline-none focus:ring-2 focus:ring-gray-800 rounded-lg py-2 px-4 text-lg text-gray-600 border border-gray-300"
            >
              <option value="">- Select -</option>
              <option value="Weekends">Weekends</option>
              <option value="Daily">Daily</option>
            </select>
          </div>

          {/* Experience */}
          <div className="flex flex-col space-y-1">
            <label className="text-base text-neutral-900">Experience level</label>
            <select
              onChange={handleChange}
              value={data.experience_level}
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
              onChange={handleChange}
              value={data.description}
              name="description"
              rows="5"
              required
              placeholder="Describe yourself and your experience..."
              className="w-full bg-white outline-none focus:ring-2 focus:ring-gray-800 rounded-lg p-4 text-lg border border-gray-300"
            ></textarea>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-700 text-white py-3 rounded-lg text-lg transition shadow-md"
          >
            {loading ? "Saving..." : "Save"}
          </button>
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
                onClick={handleNotNow}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-100"
              >
                Not now
              </button>
              <button
                onClick={handleMakePublic}
                className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700"
              >
                Make Public
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
