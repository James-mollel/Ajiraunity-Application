import React, { useEffect, useState } from "react";
import api from "../../AxiosApi/Api";
import { toast } from "react-hot-toast";
import { Trash2, Edit, Plus, Globe } from "lucide-react";
import { Combobox } from "@headlessui/react";

// --- Constants (move to separate file if you prefer) -----------------
const LEVELS = [
  { key: "basic", label: "Basic", emoji: "🔰" },
  { key: "conversational", label: "Conversational", emoji: "🗣️" },
  { key: "fluent", label: "Fluent", emoji: "✨" },
  { key: "native", label: "Native", emoji: "🏅" },
];

const LANGUAGE_OPTIONS = [
  "English",
  "Kiswahili",
  "French",
  "Arabic",
  "Spanish",
  "Chinese (Mandarin)",
  "Hindi",
  "Portuguese",
  "German",
  "Italian",
  "Russian",
  "Turkish",
  "Dutch",
  "Japanese",
  "Korean",

  // African languages
  "Amharic",
  "Somali",
  "Yoruba",
  "Igbo",
  "Hausa",
  "Zulu",
  "Xhosa",
  "Afrikaans",
  "Luganda",
  "Kinyarwanda",
  "Kirundi",
  "Shona",
  "Lingala",
  "Tigrinya",
  "Oromo",
];

const flagForLanguage = (lang) => {
  if (!lang) return "🌐";
  const code = lang.toLowerCase();
  if (code.includes("english") || code.includes("eng") || code === "en") return "🇬🇧";
  if (code.includes("french") || code.includes("fr")) return "🇫🇷";
  if (code.includes("swahili") || code.includes("kiswahili") || code.includes("sw")) return "🇹🇿"; // Kenya/Tanzania
  if (code.includes("spanish") || code.includes("es")) return "🇪🇸";
  if (code.includes("arabic") || code.includes("ar")) return "🇸🇦";
  if (code.includes("chinese") || code.includes("mandarin") || code.includes("zh")) return "🇨🇳";
  if (code.includes("hindi") || code.includes("hi")) return "🇮🇳";
  if (code.includes("portuguese") || code.includes("pt")) return "🇵🇹";
  if (code.includes("german") || code.includes("de")) return "🇩🇪";
  if (code.includes("italian") || code.includes("it")) return "🇮🇹";
  if (code.includes("russian") || code.includes("ru")) return "🇷🇺";
  if (code.includes("japanese") || code.includes("ja")) return "🇯🇵";
  if (code.includes("korean") || code.includes("ko")) return "🇰🇷";
  if (code.includes("amharic")) return "🇪🇹";
  if (code.includes("somali")) return "🇸🇴";
  if (code.includes("yoruba") || code.includes("igbo") || code.includes("hausa")) return "🇳🇬";
  if (code.includes("afrikaans")) return "🇿🇦";
  return "🌐";
};

// ---------------------------------------------------------------------

