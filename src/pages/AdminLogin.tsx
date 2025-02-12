import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      navigate('/admin');
    } catch (error) {
      setError('Неверный email или пароль');
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <AdminHeader />
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg">
          <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            Вход в админ-панель
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-4 rounded-lg text-lg transition-all"
            >
              Войти
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
