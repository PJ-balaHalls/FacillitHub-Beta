// src/components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext'; // <-- CORREÇÃO: Usando o hook
import { motion } from 'framer-motion';
import { FiHome, FiBookOpen, FiClipboard, FiBarChart2, FiSettings, FiCheckSquare } from 'react-icons/fi';

const Sidebar = () => {
  const { isSidebarOpen } = useSidebar(); // <-- CORREÇÃO: Usando o hook

  const navItems = [
    { icon: <FiHome />, name: 'Dashboard', path: '/' },
    { icon: <FiBookOpen />, name: 'Planos de Aula', path: '/planos' },
    { icon: <FiClipboard />, name: 'Notas', path: '/notas' },
    { icon: <FiCheckSquare />, name: 'Frequência', path: '/frequencia' },
    { icon: <FiBarChart2 />, name: 'Relatórios', path: '/relatorios' },
    { icon: <FiSettings />, name: 'Configurações', path: '/config' },
  ];

  return (
    <motion.div
      className="bg-dark-bg text-light-bg h-screen flex flex-col justify-between p-4"
      animate={{ width: isSidebarOpen ? '250px' : '80px' }}
      transition={{ duration: 0.3, type: 'spring', damping: 20 }}
    >
      <div>
        <div className="flex items-center gap-3 mb-10">
            <div className="bg-primary rounded-full min-w-[48px] h-12 flex items-center justify-center">
                <span className="text-2xl font-semibold text-white">F</span>
            </div>
            {isSidebarOpen && <motion.h1 
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.2}}
              className="text-2xl font-semibold whitespace-nowrap">Facillit Edu</motion.h1>}
        </div>
        
        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.name} className="mb-4">
                <NavLink 
                    to={item.path}
                    className={({isActive}) => 
                    `flex items-center gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-primary-dark ${isActive ? 'bg-primary shadow-lg' : ''}`
                }>
                  <div className="text-2xl min-w-[24px]">{item.icon}</div>
                  {isSidebarOpen && <motion.span 
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 0.2}}
                    className="whitespace-nowrap">{item.name}</motion.span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;