
import toast from "react-hot-toast";
import api from "../AxiosApi/Api";
import FullScreenLoader from "../Components/Loader";
import {
  LoaderIcon, Search, MapPin, Building2, DollarSign, Award,
  Heart, Briefcase, BriefcaseBusiness, X, ChevronLeft, ChevronRight,
  BadgeInfo, Tags, Sparkles
} from "lucide-react";
import { useEffect, useState, useRef } from "react";

// === Enhanced Suggestions Search ===
export default function SuggestionsJobsSearch  ({ onSelectSuggestion, initialQuery = "" }) {
  const [suggestions, setSuggestions] = useState([]);
  const [text, setText] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const getIconByType = (type) => {
    switch (type) {
      case 'title': return <BadgeInfo className="w-4 h-4" />;
      case 'category': return <Tags className="w-4 h-4" />;
      case 'region':
      case 'district':
      case 'ward': return <MapPin className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  const getColorByType = (type) => {
    switch (type) {
      case 'title': return "text-purple-600 bg-purple-50";
      case 'category': return "text-emerald-600 bg-emerald-50";
      case 'region':
      case 'district':
      case 'ward': return "text-rose-600 bg-rose-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  useEffect(() => {
    if (text.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/jobs/users/public/jobs/search/suggestions/", {
          params: { query: text }
        });
        setSuggestions(data.suggestions || []);
      } catch (err) {
        console.error("Suggestions error:", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [text]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative flex items-center bg-white border-2 border-gray-200 rounded-2xl shadow-inner focus-within:border-indigo-500 focus-within:shadow-lg transition-all duration-300">
        <div className="pl-5 pr-3">
          {loading ? (
            <LoaderIcon className="w-5 h-5 animate-spin text-indigo-600" />
          ) : (
            <Search className="w-5 h-5 text-gray-500" />
          )}
        </div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search by job title, skill, location..."
          className="w-full py-4 pr-5 text-lg outline-none bg-transparent text-gray-800 placeholder-gray-400"
        />
        {text && (
          <button
            onClick={() => setText("")}
            className="absolute right-3 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-5 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
            <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Smart Suggestions
            </p>
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {suggestions.map((item, i) => (
              <li
                key={i}
                onClick={() => {
                  onSelectSuggestion(item);
                  setText(item.text);
                  setSuggestions([]);
                }}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getColorByType(item.type)}`}>
                    {getIconByType(item.type)}
                  </div>
                  <span className="font-medium text-gray-800">{item.text}</span>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getColorByType(item.type)}`}>
                  {item.type}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
