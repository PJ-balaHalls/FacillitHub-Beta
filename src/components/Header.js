import React, { useContext } from 'react';
import { SidebarContext } from '../context/SidebarContext';
import { ThemeContext } from '../context/ThemeContext';
import { FiMenu, FiSun, FiMoon, FiBell } from 'react-icons/fi';

const Header = () => {
  const { toggleSidebar } = useContext(SidebarContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="bg-white dark:bg-dark-bg shadow-sm p-4 flex justify-between items-center">
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
        <img 
          src="https://i.pravatar.cc/40" 
          alt="Avatar do Usuário" 
          className="w-10 h-10 rounded-full cursor-pointer"
        />
      </div>
    </header>
  );
};

export default Header;