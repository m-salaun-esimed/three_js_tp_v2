import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { FaBars, FaTimes } from "react-icons/fa";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { Switch } from "@/components/ui/switch";
import { FaGamepad } from "react-icons/fa";
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
          {/* Logo */}
          <div className="flex justify-center mb-6 mt-4">
            {isDarkMode ? (
              <svg
                width="96"
                height="96"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
                className="w-24 h-24 object-contain rounded-full transition-opacity duration-300"
              >
                <defs>
                  <radialGradient id="rg-dark" cx="30%" cy="30%" r="80%">
                    <stop offset="0" stopColor="#FFD166" />
                    <stop offset="1" stopColor="#EF476F" />
                  </radialGradient>
                  <linearGradient id="lg-dark" x1="0" x2="1">
                    <stop offset="0" stopColor="#06D6A0" />
                    <stop offset="1" stopColor="#118AB2" />
                  </linearGradient>
                  <filter id="shadow-dark" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#000" floodOpacity="0.25" />
                  </filter>
                </defs>

                <rect width="512" height="512" rx="36" fill="#071028" />
                <g transform="translate(256,256)" filter="url(#shadow-dark)">
                  <ellipse rx="112" ry="48" fill="none" stroke="url(#lg-dark)" strokeWidth="10" transform="rotate(20)" />
                  <ellipse rx="112" ry="48" fill="none" stroke="url(#rg-dark)" strokeWidth="8" transform="rotate(-25)" />
                  <ellipse rx="112" ry="48" fill="none" stroke="#9b5cff" strokeWidth="6" transform="rotate(65)" />
                  <circle cx="0" cy="0" r="28" fill="#ffffff" />
                  <rect x="-12" y="28" width="24" height="88" rx="6" fill="#222" />
                  <rect x="-36" y="110" width="72" height="22" rx="10" fill="#0f1724" />
                </g>
              </svg>
            ) : (
              <svg
                width="96"
                height="96"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
                className="w-24 h-24 object-contain rounded-full transition-opacity duration-300"
              >
                <defs>
                  <radialGradient id="rg-light" cx="30%" cy="30%" r="80%">
                    <stop offset="0" stopColor="#FFD166" />
                    <stop offset="1" stopColor="#EF476F" />
                  </radialGradient>
                  <linearGradient id="lg-light" x1="0" x2="1">
                    <stop offset="0" stopColor="#06D6A0" />
                    <stop offset="1" stopColor="#118AB2" />
                  </linearGradient>
                  <filter id="shadow-light" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000" floodOpacity="0.15" />
                  </filter>
                </defs>

                <rect width="512" height="512" rx="36" fill="#f0f4f8" />
                <g transform="translate(256,256)" filter="url(#shadow-light)">
                  <ellipse rx="112" ry="48" fill="none" stroke="url(#lg-light)" strokeWidth="10" transform="rotate(20)" />
                  <ellipse rx="112" ry="48" fill="none" stroke="url(#rg-light)" strokeWidth="8" transform="rotate(-25)" />
                  <ellipse rx="112" ry="48" fill="none" stroke="#9b5cff" strokeWidth="6" transform="rotate(65)" />
                  <circle cx="0" cy="0" r="28" fill="#1a202c" />
                  <rect x="-12" y="28" width="24" height="88" rx="6" fill="#e2e8f0" />
                  <rect x="-36" y="110" width="72" height="22" rx="10" fill="#cbd5e0" />
                </g>
              </svg>
            )}
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
                <FaGamepad className="w-5 h-5 transition-all duration-200" />
                <span className="ml-3">Jeux</span>
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
              <span className="flex-1">{isDarkMode ? "Thème sombre" : "Thème clair"}</span>
              <Switch
                checked={isDarkMode}
                onCheckedChange={toggleDarkMode}
                className="data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-500"
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;