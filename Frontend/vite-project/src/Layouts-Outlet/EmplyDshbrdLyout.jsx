import { Outlet } from "react-router";
import EmployerSideBar from "../DashbdComponent/EmplyrSideBar";
import { Toaster } from "react-hot-toast";

export default function EmployerDashboardLayout() {
    return(
        <div className="flex">
            <EmployerSideBar/>
            <div className="flex-1 transition-all duration-300" >
                <main className="lg:p-4 bg-gray-100 min-h-screen">
                    <Toaster position="top-right" />
                    <Outlet/>
                </main>
            </div>
        </div>
    )
    
}