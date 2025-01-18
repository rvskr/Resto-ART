import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AdminHeader = () => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 px-4 sm:px-8 py-4 sm:py-6">
      {/* Left Side: Title and Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full sm:w-auto space-y-4 sm:space-y-0 sm:space-x-6">
        <h1 className="text-2xl font-bold text-center sm:text-left">Админ-панель</h1>
        <nav className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <Link to="/admin" className="text-gray-600 hover:text-gray-900 py-2 sm:py-0 text-center sm:text-left">
            Главная
          </Link>
          <Link to="/admin/form" className="text-gray-600 hover:text-gray-900 py-2 sm:py-0 text-center sm:text-left">
            Заявки
          </Link>
        </nav>
      </div>

      {/* Right Side: Open Website & Logout Button */}
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-x-4 sm:space-y-0 w-full sm:w-auto mt-4 sm:mt-0">
        <Link to="/" target="_blank" className="text-blue-600 hover:text-blue-700 text-center sm:text-left">
          Открыть сайт
        </Link>
        <button
          onClick={handleLogout}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
        >
          Выйти
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;
