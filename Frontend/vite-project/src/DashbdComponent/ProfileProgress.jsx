import { useEffect, useState } from "react";
import { TriangleAlert,Angry,Smile } from "lucide-react";


export default function ProfileProgress() {
    const [profileData, useProfile] = useState({
            FullName :'james mollel',
            LastName: "",
            Phone:'',
            Email:'james@gmail.com',
            Avata: 'face2.jpeg',
            Skills: ["d","d"]
        }
    )
    const [missData, setMissData] = useState([]);
    const [progress, setProgress] = useState(0);

    useEffect(()=>{
        const handle = (profileData)=>{
            const compareData = ["FullName","LastName","Skills","Phone","Email"];

            const clearData = compareData.filter((c)=>{
                const current = profileData[c];
                if(Array.isArray(current)){
                    return current.length > 0;
                }
                return current && current.trim() !== "";
            })

            const missed = compareData.filter((c)=>{
                return !clearData.includes(c);
            });
            setMissData(missed);

            const progressValue = Math.round((clearData.length/compareData.length)*100);

            return progressValue;
        }
        setProgress(handle(profileData))

    },[profileData]);

    const textColor =()=>{
        if (progress < 40){
            return "text-red-500";
        } 
        else if(progress < 70 ){
            return "text-yellow-500";
        }
        else{
            return "text-green-700";
        }
    }

    const bgColor = ()=>{
        if (progress < 40) {
            return "#ef4444"   
        } else if (progress < 70) {
            return "#f59e0b";
        }else{
            return "#22c55e"
        }
    }

    const radius = 40;
    const circumference = 2* Math.PI * radius;
    const offset = circumference - (progress/100) * circumference

    if(profileData=== null){
        return <p className="text-center text-gray-700">Wait...</p>
    }


    return(
        <div className="container flex justify-center items-center">
           <div className="shadow-lg px-4 py-6 rounded-md">
                <div className="w-full flex space-x-4 items-center py-2 border-b">
                    <img src={profileData.Avata}  alt="prfile image" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                        <p className="text-gray-800 font-inter text-sm capitalize">{profileData.FullName}</p>
                        <p className="text-gray-400 text-xs capitalize">Maendeleo ya Profaili Yako</p>
                    </div>
                </div>

            <div className="relative flex justify-center items-center w-28 h-28 mx-auto">
                <svg className="transform -rotate-90 w-28 h-28">
                    <circle 
                     cx="56"
                     cy="56"
                     r={radius}
                     stroke="#e5e7eb"
                     strokeWidth="10"
                     fill="none"
                    />
                    <circle
                     cx="56"
                     cy="56"
                     r={radius}
                     stroke={bgColor()}
                     strokeWidth="10"
                     fill="none"
                     strokeLinecap="round"
                     strokeDasharray={circumference}
                     strokeDashoffset={offset}
                     style={{
                        transition: "stroke-dashoffset 0.6s ease-out, stroke 0.6s ease-out"
                     }}
                     
                    />

                </svg>
                <span className={`absolute text-xl font-semibold transition-all duration-500 ease-out ${textColor()}`}
                style={{transform: `scale(${progress === 100? 1.1 : 1})`}}
                >
                    {progress}%
                </span>

            </div>
            <div className="text-center mt-3 container">
                {progress === 100? (
                    <div className="flex items-center justify-center space-x-2  py-1 px-4 bg-green-500/10">
                        <p className="text-green-500">Hongera Profaili imekamilika!</p>
                      <div className="text-green-500 p-2  rounded-full font-extrabold">
                        <Smile/>
                      </div>

                    </div>
                ):(

                     <div className={`flex items-center justify-center space-x-2 py-2 px-4 ${progress<40?'bg-red-600/10':'bg-yellow-600/20'}` }>
                        <p className={`${progress<40?'text-red-500':'text-yellow-500'}` } >Profaili bado Haijakamilika!</p>
                      <div className={`${progress<40?'text-red-500':'text-yellow-500'}  font-extrabold` }>
                        <Angry/>
                      </div>

                    </div>
                    
                )}
            </div>

            <div className="container p-2">
                {progress<100 && (
                 <div>  
                    <h1 className="text-gray-700">Sehemu Ambazo Hazijajazwa!. <span className="text-xs text-red-400">{missData.length}</span></h1>
                       <ul className="text-red-400 space-y-1">
                          {missData.map((c)=>( 
                                <li key={c} className="flex items-center space-x-3"><TriangleAlert/> <p> {c} </p></li>
                             ))}
                       </ul>
                </div>

                )}

            </div>
          

            </div>
    


        </div>
    )
}