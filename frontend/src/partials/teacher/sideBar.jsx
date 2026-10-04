// import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  LayoutDashboardIcon,
  Menu,
  Plus,
  Trash2,
  TrendingUp,
  SquareChartGantt,
  FilePlus2,
  Layers2,
  ShieldUser,
  BellDot,
  ChartCandlestick,
  LibraryBig,
  LogOut,
  Settings,
  Cog,
  PlusCircle,
  UserPlus2,
} from "lucide-react";
import Colors from "../../components/ReactColors";
import { NavLink } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext";

const SideBar = () => {
  const navLinkStyles = ({ isActive }) =>
    `flex items-center gap-1 text-sm py-1.5 px-1.5 rounded-lg transition duration-200 ease-in-out ${
      isActive
        ? "bg-white text-blue-main   shadow-lg"
        : "text-white hover:text-blue-light "
    }`;

  // const { logout } = useAuth();
  // const handleLogout = async () => {
  //   try {
  //     await logout();
  //   } catch (error) {
  //     console.error("Logout failed:", error);
  //   }
  // };

  return (
    <div className="w-64 border-r border-gray-200 bg-gradient-to-b text-white p-4 to-blue-800 from-blue-dark ">
      <div className="mb-8 flex items-center">
        <div className="bg-blue-main p-3 rounded-lg">
          <TrendingUp size={20} className="text-white" /> 
        </div>
        <h1 className="text-3xl font-bold ml-3">SmartStock</h1>
      </div>

      <div className="mt-6 mb-2">
        <div className="text-white text-sm">Main Menu</div>
      </div>

      <nav className="space-y-1">
        <NavLink to="/admin/dashboard/home" className={navLinkStyles}>
          <LayoutDashboardIcon size={17} />
          Dashboard
        </NavLink>
        <NavLink to="/admin/dashboard/managestock" className={navLinkStyles}>
          {/* <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg> */}
          <Layers2 size={17} />
          Manage Stock
        </NavLink>
        <NavLink to="/admin/dashboard/materialusage" className={navLinkStyles}>
          <ChartCandlestick size={17} />
          Material Usage & Stock Levels
        </NavLink>
        <NavLink to="/admin/dashboard/request" className={navLinkStyles}>
          {/* <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg> */}
          <FilePlus2 size={17} />
          Requests
        </NavLink>
        {/* <NavLink to="/admin/dashboard/notification" className={navLinkStyles}>
          <BellDot size={17} />
          Notifications
        </NavLink> */}
      </nav>

      <div className="mt-6 mb-2">
        <div className="text-white text-sm">People Management</div>
      </div>

      <nav className="space-y-1">
        <NavLink to="/admin/dashboard/manageteachers" className={navLinkStyles}>
          <ShieldUser size={17} />
          Manage Teachers
        </NavLink>
        <NavLink to="/admin/dashboard/managetrades" className={navLinkStyles}>
          <LibraryBig size={17} />
          Manage Trades
        </NavLink>
        
      </nav>

      <div className="mt-6 mb-2">
        <div className="text-white text-sm">Quick Links</div>
      </div>

      <nav>
      <NavLink to="" className={navLinkStyles}>
          <PlusCircle size={17} />
            Add New Stock
        </NavLink>
        <NavLink to="" className="flex items-center gap-1 text-sm py-1.5 px-1.5 rounded-lg transition-colors duration-200 ease-in-out text-white hover:text-black hover:bg-yellow-main w-full hover:shadow-lg">
          <UserPlus2 size={17} />
          Invite New Teacher
        </NavLink>
      </nav>
    </div>
  );
};

export default SideBar;
