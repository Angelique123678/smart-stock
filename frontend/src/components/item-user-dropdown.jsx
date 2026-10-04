import { ChevronDown, Cog, LogOut, User2, UserCircle2 } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

// UserDropDown component provides a dropdown menu for user actions like viewing profile, settings, and logout.
const UserDropDown = () => {
  const [isOpen, setIsOpen] = useState(false); // State to track whether the dropdown is open or closed.
  const { logout, loading } = useAuth(); // Access logout function and loading state from AuthContext.

  // Toggles the dropdown menu visibility.
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handles the logout action.
  const handleLogout = async () => {
    try {
      await logout(); // Calls the logout function from AuthContext.
    } catch (error) {
      console.log(error); // Logs any errors that occur during logout.
    }
  };

  return (
    <div className="relative">
      {/* Button to toggle the dropdown menu */}
      <button
        onClick={toggleDropdown}
        className="flex items-center p-1 text-sm hover:bg-gray-200 transition-colors rounded-full"
      >
        {/* User icon */}
        <UserCircle2 size={30} strokeWidth={2} className=" p-1 rounded-full " />
        {/* Chevron icon indicating dropdown */}
        <ChevronDown size={20} className="text-gray-700" />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-xl z-10">
          <ul className="">
            {/* Admin Profile option */}
            <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
              <div className="flex items-center">
                <User2 size={15} className="mr-2" strokeWidth="2" />
                <span className="text-sm font-medium">Admin Profile</span>
              </div>
            </li>
            {/* Settings option */}
            <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer">
              <div className="flex items-center">
                <Cog size={15} className="mr-2" />
                <span className="text-sm font-medium">Settings</span>
              </div>
            </li>
            {/* Logout option */}
            <li
              className="px-3 py-3 hover:bg-yellow-main hover:rounded-b-lg cursor-pointer border-t"
              onClick={handleLogout}
            >
              {loading ? (
                // Show loading spinner while logging out
                <div className="flex items-center gap-1">
                  <span className="loading loading-spinner loading-xs"></span>
                  <span className="text-sm font-medium">Logging out...</span>
                </div>
              ) : (
                // Show logout option
                <div className="flex items-center">
                  <LogOut size={15} className="mr-2" />
                  <span className="text-sm font-medium">Log out</span>
                </div>
              )}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserDropDown;
