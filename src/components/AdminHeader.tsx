// AdminHeader.tsx
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
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold">Админ-панель</h1>
        <nav className="flex space-x-4">
          <Link to="/admin" className="text-gray-600 hover:text-gray-900">
            Главная
          </Link>
          <Link to="/admin/form" className="text-gray-600 hover:text-gray-900">
            Заявки
          </Link>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <Link to="/" target="_blank" className="text-blue-600 hover:text-blue-700">
          Открыть сайт
        </Link>
        <button
          onClick={handleLogout}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
        >
          Выйти
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;