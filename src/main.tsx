// index.tsx or your main entry file
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';
import AdminForm from './pages/AdminForm'; 
import PortfolioPage from './PortfolioPage';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/form" element={<AdminForm />} /> {/* Add this route */}
        <Route path="/portfolio" element={<PortfolioPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);