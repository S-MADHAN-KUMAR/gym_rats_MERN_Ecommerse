import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(3); // Example notification count
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  return (
    <nav className="">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 text-2xl font-bold">
            <a href="/" className="h1 font-medium text-5xl tracking-widest">
              Gymrats
            </a>
          </div>

          {/* Search Field
          <div className="hidden md:flex items-center w-full max-w-md mx-4">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-l-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="bg-gray-600 hover:bg-blue-500 rounded-r-md px-3 py-1 focus:outline-none"
            >
{/* <img src="https://img.icons8.com/?size=100&id=32OmT3RbGirU&format=png&color=000000" className="w-7 " />            */}
{/* <img src="https://img.icons8.com/?size=100&id=p3miLroKw4iR&format=png&color=000000" className="w-9 " />           
 </button>
          </div>  */}

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6 h1 tracking-widest  text-2xl  "
          >
            <a href="/shop" className="hover:text-gray-400 transition-colors">
              Shop
            </a>
            <a href="/about" className="hover:text-gray-400 transition-colors">
              About
            </a>
            <a href="#contact" className="hover:text-gray-400 transition-colors">
              Contact
            </a>
          </div>

          {/* Icons */}
          <div className="flex items-center  space-x-6">
            {/* Notification Bell */}
            <div className="relative mt-2">
              <button className="hover:text-gray-400 transition-transform transform hover:scale-110">
                <img src="https://img.icons8.com/?size=100&id=q83D9p2dPS2W&format=png&color=000000" className="w-8   " />
              </button>
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
                  {notifications}
                </span>
              )}
            </div>


            {/* Wishlist */}

            <Link to={'/wishlist'} >
            <img  src="https://img.icons8.com/?size=100&id=5twNojKL5zU7&format=png&color=000000" className="hover:scale-110 cursor-pointer w-9 " />

            </Link>


            {/* Cart */}
            <Link to={'/cart'} >
            <img src="https://img.icons8.com/?size=100&id=pMGoyzVDvHJe&format=png&color=000000" className="hover:scale-110 cursor-pointer w-9 " />
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                className=" transition-transform transform hover:scale-110"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <img src="https://img.icons8.com/?size=100&id=492ILERveW8G&format=png&color=000000" className="w-12" />
              </button>
              {isProfileOpen && (
                <div className="h1 text-lg font-medium tracking-widest absolute right-0 mt-2 bg-gray-800 text-white shadow-lg rounded-lg w-48">
                  <a
                    href="#my-account"
                    className="block px-4 py-2 hover:bg-gray-700 rounded-t-md"
                  >
                    My Account
                  </a>
                  <a
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    Profile
                  </a>
                  <a
                    href="#logout"
                    className="block px-4 py-2 hover:bg-gray-700 rounded-b-md "
                  >
                    Logout
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden">
            <button
              className="hover:text-gray-400 transition-transform transform hover:scale-110"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-700">
          <div className="px-4 py-3 space-y-2">
            <a
              href="#shop"
              className="block hover:bg-gray-600 px-3 py-2 rounded text-white"
            >
              Shop
            </a>
            <a
              href="#about"
              className="block hover:bg-gray-600 px-3 py-2 rounded text-white"
            >
              About
            </a>
            <a
              href="#contact"
              className="block hover:bg-gray-600 px-3 py-2 rounded text-white"
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
