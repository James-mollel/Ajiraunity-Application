import { Outlet } from "react-router";
import WorkerSideBar from "../DashbdComponent/WorkerSideBar";
import { Toaster } from "react-hot-toast";

export default function WorkerDashboardLayout() {
    return(
        <div className="flex">
            <WorkerSideBar/>
            <div className="flex-1 transition-all duration-300" >
                <main className="pt-1 bg-gray-100 min-h-screen">
                    <Toaster position="top-right" />
                    <Outlet/>
                </main>
            </div>
        </div>
    )
    
}