import { MailCheck, Sparkles } from "lucide-react";

export default function PendingEmailVerificationPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <div className="max-w-3xl w-full rounded-2xl shadow-2xl border border-indigo-100 p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-indigo-500 to-blue-700"></div>

        <div className="flex justify-center mb-6">
          <div className="bg-indigo-100 p-4 rounded-full shadow-md">
            <MailCheck className="w-10 h-10 text-indigo-600" />
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900">
          Welcome to <span className="font-inter">Ajira<span className="text-indigo-600">unity</span></span> Tanzania 🥳
        </h1>

       <p className="mt-4 text-gray-700 leading-relaxed">
          Thanks for joining the <span className="font-shadows">Ajiraunity</span> community!  
          We’ve sent a <span className="font-semibold text-indigo-600">verification link</span> to your email.  
          Please confirm your account to start connecting — whether you're looking for the right talent or the right opportunity.
        </p>

 
        <div className="mt-6 bg-gradient-to-r from-indigo-400 to-blue-700 text-blue-100 rounded-full py-3 px-6 font-semibold shadow-md inline-flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5" />
          <span>You’re almost there — just one click away!</span>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Didn’t receive the email? Check your spam folder or try resending.
        </p>
      </div>
    </div>
  );
}
