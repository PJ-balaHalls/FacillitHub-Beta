// src/components/Header.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';   // <-- CORREÇÃO: Usando o hook
import { useTheme } from '../context/ThemeContext';       // <-- CORREÇÃO: Usando o hook
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiSun, FiMoon, FiBell, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { toggleSidebar } = useSidebar();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="bg-white dark:bg-dark-bg shadow-sm p-4 flex justify-between items-center z-10">
      <button onClick={toggleSidebar} className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-secondary text-2xl">
        <FiMenu />
      </button>

      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-secondary text-2xl">
          {isDarkMode ? <FiSun /> : <FiMoon />}
        </button>
        <button className="relative text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-secondary text-2xl">
            <FiBell />
            <span className="absolute top-0 right-0 w-2 h-2 bg-secondary rounded-full"></span>
        </button>

        {user && (
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
              className="flex items-center gap-2"
            >
              <img 
                src={user?.user_metadata?.avatar_url || `https://api.pravatar.cc/40?u=${user?.id}`} 
                alt="Avatar do Usuário" 
                className="w-10 h-10 rounded-full"
              />
              <span className="hidden md:block text-gray-700 dark:text-gray-300 font-medium">
                {user?.user_metadata?.full_name || user?.email}
              </span>
              <FiChevronDown className={`transition-transform duration-300 text-gray-500 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden"
                >
                  <ul>
                    <li>
                      <a href="#perfil" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <FiUser /> Perfil
                      </a>
                    </li>
                    <li>
                      <button 
                        onClick={handleLogout} 
                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50"
                      >
                        <FiLogOut /> Sair
                      </button>
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;