export default function ProfessionalLanguages() {
  // user languages stored on server
  const [userLanguages, setUserLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal & form state
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // null = add, object = edit
  const [languageName, setLanguageName] = useState("");
  const [level, setLevel] = useState("basic");
  const [processing, setProcessing] = useState(false);

  // combobox search
  const [query, setQuery] = useState("");

  // fetch languages from API
  const fetchLanguages = async () => {
    setLoading(true);
    try {
      const resp = await api.get("user-job-seekers/professional/languages/");
      setUserLanguages(resp.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load languages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  const openAdd = () => {
    setEditing(null);
    setLanguageName("");
    setLevel("basic");
    setQuery("");
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setLanguageName(item.language || "");
    setLevel(item.level || "basic");
    setQuery("");
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this language?");
    if (!ok) return;
    try {
      await api.delete(`user-job-seekers/professional/languages/${id}/destroy/`);
      toast.success("Language deleted");
      fetchLanguages();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete language");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!languageName || !languageName.trim()) return toast.error("Please select a language");

    setProcessing(true);
    try {
      if (editing) {
        await api.patch(`user-job-seekers/professional/languages/${editing.id}/`, {
          language: languageName,
          level,
        });
        toast.success("Language updated");
      } else {
        await api.post("user-job-seekers/professional/languages/", {
          language: languageName,
          level,
        });
        toast.success("Language added");
      }
      setShowModal(false);
      fetchLanguages();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save language");
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return iso;
    }
  };

  // Combobox filtered options
  const filteredLanguages =
    query === ""
      ? LANGUAGE_OPTIONS
      : LANGUAGE_OPTIONS.filter((lang) => lang.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-3xl shadow-lg min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-indigo-600" />
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Languages</h2>
            <p className="text-sm text-gray-500">Add languages you speak and your proficiency.</p>
          </div>
        </div>

        <div className="flex gap-3 mt-4 sm:mt-0">
          <button
            onClick={openAdd}
            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-2xl hover:bg-indigo-700 shadow transition"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Language
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-center py-6 text-gray-600">Loading languages...</p>
      ) : userLanguages.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌐</div>
          <p className="text-gray-500 mb-4">No languages added yet.</p>
          <button onClick={openAdd} className="px-4 py-2 bg-indigo-600 text-white rounded-xl">
            Add your first language
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {userLanguages.map((l) => (
            <div
              key={l.id}
              className="flex flex-col justify-between bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{flagForLanguage(l.language)}</div>
                  <div className="min-w-0">
                    <div className="text-lg font-semibold text-gray-800 truncate">{l.language}</div>
                    <div className="text-sm text-gray-500 mt-1">{formatDate(l.created_at)}</div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div
                    className={`px-3 py-1 text-xs font-semibold rounded-full tracking-wide shadow-sm capitalize ${
                      l.level === "native"
                        ? "bg-green-100 text-green-800"
                        : l.level === "fluent"
                        ? "bg-blue-100 text-blue-800"
                        : l.level === "conversational"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {LEVELS.find((x) => x.key === l.level)?.label || l.level}
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => openEdit(l)} className="text-yellow-600 hover:text-yellow-800">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(l.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-xs text-gray-500">Proficiency</div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-200 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-3">{editing ? "Edit Language" : "Add Language"}</h3>

            <form onSubmit={handleSubmit}>
              <label className="text-sm text-gray-600">Language</label>

              <Combobox value={languageName} onChange={setLanguageName} nullable>
                <div className="relative mt-1">
                  <Combobox.Input
                    className="w-full p-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Search or select language..."
                    onChange={(e) => setQuery(e.target.value)}
                    displayValue={(lang) => lang}
                  />

                  {filteredLanguages.length > 0 && (
                    <Combobox.Options className="absolute z-50 w-full bg-white mt-2 shadow-xl rounded-xl max-h-60 overflow-y-auto border border-gray-200">
                      {filteredLanguages.map((lang) => (
                        <Combobox.Option
                          key={lang}
                          value={lang}
                          className={({ active }) =>
                            `cursor-pointer px-4 py-2 flex items-center gap-3 border-b last:border-b-0 ${
                              active ? "bg-indigo-100" : ""
                            }`
                          }
                        >
                          <span className="text-lg">{flagForLanguage(lang)}</span>
                          <span className="text-gray-800 font-medium">{lang}</span>
                        </Combobox.Option>
                      ))}
                    </Combobox.Options>
                  )}
                </div>
              </Combobox>

              <label className="text-sm text-gray-600 mb-2 block mt-4">Level</label>

              {/* Segment Buttons */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {LEVELS.map((lvl) => (
                  <button
                    type="button"
                    key={lvl.key}
                    onClick={() => setLevel(lvl.key)}
                    className={`flex items-center gap-2 justify-center p-2 rounded-xl border font-medium hover:scale-[1.01] transition ${
                      level === lvl.key
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-700 border-gray-200"
                    }`}
                  >
                    <span className="text-lg">{lvl.emoji}</span>
                    <span className="text-sm">{lvl.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={processing}
                  className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={processing || !languageName}
                  className={`px-4 py-2 rounded-xl ${
                    processing || !languageName
                      ? "bg-indigo-300 text-white cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
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
