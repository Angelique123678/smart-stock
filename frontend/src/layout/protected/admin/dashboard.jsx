import React, { useState } from "react";
import {
  AlignLeftIcon,
  BellDotIcon,
  ChevronDownIcon,
  LogOut,
  MoonIcon,
  UserCircle2Icon,
} from "lucide-react";

import { Outlet } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import SideBar from "../../../partials/admin/sideBar";
import UserDropDown from "../../../components/item-user-dropdown";

const AdminDashboardLayout = () => {
  const { user, /*logout*/ } = useAuth();

  const [isOpen] = useState(true);

  // const handleLogout = async () => {
  //   try {
  //     const response = await logout();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };



  return (
    <div className="flex h-screen bg-white ">
      {/* Main content wrapper */}
      <div className="flex flex-col w-full">
        {/* Top navbar */}

        {/* AdminDashboardLayout content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}

          <SideBar />

          {/* Main dashboard area */}
          <div className="flex-1 p-6 flex flex-col gap-3 overflow-auto">

            <TopBar user={user} isOpen={isOpen} />

            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};


export default AdminDashboardLayout;





export const TopBar = ({ user, isOpen }) => {
  return (
    <div className="flex justify-between flex-col  items-center   md:flex-row border-b mb-3 border-b-gray-300  pb-2">
      
      <div className="">
        <p className="text-xl capitalize font-semibold">
          {" "}
          Welcome to Dashboard , {user?.name}.
        </p>
      </div>
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-5" >

          <MoonIcon
            size={35}
            strokeWidth={2}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
          />
          <BellDotIcon
            size={35}
            strokeWidth={2}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
          />
        </div>

        {
          isOpen && <UserDropDown />
        }



      </div>
    </div>


  )
}

