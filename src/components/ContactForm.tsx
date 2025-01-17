import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Phone, Mail } from 'lucide-react';
import { Loader } from 'lucide-react';

const ContactForm: React.FC = () => {
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    // Загрузка информации из contact_info
    const fetchContactInfo = async () => {
      const { data, error } = await supabase.from('contact_info').select('*').single();
      if (error) {
        setError('Ошибка при загрузке данных контакта.');
      } else {
        setContactInfo(data);
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
    const { phone, email, message, name } = formData;
  
    // Валидация: либо телефон, либо email обязательны
    if (!phone && !email) {
      setError('Пожалуйста, укажите либо телефон, либо email.');
      return;
    }
  
    setError('');
    setLoading(true);
  
    try {
      // Вставка данных формы в вашу таблицу Supabase
      const { error } = await supabase.from('contact_forms').insert([{ name, phone, email, message }]);
  
      if (error) {
        setError('Произошла ошибка при отправке данных. Попробуйте позже.');
      } else {
        setSuccess(true);
        setFormData({ name: '', phone: '', email: '', message: '' });
  
        // Отправка данных в Telegram-бот
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const botToken = import.meta.env.VITE_APP_BOT_TOKEN;  
        const chatId = import.meta.env.VITE_APP_CHAT_ID;  
        const messageText = `
          Новое сообщение с формы обратной связи:
          Имя: ${name}
          Телефон: ${phone}
          Email: ${email}
          Сообщение: ${message}
        `;
  
        const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
        const response = await fetch(telegramApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: messageText,
          }),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          console.error('Ошибка при отправке в Telegram:');  
        } else {
          console.log('Сообщение успешно отправлено в Telegram');
        }
      }
    } catch (error) {
      console.error('Произошла ошибка при отправке данных:', error); 
      setError('Произошла ошибка. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };
  

  if (!contactInfo) return <p>Загрузка...</p>; // Пока данные не загружены

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold text-center mb-6">{contactInfo.heading}</h2>
      <p className="text-center text-gray-600 mb-8">{contactInfo.description}</p>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">{contactInfo.formTitle}</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-amber-600 mr-3" />
              <span>{contactInfo.phone}</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-amber-600 mr-3" />
              <span>{contactInfo.email}</span>
            </div>
          </div>
        </div>

        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-600 mb-4">{error}</p>}

            <div>
              <label className="block text-sm text-gray-700">{contactInfo.namePlaceholder}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder={contactInfo.namePlaceholder}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-700">{contactInfo.phonePlaceholder}</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder={contactInfo.phonePlaceholder}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700">{contactInfo.emailPlaceholder}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder={contactInfo.emailPlaceholder}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700">{contactInfo.messagePlaceholder}</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-amber-500 focus:outline-none"
                rows={6}
                placeholder={contactInfo.messagePlaceholder}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-md transition-colors duration-300 flex items-center justify-center"
            >
              {loading ? (
                <Loader className="animate-spin h-5 w-5 text-white" />
              ) : (
                contactInfo.submitButtonText || 'Send' 
              )}
            </button>

          </form>
        </div>
      </div>

      {success && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
            <h3 className="text-2xl font-semibold text-center mb-4">{contactInfo.successMessage || 'Сообщение отправлено!'}</h3>
            <p className="text-center text-gray-600 mb-6">
              {contactInfo.successInfo || 'Мы получили ваше сообщение и свяжемся с вами в ближайшее время.'} 
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-md"
            >
              {contactInfo.closeButton || 'Close'} 
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactForm;
