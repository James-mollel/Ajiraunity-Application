import Navigation from "../Components/Navigation";
import FooterPublic from "../Components/FooterPublic";
import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";

export default function PublicLayouts() {
    return(
        <>
        <Navigation/>
        <Toaster position="top-right" />
        <main>
            <Outlet/>
        </main>
        <FooterPublic/>
        
        </>

    )
    
}