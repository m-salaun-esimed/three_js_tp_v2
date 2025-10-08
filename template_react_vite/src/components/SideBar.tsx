import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { IoFileTrayFullOutline, IoHomeOutline } from "react-icons/io5";
import { FaRegFile } from "react-icons/fa6";
import { FaBars, FaTimes } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { Switch } from "@/components/ui/switch";
import LogOutKeycloak from "../domains/Authentification/components/LogOutKeycloak";
import { FaInfoCircle } from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md sm:hidden transition-all duration-300"
        onClick={toggleSidebar}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={isOpen}
        aria-controls="sidebar"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 transform
        ${isOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="flex flex-col h-full px-3 py-4 overflow-y-auto">
          {/* Notifications */}
          <div>
            <NavLink to="/notifications" onClick={() => setIsOpen(false)}>
              <button
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                aria-label="Notifications"
              >
                <IoMdNotificationsOutline size={32} />
              </button>
            </NavLink>
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-6 mt-4">
            <img
              src={
                isDarkMode
                  ? "/FANLAB ROND_transparent blanc.png"
                  : "/FANLAB_transparent.png"
              }
              alt="Marine Classroom Logo"
              className="w-24 h-24 object-contain rounded-full transition-opacity duration-300"
              loading="lazy"
            />
          </div>

          {/* Menu */}
          <ul className="space-y-6 font-medium mt-4">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-all duration-200 group ${isActive
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <IoHomeOutline className="w-5 h-5 transition-all duration-200" />
                <span className="ml-3">Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/test"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-all duration-200 group ${isActive
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <FaRegFile className="w-5 h-5 transition-all duration-200" />
                <span className="ml-3">Test</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-all duration-200 group ${isActive
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <FaInfoCircle className="w-5 h-5 transition-all duration-200" />
                <span className="ml-3">Information</span>
              </NavLink>
            </li>
          </ul>

          {/* Bottom Section */}
          <div className="mt-auto space-y-6">
            {/* Dark Mode Toggle */}
            <div className="flex items-center p-2 w-full text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
              {isDarkMode ? (
                <MdLightMode className="w-5 h-5 mr-3" />
              ) : (
                <MdDarkMode className="w-5 h-5 mr-3" />
              )}
              <span className="flex-1">{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
              <Switch
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
                className="data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-500"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              />
            </div>

            {/* Logout */}
            <div className="flex items-center p-2 text-gray-600 dark:text-gray-300 rounded-lg group hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
              <LogOutKeycloak />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;