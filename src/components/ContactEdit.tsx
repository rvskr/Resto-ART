import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Phone, Mail } from 'lucide-react';

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
  const [editableField, setEditableField] = useState<string | null>(null); // Track which field is being edited
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

  const handleEdit = (field: string) => {
    setEditableField(field);
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
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-semibold text-center mb-6">{contactInfo.heading}</h2>
      <p className="text-center text-gray-600 mb-8">{contactInfo.description}</p>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Heading */}
        <div>
          <label className="block text-sm text-gray-700">Заголовок</label>
          {editableField === 'heading' ? (
            <input
              type="text"
              name="heading"
              value={formData.heading}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              placeholder={contactInfo.heading}
            />
          ) : (
            <div className="flex justify-between items-center">
              <span>{formData.heading}</span>
              <button
                type="button"
                onClick={() => handleEdit('heading')}
                className="text-amber-600 hover:text-amber-700"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-gray-700">Описание</label>
          {editableField === 'description' ? (
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              placeholder={contactInfo.description}
              rows={4}
            />
          ) : (
            <div className="flex justify-between items-center">
              <span>{formData.description}</span>
              <button
                type="button"
                onClick={() => handleEdit('description')}
                className="text-amber-600 hover:text-amber-700"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Form Title */}
        <div>
          <label className="block text-sm text-gray-700">Название формы</label>
          {editableField === 'formTitle' ? (
            <input
              type="text"
              name="formTitle"
              value={formData.formTitle}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              placeholder={contactInfo.formTitle}
            />
          ) : (
            <div className="flex justify-between items-center">
              <span>{formData.formTitle}</span>
              <button
                type="button"
                onClick={() => handleEdit('formTitle')}
                className="text-amber-600 hover:text-amber-700"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Name Placeholder */}
        <div>
          <label className="block text-sm text-gray-700">Placeholder для имени</label>
          {editableField === 'namePlaceholder' ? (
            <input
              type="text"
              name="namePlaceholder"
              value={formData.namePlaceholder}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              placeholder={contactInfo.namePlaceholder}
            />
          ) : (
            <div className="flex justify-between items-center">
              <span>{formData.namePlaceholder}</span>
              <button
                type="button"
                onClick={() => handleEdit('namePlaceholder')}
                className="text-amber-600 hover:text-amber-700"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm text-gray-700">Телефон</label>
          {editableField === 'phone' ? (
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              placeholder={contactInfo.phone}
            />
          ) : (
            <div className="flex justify-between items-center">
              <span>{formData.phone}</span>
              <button
                type="button"
                onClick={() => handleEdit('phone')}
                className="text-amber-600 hover:text-amber-700"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Phone Placeholder */}
        <div>
          <label className="block text-sm text-gray-700">Placeholder для телефона</label>
          {editableField === 'phonePlaceholder' ? (
            <input
              type="text"
              name="phonePlaceholder"
              value={formData.phonePlaceholder}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              placeholder={contactInfo.phonePlaceholder}
            />
          ) : (
            <div className="flex justify-between items-center">
              <span>{formData.phonePlaceholder}</span>
              <button
                type="button"
                onClick={() => handleEdit('phonePlaceholder')}
                className="text-amber-600 hover:text-amber-700"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm text-gray-700">Email</label>
          {editableField === 'email' ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              placeholder={contactInfo.email}
            />
          ) : (
            <div className="flex justify-between items-center">
              <span>{formData.email}</span>
              <button
                type="button"
                onClick={() => handleEdit('email')}
                className="text-amber-600 hover:text-amber-700"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Email Placeholder */}
        <div>
          <label className="block text-sm text-gray-700">Placeholder для email</label>
          {editableField === 'emailPlaceholder' ? (
            <input
              type="text"
              name="emailPlaceholder"
              value={formData.emailPlaceholder}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              placeholder={contactInfo.emailPlaceholder}
            />
          ) : (
            <div className="flex justify-between items-center">
              <span>{formData.emailPlaceholder}</span>
              <button
                type="button"
                onClick={() => handleEdit('emailPlaceholder')}
                className="text-amber-600 hover:text-amber-700"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Message Placeholder */}
        <div>
          <label className="block text-sm text-gray-700">Placeholder для сообщения</label>
          {editableField === 'messagePlaceholder' ? (
            <input
              type="text"
              name="messagePlaceholder"
              value={formData.messagePlaceholder}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              placeholder={contactInfo.messagePlaceholder}
            />
          ) : (
            <div className="flex justify-between items-center">
              <span>{formData.messagePlaceholder}</span>
              <button
                type="button"
                onClick={() => handleEdit('messagePlaceholder')}
                className="text-amber-600 hover:text-amber-700"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Success Message */}
        <div>
          <label className="block text-sm text-gray-700">Сообщение об успехе</label>
          {editableField === 'successMessage' ? (
            <input
              type="text"
              name="successMessage"
              value={formData.successMessage}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              placeholder={contactInfo.successMessage}
            />
          ) : (
            <div className="flex justify-between items-center">
              <span>{formData.successMessage}</span>
              <button
                type="button"
                onClick={() => handleEdit('successMessage')}
                className="text-amber-600 hover:text-amber-700"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Success Info */}
        <div>
          <label className="block text-sm text-gray-700">Информация об успехе</label>
          {editableField === 'successInfo' ? (
            <textarea
              name="successInfo"
              value={formData.successInfo}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              placeholder={contactInfo.successInfo}
              rows={3}
            />
          ) : (
            <div className="flex justify-between items-center">
              <span>{formData.successInfo}</span>
              <button
                type="button"
                onClick={() => handleEdit('successInfo')}
                className="text-amber-600 hover:text-amber-700"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Submit Button Text */}
        <div>
          <label className="block text-sm text-gray-700">Текст кнопки отправки</label>
          {editableField === 'submitButtonText' ? (
            <input
              type="text"
              name="submitButtonText"
              value={formData.submitButtonText}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              placeholder={contactInfo.submitButtonText}
            />
          ) : (
            <div className="flex justify-between items-center">
              <span>{formData.submitButtonText}</span>
              <button
                type="button"
                onClick={() => handleEdit('submitButtonText')}
                className="text-amber-600 hover:text-amber-700"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Close Button Text */}
        <div>
          <label className="block text-sm text-gray-700">Текст кнопки закрытия</label>
          {editableField === 'closeButton' ? (
            <input
              type="text"
              name="closeButton"
              value={formData.closeButton}
              onChange={handleChange}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
              placeholder={contactInfo.closeButton}
            />
          ) : (
            <div className="flex justify-between items-center">
              <span>{formData.closeButton}</span>
              <button
                type="button"
                onClick={() => handleEdit('closeButton')}
                className="text-amber-600 hover:text-amber-700"
              >
                Edit
              </button>
            </div>
          )}
        </div>

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
