export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Terms of Service
                    </h1>
                    <p className="text-lg text-gray-600">
                        Last updated: January 2026
                    </p>
                </header>

                <section className="mb-12 prose prose-lg mx-auto text-gray-700">
                    <p className="leading-relaxed text-center">
                        By accessing or using AjiraUnity, you agree to be bound by these Terms of Service ("Terms"). Please read them carefully.
                    </p>
                </section>

                <div className="space-y-12">
                    {/* Eligibility */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Eligibility
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            You must be at least 18 years old to use AjiraUnity. By registering, you confirm that you meet this requirement.
                        </p>
                    </section>

                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Account Registration
                        </h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
                            <li>Users must register as either Employer or Job Seeker.</li>
                            <li>You are responsible for maintaining the confidentiality of your account.</li>
                            <li>You agree to provide accurate and complete information.</li>
                        </ul>
                    </section>

                    {/* Platform Purpose */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Platform Purpose
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            AjiraUnity is a job connection platform. We do not:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
                            <li>Guarantee employment</li>
                            <li>Act as an employer or recruitment agency</li>
                        </ul>
                    </section>


                    {/* Job Postings and Applications */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Job Postings and Applications
                        </h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
                            <li>Employers are responsible for the accuracy and legality of job posts.</li>
                            <li>Job seekers are responsible for information shared in applications.</li>
                            <li>Fraudulent, misleading, or harmful content is prohibited.</li>
                        </ul>
                    </section>

                    {/* Individual vs. Company Posts */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Individual vs. Company Posts
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            We allow both registered companies and private individuals to post jobs.
                        </p>
                    </section>

                    {/* Prohibited Activities */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Prohibited Activities
                        </h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            You agree not to:
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
                            <li>Post fake or scam jobs</li>
                            <li>Harass, abuse, or discriminate against others</li>
                            <li>Upload malicious software or spam</li>
                            <li>Misuse user data obtained from the platform</li>
                        </ul>
                    </section>

                    {/* Contact Information */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Contact Information
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            For questions regarding these Terms, please contact AjiraUnity through official support channels.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}