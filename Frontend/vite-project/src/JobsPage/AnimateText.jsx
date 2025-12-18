import { useEffect, useState } from "react";
import { Search } from "lucide-react";

const suggestText = [
    "Search jobs by regions, district, wards",
    "Search jobs in Arusha, Olasiti",
    "Search for professional jobs by titles, category",
    "Search  for Software development, Accountants jobs",
    "Search  Individual / Street causal jobs",
    "Search  for dada wa kazi,  kazi za ujenzi",
    "Search  for kazi za kuuza duka, garderns jobs",
];


export default function AnimateTextSuggestion(){
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(()=>{
        const interval = setInterval(() => {
            setFade(false);

            setTimeout(() => {
                setIndex((prev)=> (prev + 1) % suggestText.length);
                setFade(true);
                
            }, 400);
            
        }, 2500);

        return ()=> clearInterval(interval);

    }, []);

    return(
         <div className="relative w-full max-w-md">
      <div
        onClick={()=>console.log("hellow")}
        className="w-full px-4 py-3 border rounded-xl text-sm"
      > 

      <span
        className={`absolute left-4 top-3 text-gray-400 pointer-events-none transition-all duration-500
        ${fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
      `}
      >
        {suggestText[index]}
      </span>
      <Search/>
      </div>
    </div>

    )
}