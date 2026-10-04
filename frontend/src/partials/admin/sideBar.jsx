import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  TrendingUp,
  FilePlus2,
  Layers2,
  ShieldUser,
  ChartCandlestick,
  LibraryBig,
  Settings,
  PlusCircle,
  UserPlus2,
  Menu,
  X,
  LogOut
} from "lucide-react";

const SideBar = ({isOpen}) => {
  const [collapsed, setCollapsed] = useState({
    mainMenu: false,
    peopleManagement: false,
    quickLinks: false
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(isOpen || false);

  const toggleSection = (section) => {
    setCollapsed({
      ...collapsed,
      [section]: !collapsed[section]
    });
  };

  const navLinkStyles = ({ isActive }) =>
    `flex items-center gap-3 text-sm py-2 px-3 rounded-lg transition duration-200 ease-in-out ${
      isActive
        ? "bg-white text-blue-600 font-medium shadow-md"
        : "text-white hover:bg-blue-700 hover:bg-opacity-40"
    }`;
    
  const MenuSection = ({ title, id, children }) => (
    <>
      <div className="flex items-center justify-between mb-1 mt-6 px-2">
        <div className="text-gray-300 text-xs uppercase font-medium tracking-wider">{title}</div>
        <button 
          onClick={() => toggleSection(id)}
          className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-blue-700 hover:bg-opacity-40"
        >
          {collapsed[id] ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>
      {!collapsed[id] && (
        <nav className="space-y-1">
          {children}
        </nav>
      )}
    </>
  );

  // const { logout } = useAuth();
  // const handleLogout = async () => {
  //   try {
  //     await logout();
  //   } catch (error) {
  //     console.error("Logout failed:", error);
  //   }
  // };

  const sidebarContent = (
    <>
      <div className="mb-8 flex items-center">
        <div className="bg-blue-500 p-2.5 rounded-lg">
          <TrendingUp size={20} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold ml-3">SmartStock</h1>
      </div>

      <MenuSection title="Main Menu" id="mainMenu">
        <NavLink to="/admin/dashboard/home"  onClick={() => setMobileMenuOpen(false)} className={navLinkStyles}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/admin/dashboard/managestock"  onClick={() => setMobileMenuOpen(false)} className={navLinkStyles}>
          <Layers2 size={18} />
          <span>Manage Stock</span>
        </NavLink>
        <NavLink to="/admin/dashboard/materialusage"  onClick={() => setMobileMenuOpen(false)} className={navLinkStyles}>
          <ChartCandlestick size={18} />
          <span>Material Usage & Levels</span>
        </NavLink>
        <NavLink to="/admin/dashboard/request"  onClick={() => setMobileMenuOpen(false)} className={navLinkStyles}>
          <FilePlus2 size={18} />
          <span>Requests</span>
        </NavLink>
      </MenuSection>

      <MenuSection title="People Management" id="peopleManagement">
        <NavLink to="/admin/dashboard/manageteachers"  onClick={() => setMobileMenuOpen(false)} className={navLinkStyles}>
          <ShieldUser size={18} />
          <span>Manage Teachers</span>
        </NavLink>
        <NavLink to="/admin/dashboard/managetrades"  onClick={() => setMobileMenuOpen(false)} className={navLinkStyles}>
          <LibraryBig size={18} />
          <span>Manage Trades</span>
        </NavLink>
      </MenuSection>

      <MenuSection title="Quick Links" id="quickLinks">
        <NavLink to='/admin/dashboard/addstock'  onClick={() => setMobileMenuOpen(false)} className={navLinkStyles}>
          <PlusCircle size={18} />
          <span>Add New Stock</span>
        </NavLink>
        <NavLink to="/admin/dashboard/inviteteacher"  onClick={() => setMobileMenuOpen(false)} className={navLinkStyles}>
          <UserPlus2 size={18} />
          <span>Invite New Teacher</span>
        </NavLink>
      </MenuSection>
      
      <div className="mt-auto pt-6">
        <NavLink to="/admin/dashboard/settings"  onClick={() => setMobileMenuOpen(false)} className={navLinkStyles}>
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>
        {/* <button 
          className="flex w-full items-center gap-3 text-sm py-2 px-3 mt-2 rounded-lg text-white hover:bg-red-500 hover:bg-opacity-30 transition duration-200"
          // onClick={handleLogout}
           onClick={() => setMobileMenuOpen(false)}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button> */}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-10 bg-blue-600 text-white p-2 rounded-lg shadow-lg"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      
      {/* Mobile sidebar */}
  <div 
        className={`fixed inset-0 bg-black text-white bg-opacity-50 z-30 transition-opacity duration-300 md:hidden ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)} // Close sidebar when clicking the backdrop
      >
        <div 
          className={`w-64 h-full bg-gradient-to-b from-blue-800 to-blue-900 p-4 overflow-y-auto transform transition-transform duration-300 flex flex-col ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside sidebar from closing it
        >
          {sidebarContent}
        </div>
      </div>
      
      {/* Desktop sidebar */}
      <div className="w-64 border-r hidden md:flex flex-col h-screen sticky top-0 border-gray-700 bg-gradient-to-b from-blue-800 to-blue-900 overflow-y-auto text-white p-4">
        {sidebarContent}
      </div>
    </>
  );
};

export default SideBar;