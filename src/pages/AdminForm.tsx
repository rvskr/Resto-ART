import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

interface ContactForm {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'processed';
}

export default function AdminForm() {
  const [contactForms, setContactForms] = useState<ContactForm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState<'new' | 'processed'>('new');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedForm, setEditedForm] = useState<ContactForm | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserAuthentication();
  }, [selectedTab]);

  const checkUserAuthentication = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/admin/login');
    } else {
      loadContactForms();
    }
  };

  const loadContactForms = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contact_forms')
      .select('id, created_at, name, email, phone, message, status')
      .eq('status', selectedTab)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading contact forms:', error);
    } else {
      setContactForms(data || []);
    }
    setLoading(false);
  };

  const handleDeleteForm = async (id: string) => {
    const { error } = await supabase
      .from('contact_forms')
      .delete()
      .eq('id', id);

    if (!error) {
      setContactForms(contactForms.filter((form) => form.id !== id));
    } else {
      console.error('Error deleting contact form:', error);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      navigate('/admin/login');
    }
  };

  const handleStatusChange = async (id: string, status: 'new' | 'processed') => {
    const { error } = await supabase
      .from('contact_forms')
      .update({ status })
      .eq('id', id);

    if (!error) {
      setContactForms(contactForms.map((form) =>
        form.id === id ? { ...form, status } : form
      ));
    } else {
      console.error('Error changing status:', error);
    }
  };

  const openEditModal = (form: ContactForm) => {
    setEditedForm(form);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditedForm(null);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (editedForm) {
      setEditedForm({
        ...editedForm,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSaveEditedForm = async () => {
    if (editedForm) {
      const { error } = await supabase
        .from('contact_forms')
        .update({
          name: editedForm.name,
          email: editedForm.email,
          phone: editedForm.phone,
          message: editedForm.message
        })
        .eq('id', editedForm.id);

      if (!error) {
        setContactForms(contactForms.map((form) =>
          form.id === editedForm.id ? { ...form, ...editedForm } : form
        ));
        closeEditModal();
      } else {
        console.error('Error saving edited form:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold">Все заявки</h1>
          <div className="space-x-4">
            <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              Выйти
            </button>
            <button onClick={() => navigate('/admin')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Панель администратора
            </button>
          </div>
        </div>

        <div className="mb-4 flex justify-center space-x-4">
          <button
            onClick={() => setSelectedTab('new')}
            className={`px-4 py-2 rounded ${selectedTab === 'new' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Новые
          </button>
          <button
            onClick={() => setSelectedTab('processed')}
            className={`px-4 py-2 rounded ${selectedTab === 'processed' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Обработанные
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contactForms.map((form) => (
            <div key={form.id} className="bg-white p-4 rounded-lg shadow-md border">
              <div className="text-sm text-gray-500 mb-2">{new Date(form.created_at).toLocaleString()}</div>
              <h3 className="text-lg font-semibold text-gray-900">{form.name}</h3>
              <p className="text-gray-700">{form.email}</p>
              <p className="text-gray-700">{form.phone}</p>
              <p className="text-gray-800 truncate">{form.message}</p>

              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => handleStatusChange(form.id, form.status === 'new' ? 'processed' : 'new')}
                  className={`px-4 py-2 rounded ${form.status === 'new' ? 'bg-green-600' : 'bg-gray-600'} text-white`}
                >
                  {form.status === 'new' ? 'Обработать' : 'Вернуть в новые'}
                </button>
                <div className="space-x-2">
                  <button onClick={() => handleDeleteForm(form.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="inline-block mr-1" /> Удалить
                  </button>
                  <button onClick={() => openEditModal(form)} className="text-blue-600 hover:text-blue-800">
                    Редактировать
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for editing */}
      {isEditModalOpen && editedForm && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/2">
            <h2 className="text-xl font-bold mb-4">Редактировать заявку</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={editedForm.name}
                onChange={handleEditFormChange}
                className="w-full p-2 border rounded"
                placeholder="Имя"
              />
              <input
                type="email"
                name="email"
                value={editedForm.email}
                onChange={handleEditFormChange}
                className="w-full p-2 border rounded"
                placeholder="Электронная почта"
              />
              <input
                type="tel"
                name="phone"
                value={editedForm.phone}
                onChange={handleEditFormChange}
                className="w-full p-2 border rounded"
                placeholder="Телефон"
              />
              <textarea
                name="message"
                value={editedForm.message}
                onChange={handleEditFormChange}
                className="w-full p-2 border rounded"
                placeholder="Сообщение"
              />
            </div>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={closeEditModal}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Отмена
              </button>
              <button
                onClick={handleSaveEditedForm}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
