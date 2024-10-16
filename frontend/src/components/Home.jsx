import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MainPage = ({ setCurrentPage }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { logout} = useContext(AuthContext);
  const navigate=useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  };

  return (
    <header className="w-full py-4 bg-white shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div
          className="text-2xl font-bold hover:text-blue-400 mr-2 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
          onClick={() => setCurrentPage("upload")}
        >
          <span className="text-sky-400">Image</span>
          <span className="text-black">Stocker</span>
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-6 text-gray-700">
          <li className="hover:text-blue-400 mr-2 transition duration-300 ease-in-out transform hover:scale-105">
            <button
              onClick={() => setCurrentPage("storage")}
              className="hover:text-blue-400 mr-2 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Go To Storage
            </button>
            <FontAwesomeIcon className="text-cyan-400" icon={faStore} />
          </li>
        </ul>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="px-4 py-2 bg-yellow-500 text-white rounded-3xl hover:bg-yellow-600"
          >
            V
          </button>

          <div
            className={`absolute right-0 mt-2 w-32 bg-white shadow-md rounded-lg border border-gray-300 transition-all duration-300 ease-in-out transform ${
              isDropdownOpen
                ? "opacity-100 scale-y-100"
                : "opacity-0 scale-y-0"
            } origin-top`}
          >
            <ul className="py-1">
              <li
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default MainPage;
