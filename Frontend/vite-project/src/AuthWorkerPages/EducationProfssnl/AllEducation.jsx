// src/components/ProfessionalEducation.jsx
import React, { useEffect, useState, useCallback } from "react";
import api from "../../AxiosApi/Api"; // your axios instance
import { toast } from "react-hot-toast"; // optional (you already used it)
import { Plus, Trash2, Edit, GraduationCap } from "lucide-react";

/**
 * ProfessionalEducation
 * - Uses only React + Tailwind + Lucide
 * - Endpoints expected:
 *   GET  user-job-seekers/professional/education/
 *   POST user-job-seekers/professional/education/
 *   PATCH user-job-seekers/professional/education/<id>/
 *   DELETE user-job-seekers/professional/education/<id>/destroy/
 */
export default function ProfessionalEducation() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal & form state
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null); // item or null
  const [school, setSchool] = useState("");
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [educationLevel, setEducationLevel] = useState("bachelor");
  const [processing, setProcessing] = useState(false);

  const LEVELS = [
    { value: "primary", label: "Primary School" },
    { value: "secondary", label: "High School / Secondary" },
    { value: "certificate", label: "Certificate" },
    { value: "diploma", label: "Diploma" },
    { value: "bachelor", label: "Bachelor's Degree" },
    { value: "master", label: "Master's Degree" },
    { value: "phd", label: "PhD / Doctorate" },
  ];

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await api.get("user-job-seekers/professional/education/");
      setItems(resp.data || []);
    } catch (err) {
      console.error(err);
      toast.error?.("Failed to load education records");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // open modal for add
  const handleOpenAdd = () => {
    setEditing(null);
    setSchool("");
    setDegree("");
    setFieldOfStudy("");
    setStartYear("");
    setEndYear("");
    setEducationLevel("bachelor");
    setOpen(true);
  };

  // open modal for edit
  const handleOpenEdit = (item) => {
    setEditing(item);
    setSchool(item.school || "");
    setDegree(item.degree || "");
    setFieldOfStudy(item.field_of_study || "");
    setStartYear(item.start_year || "");
    setEndYear(item.end_year || "");
    setEducationLevel(item.education_level || "bachelor");
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this education entry?")) return;
    try {
      await api.delete(`user-job-seekers/professional/education/${id}/destroy/`);
      toast.success?.("Education deleted");
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error?.("Failed to delete education");
    }
  };

  const validateForm = () => {
    if (!school.trim()) {
      toast.error?.("School name is required");
      return false;
    }
    if (!startYear.trim()) {
      toast.error?.("Start year is required");
      return false;
    }
    // optional: validate numeric years
    if (startYear && isNaN(parseInt(startYear, 10))) {
      toast.error?.("Start year must be a number");
      return false;
    }
    if (endYear && isNaN(parseInt(endYear, 10))) {
      toast.error?.("End year must be a number");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validateForm()) return;
    setProcessing(true);

    const payload = {
      school: school.trim(),
      degree: degree.trim() || null,
      field_of_study: fieldOfStudy.trim() || null,
      start_year: startYear.trim(),
      end_year: endYear.trim() || "",
      education_level: educationLevel,
    };

    try {
      if (editing) {
        await api.patch(`user-job-seekers/professional/education/${editing.id}/`, payload);
        toast.success?.("Education updated");
      } else {
        await api.post("user-job-seekers/professional/education/", payload);
        toast.success?.("Education added");
      }
      setOpen(false);
      fetchItems();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.detail || "Failed to save education";
      toast.error?.(msg);
    } finally {
      setProcessing(false);
    }
  };

  // close modal on Esc key
  // useEffect(() => {
  //   const onKey = (e) => {
  //     if (e.key === "Escape") setOpen(false);
  //   };
  //   if (open) window.addEventListener("keydown", onKey);
  //   return () => window.removeEventListener("keydown", onKey);
  // }, [open]);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 rounded-3xl shadow-lg min-h-screen">
      {/* header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <GraduationCap className="w-7 h-7 text-indigo-600" />
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Education</h2>
            <p className="text-sm text-gray-500">Add your academic background and qualifications.</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-2xl shadow transition"
          >
            <Plus className="w-4 h-4" /> Add Education
          </button>
        </div>
      </div>

      {/* content */}
      {loading ? (
        <div className="text-center py-10 text-gray-600">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎓</div>
          <p className="text-gray-500 mb-4">No education records added yet.</p>
          <button onClick={handleOpenAdd} className="px-4 py-2 bg-indigo-600 text-white rounded-xl">
            Add your first education
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((e) => (
            <article
              key={e.id}
              className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-lg transition border border-transparent hover:border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold text-gray-800 truncate">{e.school}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {e.degree || <span className="italic text-gray-400">No degree provided</span>}
                    {e.field_of_study ? (
                      <span className="text-gray-500"> • {e.field_of_study}</span>
                    ) : null}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="inline-block px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-800">
                      {e.education_level_display || e.education_level}
                    </span>
                    <span className="text-sm text-gray-500">
                      {e.start_year} — {e.end_year || "Present"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 ml-4">
                  <button
                    onClick={() => handleOpenEdit(e)}
                    className="p-1 rounded-full hover:bg-yellow-50 text-yellow-600 transition"
                    title="Edit"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="p-1 rounded-full hover:bg-red-50 text-red-600 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Centered modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 transform transition-all scale-100
             max-h-[100vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{editing ? "Edit Education" : "Add Education"}</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700 rounded-full p-1"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 block mb-1">School</label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="e.g. University of Dar es Salaam"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Degree</label>
                  <input
                    type="text"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    placeholder="e.g. Bachelor of Science"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-1">Field of Study</label>
                  <input
                    type="text"
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    placeholder="e.g. Computer Science"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Start Year</label>
                  <input
                    type="text"
                    value={startYear}
                    onChange={(e) => setStartYear(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    placeholder="e.g. 2018"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-1">End Year (optional)</label>
                  <input
                    type="text"
                    value={endYear}
                    onChange={(e) => setEndYear(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    placeholder="e.g. 2021 or leave blank"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">Education Level</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {LEVELS.map((lvl) => (
                    <button
                      key={lvl.value}
                      type="button"
                      onClick={() => setEducationLevel(lvl.value)}
                      className={`text-sm px-3 py-2 rounded-xl border font-medium text-left transition ${
                        educationLevel === lvl.value
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-700 border-gray-200 hover:shadow-sm"
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
                  disabled={processing}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={processing}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-60"
                >
                  {processing ? (editing ? "Updating..." : "Adding...") : editing ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
