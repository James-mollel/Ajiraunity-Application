import { useState, useEffect } from "react";
import api from "../../AxiosApi/Api";
import { toast } from "react-hot-toast";
import { Trash2, Edit, Plus } from "lucide-react";

export default function ListAllProfessionalSkill() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(null); // null = Add, object = Edit
  const [skillName, setSkillName] = useState("");

  // Fetch all skills
  const fetchSkills = async () => {
    setLoading(true);
    try {
      const resp = await api.get("user-job-seekers/professional/skills/");
      setSkills(resp.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load skills!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Open Add Skill Modal
  const handleAdd = () => {
    setCurrentSkill(null);
    setSkillName("");
    setShowModal(true);
  };

  // Open Edit Skill Modal
  const handleEdit = (skill) => {
    setCurrentSkill(skill);
    setSkillName(skill.skill);
    setShowModal(true);
  };

  // Delete Skill
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    try {
      await api.delete(`user-job-seekers/professional/skills/${id}/destroy/`);
      toast.success("Skill deleted!");
      fetchSkills();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete skill!");
    }
  };

  // Submit Add/Edit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (currentSkill) {
        // Edit
        await api.patch(
          `user-job-seekers/professional/skills/${currentSkill.id}/`,
          { skill: skillName }
        );
        toast.success("Skill updated!");
      } else {
        // Add
        await api.post("user-job-seekers/professional/skills/", { skill: skillName });
        toast.success("Skill added!");
      }
      setShowModal(false);
      fetchSkills();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save skill!");
    }
  };

  if (loading) return <p className="text-center py-6 text-gray-600">Loading skills...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-3xl shadow-lg min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">My Skills</h2>
        <button
          onClick={handleAdd}
          className="flex items-center bg-indigo-600 text-white px-5 py-2.5 rounded-2xl hover:bg-indigo-700 shadow-lg transition"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Skill
        </button>
      </div>

      {/* Skills Grid */}
      {skills.length === 0 ? (
        <p className="text-gray-500 text-center">No skills added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="flex flex-col justify-between bg-indigo-50 hover:bg-indigo-100 transition-all rounded-xl p-4 shadow-md border border-indigo-100"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-indigo-800 font-medium truncate">{skill.skill}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(skill)} className="text-yellow-600 hover:text-yellow-800">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(skill.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-gray-500 text-xs">
                {new Date(skill.created_at).toLocaleString("en-US",{
                  year: "numeric",
                  month: "short",
                  day:"numeric",
                  hour:"2-digit",
                  minute:"2-digit",
                })}

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4">
              {currentSkill ? "Edit Skill" : "Add Skill"}
            </h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="Enter skill"
                required
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                >
                  {currentSkill ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

