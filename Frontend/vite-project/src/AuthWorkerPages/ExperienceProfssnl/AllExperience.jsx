// src/components/ProfessionalExperience.jsx
import React, { useEffect, useState, useCallback } from "react";
import api from "../../AxiosApi/Api"; // your axios instance
import { toast } from "react-hot-toast";
import { Plus, Trash2, Edit, Briefcase, Calendar } from "lucide-react";

/**
 * ProfessionalExperience
 * - Uses only React + Tailwind + Lucide
 * - Endpoints expected (matches your DRF):
 *   GET    user-job-seekers/professional/experience/
 *   POST   user-job-seekers/professional/experience/
 *   PATCH  user-job-seekers/professional/experience/<id>/
 *   DELETE user-job-seekers/professional/experience/<id>/destroy/
 *
 * Date format for inputs/display: YYYY-MM-DD (HTML date input)
 */

export default function ProfessionalExperience() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal + form state
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null); // object when editing
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentWorking, setCurrentWorking] = useState(false);
  const [responsibilities, setResponsibilities] = useState("");
  const [processing, setProcessing] = useState(false);

  // fetch items
  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("user-job-seekers/professional/experience/");
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error?.("Failed to load experience records");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // open add modal
  const openAdd = () => {
    setEditing(null);
    setCompany("");
    setLocation("");
    setRole("");
    setStartDate("");
    setEndDate("");
    setCurrentWorking(false);
    setResponsibilities("");
    setOpen(true);
  };

  // open edit modal
  const openEdit = (item) => {
    setEditing(item);
    setCompany(item.company || "");
    setLocation(item.location || "");
    setRole(item.role || "");
    setStartDate(item.start_date || "");
    setEndDate(item.end_date || "");
    setCurrentWorking(Boolean(item.current_working));
    setResponsibilities(item.responsibilities || "");
    setOpen(true);
  };

  // delete
  const handleDelete = async (id) => {
    if (!confirm("Delete this experience entry?")) return;
    try {
      await api.delete(`user-job-seekers/professional/experience/${id}/destroy/`);
      toast.success?.("Experience deleted");
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error?.("Failed to delete experience");
    }
  };

  // validation (client-side)
  const validateForm = () => {
    if (!company.trim()) return toast.error?.("Company name is required") || false;
    if (!role.trim()) return toast.error?.("Role / Position is required") || false;
    if (!startDate) return toast.error?.("Start date is required") || false;

    // parse dates
    const sd = new Date(startDate);
    if (isNaN(sd)) return toast.error?.("Invalid start date") || false;

    if (endDate) {
      const ed = new Date(endDate);
      if (isNaN(ed)) return toast.error?.("Invalid end date") || false;
      if (sd >= ed) return toast.error?.("Start date must be before end date") || false;
    }

    // not future start
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (sd > today) return toast.error?.("Start date cannot be in the future") || false;

    return true;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!validateForm()) return;
    setProcessing(true);

    const payload = {
      company: company.trim(),
      location: location.trim() || null,
      role: role.trim(),
      start_date: startDate,
      end_date: currentWorking ? null : (endDate || null),
      current_working: Boolean(currentWorking),
      responsibilities: responsibilities.trim() || null,
    };

    try {
      if (editing) {
        await api.patch(`user-job-seekers/professional/experience/${editing.id}/`, payload);
        toast.success?.("Experience updated");
      } else {
        await api.post("user-job-seekers/professional/experience/", payload);
        toast.success?.("Experience added");
      }
      setOpen(false);
      fetchItems();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.detail || "Failed to save experience";
      toast.error?.(msg);
    } finally {
      setProcessing(false);
    }
  };

  // close on Esc
  // useEffect(() => {
  //   const onKey = (ev) => {
  //     if (ev.key === "Escape") setOpen(false);
  //   };
  //   if (open) window.addEventListener("keydown", onKey);
  //   return () => window.removeEventListener("keydown", onKey);
  // }, [open]);

  // pretty date formatter: e.g. "Jan 2021" or "Jan 5, 2021"
  const formatDatePretty = (iso) => {
    if (!iso) return null;
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    } catch {
      return iso;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 rounded-3xl shadow-lg min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Briefcase className="w-7 h-7 text-indigo-600" />
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Experience</h2>
            <p className="text-sm text-gray-500">Add your professional work history.</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-2xl shadow transition"
          >
            <Plus className="w-4 h-4" /> Add Experience
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-10 text-gray-600">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💼</div>
          <p className="text-gray-500 mb-4">No experience records added yet.</p>
          <button onClick={openAdd} className="px-4 py-2 bg-indigo-600 text-white rounded-xl">
            Add your first experience
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((it) => (
            <article
              key={it.id}
              className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-lg transition border border-transparent hover:border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold text-gray-800 truncate">{it.role}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {it.company} {it.location ? <span className="text-gray-500">• {it.location}</span> : null}
                  </p>

                  <div className="mt-2 flex items-center gap-4">
                    <span className="inline-block px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-800">
                      {formatDatePretty(it.start_date)} — {it.current_working ? "Present" : formatDatePretty(it.end_date)}
                    </span>
                    <span className="text-sm text-gray-500">created at {new Date(it.created_at).toLocaleDateString()}</span>
                  </div>

                  {it.responsibilities ? (
                    <p className="mt-3 text-gray-700 text-sm line-clamp-4">{it.responsibilities}</p>
                  ) : (
                    <p className="mt-3 text-sm italic text-gray-400">No responsibilities provided</p>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 ml-4">
                  <button
                    onClick={() => openEdit(it)}
                    className="p-1 rounded-full hover:bg-yellow-50 text-yellow-600 transition"
                    title="Edit"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(it.id)}
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
      className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 transform transition-all 
                 max-h-[100vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">
          {editing ? "Edit Experience" : "Add Experience"}
        </h3>
        <button
          onClick={() => setOpen(false)}
          className="text-gray-500 hover:text-gray-700 rounded-full p-1"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
 
      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-600 block mb-1">Role / Position</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 
                       focus:outline-none focus:ring-2 focus:ring-indigo-300"
            placeholder="e.g. Frontend Developer"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="e.g. Acme Ltd"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 
                         focus:outline-none focus:ring-2 focus:ring-indigo-300"
              placeholder="e.g. Dar es Salaam"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-end">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">
              End Date (Leave blank if still working)
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={`w-full p-3 rounded-xl border border-gray-200 focus:outline-none 
                         focus:ring-2 focus:ring-indigo-300 ${
                           currentWorking ? "opacity-60 pointer-events-none" : ""
                         }`}
              disabled={currentWorking}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            id="currentWorking"
            type="checkbox"
            checked={currentWorking}
            onChange={(e) => {
              setCurrentWorking(e.target.checked);
              if (e.target.checked) setEndDate("");
            }}
            className="w-4 h-4 text-indigo-600"
          />
          <label htmlFor="currentWorking" className="text-sm text-gray-700">
            I currently work here
          </label>
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-1">Responsibilities (optional)</label>
          <textarea
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.target.value)}
            rows={4}
            className="w-full p-3 rounded-xl border border-gray-200 
                       focus:outline-none focus:ring-2 focus:ring-indigo-300"
            placeholder="Describe your responsibilities"
          />
        </div>

        <div className="flex justify-end gap-3 mt-2 pb-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
          >
            {editing ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
}
