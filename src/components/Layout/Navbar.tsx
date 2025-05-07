import React, { useState, useRef, useEffect } from 'react';
import { FaBars, FaUser, FaBell, FaCog, FaMoon, FaSun } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Agregar log para depuración
  useEffect(() => {
    console.log('Datos de usuario en Navbar:', user);
  }, [user]);

  useEffect(() => {
    // Verificar si hay una preferencia guardada
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
  };

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setDarkMode(!darkMode);
  };

  // Función para obtener el nombre del usuario de manera segura
  const getUserName = () => {
    if (!user) return 'Usuario';
    
    console.log('Intentando obtener nombre de usuario:', user);
    
    // Verificar si el usuario tiene las propiedades esperadas
    if (user.nombre && user.apellido) {
      return `${user.nombre} ${user.apellido}`;
    }
    
    // Si todo falla, mostrar el objeto completo en la consola para depuración
    console.log('Estructura completa del usuario:', JSON.stringify(user));
    
    return 'Usuario';
  };

  // Función para obtener el nombre del rol de manera segura
  const getRolName = () => {
    if (!user) return 'Sin rol asignado';
    
    // Si rol es un objeto con nombreRol
    if (user.rol && typeof user.rol === 'object' && 'nombreRol' in user.rol) {
      return user.rol.nombreRol;
    }
    
    // Si rol es un string
    if (user.rol && typeof user.rol === 'string') {
      return user.rol;
    }
    
    // Si existe Rol como string (con mayúscula, según el tipo)
    if (user.Rol) {
      return user.Rol;
    }
    
    return 'Sin rol asignado';
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md h-16 flex items-center justify-between px-4">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
        >
          <FaBars className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {darkMode ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
        </button>
        
        <button className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
          <FaBell className="h-5 w-5" />
        </button>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white">
              <FaUser className="h-4 w-4" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-gray-700 dark:text-gray-200 font-medium">
                {getUserName()}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {getRolName()}
              </span>
            </div>
            <FaCog className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{getUserName()}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Rol: {getRolName()}</p>
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;