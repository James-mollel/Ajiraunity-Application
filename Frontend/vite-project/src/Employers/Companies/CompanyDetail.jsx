import { useEffect, useState } from "react";
import api from "../../AxiosApi/Api";
import FullScreenLoader from "../../Components/Loader";
import { toast } from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom"; // Use 'react-router-dom'
import { 
    Building2, 
    Pencil, 
    Trash2, 
    Globe, 
    Mail, 
    Calendar, 
    Users, 
    MapPin,
    CheckCircle,
    Clock 
} from "lucide-react";


export default function ViewCompanyDetails() {
    const [loading, setLoading] = useState(true);
    const [company, setCompany] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const { CompPk } = useParams();
    const navigate = useNavigate();

    // --- Data Fetching ---
    const fetchCompany = async () => {
        try {
            const resp = await api.get(`jobs/users/company/user-retrieve/${CompPk}/comp/`);
            setCompany(resp.data);
        } catch (err) {
            console.error("Fetch company error:", err);
            toast.error(
                err.response 
                ? "Failed to fetch company details. The company may not exist or an error occurred." 
                : "Network error. Please check your connection."
            );
            // Optionally redirect if company is not found
            if (err.response && err.response.status === 404) {
                setTimeout(() => navigate("/dashboard-user-employer/list-all-companies-employer/"), 2000);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompany();
    }, [CompPk]);

    // --- Delete Handler ---
    const handleDeleteCompany = async () => {
        if (!company) return; // Safety check
        if (!confirm(`Are you absolutely sure you want to delete the company "${company.name}"? This action cannot be undone.`)) return;
        
        setDeleting(true);
        try {
            await api.delete(`jobs/users/company/user-retrieve/${CompPk}/comp/`);
            toast.success(`${company.name} successfully deleted.`);
            
            setTimeout(() => {
                navigate("/dashboard-user-employer/list-all-companies-employer/");
            }, 1000);

        } catch (err) {
            console.error("Delete company error:", err);
            toast.error(
                err.response 
                ? "Failed to delete company. Please try again later." 
                : "Network error during deletion."
            );
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return <FullScreenLoader />;
    }

    if (!company) {
        // Handle case where fetch failed and state is null
        return (
            <div className="p-8 text-center text-gray-600">
                <h3 className="text-xl font-semibold">Company Data Not Available</h3>
                <p>We could not load the details for this company.</p>
            </div>
        );
    }

    // Verification Badge logic
    const isVerified = company.is_verified;
    const verificationBadge = isVerified ? (
        <span className="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1.5" /> Verified
        </span>
    ) : (
        <span className="inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4 mr-1.5" /> Pending Verification
        </span>
    );


    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                
                {/* Header Section: Title, Logo, Status */}
                <header className="bg-white p-6 rounded-t-xl shadow-md border-b-4 border-indigo-600 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    
                    {/* Logo and Main Info */}
                    <div className="flex items-start gap-5">
                        <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-xl shadow-inner p-2 flex items-center justify-center">
                            {company.logo_url ? (
                                <img
                                    src={company.logo_url}
                                    alt={`${company.name} logo`}
                                    className="w-full h-full object-contain rounded-lg"
                                />
                            ) : (
                                <Building2 className="w-10 h-10 text-indigo-600 opacity-60" />
                            )}
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
                                {company.name}
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Created: {new Date(company.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="mt-4 sm:mt-0">
                        {verificationBadge}
                    </div>

                </header>

                {/* Main Content Area (Grid Layout) */}
                <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    
                    {/* Column 1 & 2: Details and Summary (Span 2/3 width) */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Summary Section */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                                Company Summary
                            </h2>
                            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                                {company.description || (
                                    <span className="italic text-gray-400">
                                        No description provided.
                                    </span>
                                )}
                            </p>
                        </div>

                        {/* General Information Section */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                                General Information
                            </h2>
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                                {/* Industry */}
                                <DetailItem icon={<Building2 className="w-5 h-5 text-indigo-500" />} label="Industry" value={company.industry} />
                                {/* Employee Size */}
                                <DetailItem icon={<Users className="w-5 h-5 text-teal-500" />} label="Employee Size" value={company.employees_size_display} />
                                {/* Year Founded */}
                                <DetailItem icon={<Calendar className="w-5 h-5 text-orange-500" />} label="Year Founded" value={company.year_founded || "Not provided"} />
                                {/* Address */}
                                <DetailItem icon={<MapPin className="w-5 h-5 text-red-500" />} label="Headquarters Address" value={company.address} />
                            </dl>
                        </div>

                    </div>

                    {/* Column 3: Actions and Communication Links (1/3 width) */}
                    <div className="lg:col-span-1 space-y-6">
                        
                        {/* Action Buttons Card */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-4">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                                Actions
                            </h2>
                            <div className="space-y-4">
                                
                                {/* Edit Button */}
                                <button
                                    onClick={() => navigate(`/dashboard-user-employer/edit-company-detail/${CompPk}`)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 transition duration-150 shadow-md transform hover:scale-[1.01]"
                                >
                                    <Pencil className="w-5 h-5" />
                                    Edit Company Profile
                                </button>

                                {/* Delete Button */}
                                <button
                                    onClick={handleDeleteCompany}
                                    disabled={deleting}
                                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-white font-semibold rounded-lg transition duration-150 shadow-md 
                                        ${deleting 
                                            ? "bg-gray-400 cursor-not-allowed" 
                                            : "bg-red-600 hover:bg-red-700 transform hover:scale-[1.01]"
                                        }`}
                                >
                                    {deleting ? (
                                        <>
                                            <Trash2 className="w-5 h-5 animate-pulse" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-5 h-5" />
                                            Delete Company
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Communication Links Section */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
                                Contact Information
                            </h2>
                            <dl className="space-y-4 text-sm">
                                {/* Website */}
                                <DetailLink 
                                    icon={<Globe className="w-5 h-5 text-blue-500" />} 
                                    label="Website" 
                                    value={company.website} 
                                    isLink={true}
                                />
                                {/* Email */}
                                <DetailItem 
                                    icon={<Mail className="w-5 h-5 text-pink-500" />} 
                                    label="Company Email" 
                                    value={company.email} 
                                />
                            </dl>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

// --- Helper Components for clean UI/UX ---

// Reusable component for displaying a label/value pair with an icon
const DetailItem = ({ icon, label, value }) => (
    <div className="flex items-start space-x-3">
        <div className="mt-1 text-gray-500 flex-shrink-0">
            {icon}
        </div>
        <div>
            <dt className="font-medium text-gray-500">{label}</dt>
            <dd className="text-gray-800 font-semibold">{value || "N/A"}</dd>
        </div>
    </div>
);

// Reusable component for displaying links
const DetailLink = ({ icon, label, value, isLink = false }) => {
    const displayValue = value || (isLink ? "Not provided" : "N/A");
    let content = <dd className="text-gray-800 font-semibold">{displayValue}</dd>;
    
    // Check if the value is a valid link to render an anchor tag
    if (isLink && value) {
        // Simple prefix check for safety and consistency
        const href = value.startsWith('http') ? value : `https://${value}`;
        content = (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 font-semibold break-all transition duration-150">
                {displayValue}
            </a>
        );
    }

    return (
        <div className="flex items-start space-x-3">
            <div className="mt-1 text-gray-500 flex-shrink-0">
                {icon}
            </div>
            <div>
                <dt className="font-medium text-gray-500">{label}</dt>
                {content}
            </div>
        </div>
    );
};