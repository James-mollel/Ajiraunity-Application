export default function FullScreenLoader() {
  return (
     <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
      <div className="relative flex flex-col items-center">
        
        {/* The Outer Animated Ring */}
        <div className="absolute h-16 w-16 animate-ping rounded-full bg-indigo-400/20 duration-1000"></div>
        
        {/* The Main Spinning Element */}
        <div className="relative h-14 w-14 flex items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-slate-100 border-t-indigo-600 border-r-emerald-500"></div>
          
          {/* Brand Initial or Logo (Optional) */}
          <span className="text-[10px] font-black text-indigo-600 tracking-tighter uppercase">
            AU
          </span>
        </div>

        {/* Text with Shimmer Effect */}
        <div className="mt-6 flex flex-col items-center gap-1">
          <span className="text-sm font-bold text-slate-900 tracking-widest uppercase animate-pulse">
            AjiraUnity
          </span>
          <div className="flex items-center gap-1">
             <span className="h-1 w-1 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]"></span>
             <span className="h-1 w-1 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]"></span>
             <span className="h-1 w-1 rounded-full bg-emerald-500 animate-bounce"></span>
          </div>
        </div>
      </div>
    </div>
  );
}


   
