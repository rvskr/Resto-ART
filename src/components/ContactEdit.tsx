import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const ContactEdit: React.FC = () => {
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [formData, setFormData] = useState({
    closeButton: '',
    heading: '',
    description: '',
    formTitle: '',
    namePlaceholder: '',
    phonePlaceholder: '',
    emailPlaceholder: '',
    messagePlaceholder: '',
    successMessage: '',
    successInfo: '',
    submitButtonText: '',
    phone: '',
    email: '',
  });
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
        setContactInfo(data);
        setFormData({
          phone: data.phone || '',
          email: data.email || '',
          heading: data.heading || '',
          description: data.description || '',
          formTitle: data.formTitle || '',
          namePlaceholder: data.namePlaceholder || '',
          phonePlaceholder: data.phonePlaceholder || '',
          emailPlaceholder: data.emailPlaceholder || '',
          messagePlaceholder: data.messagePlaceholder || '',
          successMessage: data.successMessage || '',
          successInfo: data.successInfo || '',
          submitButtonText: data.submitButtonText || '',
          closeButton: data.closeButton || '',
        });
      }
    };
    fetchContactInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!user) {
      setError('Вы не авторизованы.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('contact_info')
        .upsert([{
          id: contactInfo.id,
          ...formData,
          updated_at: new Date().toISOString(),
        }]);

      if (error) {
        setError('Ошибка при обновлении данных.');
      } else {
        alert('Данные успешно обновлены');
      }
    } catch (error) {
      setError('Произошла ошибка. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Требуется авторизация...</p>;
  if (!contactInfo) return <p>Загрузка данных...</p>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-4">
      <h2 className="text-2xl font-semibold text-center mb-4">Редактировать контактные данные</h2>
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((field) => (
          <div key={field} className="flex flex-col space-y-1">
            <label className="text-sm text-gray-700">{field}</label>
            <input
              type="text"
              name={field}
              value={formData[field as keyof typeof formData]}
              onChange={handleChange}
              className="w-full p-2 border rounded-md text-sm"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 text-white py-2 px-4 rounded-md text-sm"
        >
          {loading ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </form>
    </div>
  );
};

export default ContactEdit;
