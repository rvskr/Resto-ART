import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const ContactEdit: React.FC = () => {
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [formData, setFormData] = useState({
    closeButton: '', heading: '', description: '', formTitle: '',
    namePlaceholder: '', phonePlaceholder: '', emailPlaceholder: '',
    messagePlaceholder: '', successMessage: '', successInfo: '',
    submitButtonText: '', phone: '', email: '',
  });
  const [editableField, setEditableField] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) return setError('Вы не авторизованы. Войдите в систему.');
      setUser(user);

      const { data, error } = await supabase.from('contact_info').select('*').single();
      if (error) return setError('Ошибка при загрузке данных.');
      setContactInfo(data);
      setFormData(data);
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return setError('Вы не авторизованы.');
    setLoading(true);

    try {
      const { error } = await supabase.from('contact_info').upsert([{ id: contactInfo.id, ...formData }]);
      if (error) setError('Ошибка при обновлении данных.');
      else alert('Данные успешно обновлены');
    } catch {
      setError('Произошла ошибка. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'Заголовок', name: 'heading' },
    { label: 'Описание', name: 'description', type: 'textarea' },
    { label: 'Название формы', name: 'formTitle' },
    { label: 'Placeholder для имени', name: 'namePlaceholder' },
    { label: 'Телефон', name: 'phone' },
    { label: 'Placeholder для телефона', name: 'phonePlaceholder' },
    { label: 'Email', name: 'email' },
    { label: 'Placeholder для email', name: 'emailPlaceholder' },
    { label: 'Placeholder для сообщения', name: 'messagePlaceholder' },
    { label: 'Сообщение об успехе', name: 'successMessage' },
    { label: 'Информация об успехе', name: 'successInfo', type: 'textarea' },
    { label: 'Текст кнопки отправки', name: 'submitButtonText' },
    { label: 'Текст кнопки закрытия', name: 'closeButton' },
  ];

  if (!user) return <p>Требуется авторизация...</p>;
  if (!contactInfo) return <p>Загрузка данных...</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-semibold text-center mb-6">Блок Контактов</h2>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map(({ label, name, type }) => (
          <div key={name}>
            <label className="block text-sm text-gray-700">{label}</label>
            {editableField === name ? (
              type === 'textarea' ? (
                <textarea
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              ) : (
                <input
                  type="text"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              )
            ) : (
              <div className="flex justify-between items-center">
                <span>{formData[name]}</span>
                <button
                  type="button"
                  onClick={() => setEditableField(name)}
                  className="text-amber-600 hover:text-amber-700"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 text-white py-3 px-6 rounded-md text-sm"
        >
          {loading ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </form>
    </div>
  );
};

export default ContactEdit;
