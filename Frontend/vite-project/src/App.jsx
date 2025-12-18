import { BrowserRouter,Route,Routes } from "react-router";
import api from "./AxiosApi/Api";
import "./index.css"
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

//pages publics 
import LoginPage from "./Pages/LoginPage";
import WorkerRegistrationPage from "./Pages/WorkerRegisterPage";
import EmployerRegistrationPage from "./Pages/EmployerRegisterPage";
import ChooseRegisterType from "./Components/ChooseRegType";
import PendingEmailVerificationPage from "./Pages/PendingEmailVerify";
import VerifyEmailPage from "./Pages/VerifyEmailPage";
import EnterEmailResetPassword from "./ResetPassword/EnterEmail";
import PasswordChange from "./ResetPassword/PasswordChange";

import AnimateTextSuggestion from "./JobsPage/AnimateText";
import HomePage from "./JobsPage/HomePage";
import AllJobsListedPublic from "./JobsPage/AllJobsPosted";
import JobDetailsPage from "./JobsPage/JobDetails";

import AboutUs from "./Pages/About";
import NotFound from "./Pages/NotFound";


// ================ layouts===========
import PublicLayouts from "./Layouts-Outlet/PublicLayout";
import EmployerDashboardLayout from "./Layouts-Outlet/EmplyDshbrdLyout";
import WorkerDashboardLayout from "./Layouts-Outlet/WorkrDsbrdLyout";

// private pages =========EMPLOYER=========
import EmployerDashboard from "./Employers/EmployerDshord";
import ChooseJobPostType from "./Employers/chooseJobType";
import PostNormalIndividualJobs from "./Employers/PostNormalJobs";
import JobPostedSuccessMessage from "./Employers/SuccessJobMessage";
import CreateCompanyModel from "./Employers/Companies/CreateCompany";
import ConfirmCompanyToPostJob from "./Employers/ConfirmCompany";
import AllJobsPostedByEmployer from "./Employers/AllJobs/AllJobsPosted";
import ViewCompanyJobDetails from "./Employers/AllJobs/ViewCompanyJob";
import ViewNormalJobDetails from "./Employers/AllJobs/ViewNormalJob";

import EditNormalIndividualJob from "./Employers/EditJobs/EditNormalJobs";
import EditProfessionalJob from "./Employers/EditJobs/EditProfessionalJob";

import ListAllCompanies from "./Employers/Companies/AllCompanies";
import ViewCompanyDetails from "./Employers/Companies/CompanyDetail";
import EditCompanyDetails from "./Employers/Companies/EditCompany";

import PostProfessionalJobs from "./Employers/PostProfessionalJobs";

import AllApplicationsPage from "./Employers/Applications/AllApplications";
import ViewApplicationDetails from "./Employers/Applications/ViewApplications";

//employer -------------PROFILE INFO----------------
import EmployerProfileInfo from "./Employers/Profile/ProfilePage";
// ------------------- CONTEXT------------
import EmployerCounterProvider from "./Employers/Context/CounterContex";



// private pages =========JOB SEEKERS=========
import ChooseWorkerTypePage from "./AuthWorkerPages/ChooseWorkrType";
import WorkerDashboardPage from "./AuthWorkerPages/DashboardPage";
import NormalWorkerProfile from "./AuthWorkerPages/NormalWrkProfile";
import ProfessionalWorkerProfile from "./AuthWorkerPages/ProfessionalWrkProfile";
import AllAppliedJobsByJobSeeker from "./AuthWorkerPages/Jobs/AppliedJobs";
import ViewAppliedJob from "./AuthWorkerPages/Jobs/ViewAppliedJob";

import SavedJobsByJobSeeker from "./AuthWorkerPages/Jobs/SavedJobs";



// authentications  pages 
import AuthProvider from "./AxiosApi/AuthPages";
import ProtectPages from "./AxiosApi/ProtectPage";
import UserIsAuthenticated from "./AxiosApi/Authenticated";
//  authenticate pages 

// COUNTER PROVIDER ==============
import JobsCounterProvider from "./AuthWorkerPages/Context/JobsCounter";



