
export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
                {/* Header */}
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-lg text-gray-600">
                        Last updated: January 2026
                    </p>
                </header>

                {/* Introduction */}
                <section className="mb-12 prose prose-lg mx-auto text-gray-700">
                    <p className="leading-relaxed">
                        AjiraUnity ("we", "our", "us") operates the AjiraUnity platform accessible at{" "}
                        <a href="https://www.ajiraunity.co.tz" className="text-indigo-600 hover:text-indigo-700 underline">
                            www.ajiraunity.co.tz
                        </a>{" "}
                        (the "Service"). This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our Service.
                    </p>
                </section>

                {/* Main Sections */}
                <div className="space-y-12">
                    {/* Information We Collect */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Information We Collect
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            We collect personal details (such as name, email address, phone number, and location), profile information provided by users, and job application information (such as CVs and cover letters, where applicable).
                        </p>
                    </section>

                    {/* How We Use Your Information */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            How We Use Your Information
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            We use your information to operate and improve AjiraUnity, including creating and managing user accounts, connecting job seekers with employers, facilitating job postings and applications, sending important notifications, enhancing security and platform performance, preventing fraud or misuse, and complying with legal obligations.
                        </p>
                    </section>

                    {/* Sharing of Information */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Sharing of Information
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            We respect your privacy and only share information when needed for AjiraUnity to work. We never sell your personal data. Your information may be shared with employers or job seekers as part of applications or job postings, with trusted service providers who help run the platform (like email or hosting), and when required by law or to protect the safety and rights of AjiraUnity and its users.
                        </p>
                    </section>

                    {/* Data Storage and Security */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Data Storage and Security
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            We take reasonable technical and organizational measures, including security best practices, to protect your data. However, no online service is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    {/* User Responsibilities */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            User Responsibilities
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            You are responsible for keeping your login credentials confidential, ensuring that the information you provide is accurate and lawful, and refraining from uploading misleading, fraudulent, or illegal content.
                        </p>
                    </section>

                    {/* Cookies */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Cookies
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            AjiraUnity uses cookies only for authentication purposes to keep you logged in and ensure the security of your account. We do not use cookies for tracking or advertising.
                        </p>
                    </section>

                    {/* Your Rights */}
                    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                            Your Rights
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            You have the right to access and update your personal information, request deletion of your account, and withdraw your consent where applicable. Any requests can be submitted to our support team through the AjiraUnity platform.
                        </p>
                    </section>

                    {/* Changes & Contact - Side by side on larger screens */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Changes to This Policy
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                We may update this Privacy Policy from time to time. Changes will be posted on this page.
                            </p>
                        </section>

                        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Contact Us
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                If you have questions about this Privacy Policy, please contact us via AjiraUnity support channels.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}