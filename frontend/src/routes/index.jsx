
import {  Loader } from "lucide-react";
import { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate,Outlet } from "react-router-dom";

// only import the components like this if you want to load before the website and inform me!!
import LoadingPage from "../partials/Loading";
import ProtectPrivateRoute from "../partials/auth/protectedRoutes/ProtectPrivateRoute";
import ProtectPublicRoute from "../partials/auth/protectedRoutes/protectPublicRoute";
import AdminDashboardLayout from "../layout/protected/admin/dashboard";
import AuthLayout from "../layout/auth/AuthLayout";
import { useAuth } from "../contexts/AuthContext";




// always import like this which make the website load much faster
const DashboardHome = lazy(() => import("../pages/Admin/DashboardHome"));
const Analysis = lazy(() => import("../pages/Admin/Analysis"));
const ManageStock = lazy(() => import("../pages/Admin/ManageStock"));
const Notification = lazy(() => import("../pages/Admin/Notification"));
const MaterialUsage = lazy(() => import("../pages/Admin/MaterialUsage"));
const ManageTeachers = lazy(() => import("../pages/Admin/ManageTeachers"));
const ManageTrade = lazy(() => import("../pages/Admin/ManageTrade"));
const Requests = lazy(() => import("../pages/Admin/Requests"));

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));

const SuspenseWrapper = ({ children }) => {
    return <Suspense fallback={<LoadingPage />}>{children}</Suspense>
}


const ProtectAdminRoute  = ({children})=>{

    const {user} = useAuth()
    
    if(user?.role !== 'ADMIN') return <Navigate to={'/'} />

    return <SuspenseWrapper> {children} </SuspenseWrapper>
}



const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <ProtectPrivateRoute /> ,
            children:[
                {path:'', element: <Home />},
                {
                    path:'admin/dashboard', 
                    element: <ProtectAdminRoute><AdminDashboardLayout /> </ProtectAdminRoute>,
                    children:[
                        
                        { index:true, element: <Navigate to={'/admin/dashboard/home'}/> },
                        { path:'home', element: <SuspenseWrapper><DashboardHome /> </SuspenseWrapper> },
                        { path:'analysis', element: <SuspenseWrapper><Analysis /> </SuspenseWrapper> },
                        { path:'managestock', element: <SuspenseWrapper><ManageStock /> </SuspenseWrapper> },
                        { path:'notification', element: <SuspenseWrapper><Notification /> </SuspenseWrapper> },
                        { path:'request', element: <SuspenseWrapper><Requests /> </SuspenseWrapper> },
                        { path:'materialusage', element: <SuspenseWrapper><MaterialUsage/> </SuspenseWrapper> },
                        { path:'manageteachers', element: <SuspenseWrapper><ManageTeachers/> </SuspenseWrapper> },

                        { path:'managetrades', element: <SuspenseWrapper><ManageTrade/> </SuspenseWrapper> },


                    ]
                },

            ]
        },
        {
            path: '/auth',
            element: <ProtectPublicRoute ><AuthLayout /></ProtectPublicRoute>,
            children: [
                { path: 'login', element: <SuspenseWrapper><Login /> </SuspenseWrapper> },

            ]
        }
    ]
)

export default router