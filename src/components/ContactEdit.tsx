import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const fields = [
  { name: 'closeButton', label: 'Текст кнопки закрытия' },
  { name: 'heading', label: 'Заголовок' },
  { name: 'description', label: 'Описание' },
  { name: 'formTitle', label: 'Название формы' },
  { name: 'namePlaceholder', label: 'Placeholder для имени' },
  { name: 'phonePlaceholder', label: 'Placeholder для телефона' },
  { name: 'emailPlaceholder', label: 'Placeholder для email' },
  { name: 'messagePlaceholder', label: 'Placeholder для сообщения' },
  { name: 'successMessage', label: 'Сообщение об успехе' },
  { name: 'successInfo', label: 'Информация об успехе' },
  { name: 'submitButtonText', label: 'Текст кнопки отправки' },
  { name: 'phone', label: 'Телефон' },
  { name: 'email', label: 'Email' },
];

const ContactEdit: React.FC = () => {
  const [formData, setFormData] = useState({});
  const [editableField, setEditableField] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        setError('Вы не авторизованы. Войдите в систему.');
        return;
      }
      setUser(user);
    };

    fetchUser();

    const fetchContactInfo = async () => {
      const { data, error } = await supabase.from('contact_info').select('*').single();
      if (error) {
        setError('Ошибка при загрузке данных.');
      } else {
        setFormData(data);
      }
    };
    fetchContactInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('contact_info').upsert([{ ...formData }]);
      if (error) {
        setError('Ошибка при обновлении данных.');
      } else {
        alert('Данные успешно обновлены');
      }
    } catch {
      setError('Произошла ошибка. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-semibold text-center mb-6">Редактирование Контактов</h2>
      {error && <p className="text-red-600 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map(({ name, label }) => (
          <div key={name} className="flex flex-col">
            <label className="text-sm font-medium mb-2">{label}</label>
            <input
              type="text"
              name={name}
              value={formData[name] || ''}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 text-white py-3 px-6 rounded-md text-sm hover:bg-amber-700 transition duration-300"
        >
          {loading ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </form>
    </div>
  );
};

export default ContactEdit;