function App() {
  const getCSRF = async ()=>{
    try{
      await api.get("user-authentications/auth/user-csrf/");
    }catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
   getCSRF();
  }, []);
  

  return (
    <>
   
    <BrowserRouter>
     <AuthProvider> 
      <Routes>
                 {/* public  */}
        <Route element={<PublicLayouts/>} > 
            <Route index element={<HomePage/>} />
            <Route path="all-jobs/" element={<AllJobsListedPublic/>} />
            <Route path="jobs-details/:JobSlug" element={<JobDetailsPage/>} />

            <Route path="account-type/" element={
              <UserIsAuthenticated>
                 <ChooseRegisterType/>
              </UserIsAuthenticated>
             } />

             <Route path="/about-us" element={<AboutUs/>} />

            <Route path="register-worker/" element={
              <UserIsAuthenticated>
                  <WorkerRegistrationPage/>
              </UserIsAuthenticated>
              } />

            <Route path="register-employer/" element={
              <UserIsAuthenticated>
                  <EmployerRegistrationPage/>
              </UserIsAuthenticated>

              }/>

            <Route path="verify-account/" element={
              <UserIsAuthenticated>
                <PendingEmailVerificationPage/>
              </UserIsAuthenticated>
              }/>

            <Route path="/verify-email/:uid/:token" element={<VerifyEmailPage/>} /> 
       

            <Route path="user-login/" element={
              <UserIsAuthenticated>
                   <LoginPage/>
              </UserIsAuthenticated>
              } />

            <Route path="forgot-password/" element={
              <UserIsAuthenticated>
                  <EnterEmailResetPassword/>
              </UserIsAuthenticated>
             } />


            <Route path="reset-password/:uid/:token" element={
                  <PasswordChange/> 
               } />          
       </Route>




       {/* private employer dashboard */}
       <Route path="dashboard-user-employer/" element={
            <ProtectPages allowedRole="EMPLOYER" >
                <EmployerCounterProvider>
                      <EmployerDashboardLayout/>
                </EmployerCounterProvider>
            </ProtectPages>
              }>

              <Route index element={<EmployerDashboard/>}/>
              <Route path="employer-profiles-settings/" element={<EmployerProfileInfo/>} />

              <Route path="all-employers-jobs-posted/" element={<AllJobsPostedByEmployer/>} />

              <Route path="view-company-job-detail/:JobPk" element={<ViewCompanyJobDetails/>} />
              <Route path="view-normal-job-detail/:JobPk" element={<ViewNormalJobDetails/>} />

              {/* edits jobs  */}
              <Route path="edit-normal-job-page/:JobPk" element={<EditNormalIndividualJob/>} />
              <Route path="edit-professional-job-page/:JobPk" element={<EditProfessionalJob/>} />
              {/* edits jobs  */}

              <Route path="list-all-companies-employer" element={<ListAllCompanies/>} />
              <Route path="view-company-detail/:CompPk" element={<ViewCompanyDetails/>} />
              <Route path="edit-company-detail/:CompPk" element={<EditCompanyDetails/>} />

              <Route path="all-appplications-employer/" element={<AllApplicationsPage/>} />
              
              <Route path="view-application-details-employer/:applicationId" element={<ViewApplicationDetails/>} />



              <Route path="choose-kind-post-jobs/" element={<ChooseJobPostType/>} />

              <Route path="post-normal-individual-jobs/" element={<PostNormalIndividualJobs/>} />
              
              <Route path="confirm-company-to-post-jobs/" element={<ConfirmCompanyToPostJob/>} />
              <Route path="post-professional-career-jobs/" element={<PostProfessionalJobs/>} />


              <Route path="success-job-post-message/" element={<JobPostedSuccessMessage/>} />
       </Route>


    
       {/* Private worker Dashboard  */}
       <Route path="dashboard-user-job-seeker/" element={
          <ProtectPages allowedRole="WORKER" >
            <JobsCounterProvider> 
                <WorkerDashboardLayout/>
              </JobsCounterProvider>
          </ProtectPages> 
        }>
           <Route index element={<WorkerDashboardPage/>} />
           <Route path="job-seeker-type/" element={<ChooseWorkerTypePage/>} />
           <Route path="normal-worker-profile/" element={<NormalWorkerProfile/>}  />
           <Route path="professional-worker-profile/" element={<ProfessionalWorkerProfile/>} />
           <Route path="all-applied-jobs-job-seeker/" element={<AllAppliedJobsByJobSeeker/>} />
           <Route path="view-applied-job/:jobId" element={<ViewAppliedJob/>} />
           <Route path="all-saved-jobs/" element={<SavedJobsByJobSeeker/>} />
       </Route>
    

    <Route path="*"  element={<NotFound/>} />

      </Routes>
       </AuthProvider>
    </BrowserRouter>
   
     
     
    </>
  )
}

export default App
