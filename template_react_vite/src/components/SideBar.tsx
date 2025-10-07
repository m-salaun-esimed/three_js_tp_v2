import { useState } from "react";
import { NavLink } from "react-router-dom";
import { IoFileTrayFullOutline } from "react-icons/io5";
import { FaRegFile } from "react-icons/fa6";
import { FaBars, FaTimes } from "react-icons/fa";
import { IoMdNotificationsOutline } from "react-icons/io";
import LogOutKeycloak from "../domains/Authentification/components/LogOutKeycloak";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen((prev) => !prev);
  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-gray-200 rounded-md sm:hidden"
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
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-white border-r border-gray-300 transition-transform transform
        ${isOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="flex flex-col h-full px-3 py-4 overflow-y-auto">
          <div>
            <NavLink
              to="/notifications"
            >
              <div className="flex">
                <div>
                  <button className="text-black-600 hover:text-black-800 h-10 w-10 flex items-center justify-center rounded-full hover:bg-blue-100 transition"
                  >
                    <IoMdNotificationsOutline size={32} />
                  </button>
                </div>
                <div>
                </div>
              </div>
            </NavLink>
          </div>

          {/* Menu */}
          <ul className="space-y-6 font-medium mt-4">
            <li>
              <NavLink
                to="/"
                className="flex items-center p-2 rounded-lg group hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <IoFileTrayFullOutline className="w-5 h-5 transition duration-75" />
                <span className="ml-3 flex items-center gap-2">
                  Home
                </span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/test"
                className="flex items-center p-2 rounded-lg group hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <FaRegFile className="w-5 h-5 transition duration-75" />
                <span className="ml-3">Test</span>
              </NavLink>
            </li>
          </ul>

          {/* Bottom Section */}
          <div className="mt-auto space-y-6">  
            <div className="flex items-center p-2 rounded-lg group hover:bg-gray-100">
              <LogOutKeycloak />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;