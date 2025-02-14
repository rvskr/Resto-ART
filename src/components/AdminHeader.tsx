import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AdminHeader = () => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const handleOpenSite = () => {
    navigate('/'); 
  };

  const handleNavigateToAdmin = () => {
    navigate('/admin');
  };

  const handleNavigateToForm = () => {
    navigate('/admin/form'); 
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 px-4 sm:px-8 py-4 sm:py-6">
      {/* Left Side: Title and Navigation */}
      <div className="flex items-center justify-between w-full sm:w-auto space-x-6">
        <h1 className="text-xl font-bold text-center sm:text-left">RestoArt</h1>
        <nav className="flex space-x-4">
          <button 
            onClick={handleNavigateToAdmin} 
            className="text-gray-600 hover:text-gray-900 py-2 sm:py-0"
          >
            Главная
          </button>
          <button 
            onClick={handleNavigateToForm} 
            className="text-gray-600 hover:text-gray-900 py-2 sm:py-0"
          >
            Заявки
          </button>
        </nav>
      </div>

      {/* Right Side: Open Website & Logout Button */}
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-x-4 sm:space-y-0 w-full sm:w-auto mt-4 sm:mt-0">
        <button
          onClick={handleOpenSite}
          className="text-blue-600 hover:text-blue-700 text-center sm:text-left"
        >
          Открыть сайт
        </button>
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
