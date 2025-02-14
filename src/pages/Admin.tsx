import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Plus } from 'lucide-react';
import ContactEdit from '../components/ContactEdit';
import ServicesEdit from '../components/ServicesEdit';
import AdminHeader from '../components/AdminHeader';
import ContentBlocks from '../components/ContentBlocks';

type Case = {
  id: string;
  title: string;
  description: string;
  before_image: string;
  after_image: string;
  process: string[];
  duration: string;
  category: string;
};

type ContentBlock = {
  id: string;
  name: string;
  title: string;
  description: string;
};

type ImageFiles = {
  before: File | null;
  after: File | null;
};

const INITIAL_CASE: Case = {
  id: '',
  title: '',
  description: '',
  before_image: '',
  after_image: '',
  process: [],
  duration: '',
  category: '',
};

const INPUT_FIELDS = [
  { key: 'title', label: 'Название' },
  { key: 'description', label: 'Описание', type: 'textarea' },
  { key: 'duration', label: 'Длительность' },
  { key: 'category', label: 'Категория' },
];

export default function Admin() {
  const navigate = useNavigate();
  const [cases, setCases] = useState<Case[]>([]);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [newCase, setNewCase] = useState<Case>(INITIAL_CASE);
  const [newCaseFormVisible, setNewCaseFormVisible] = useState(false);
  const [imageFiles, setImageFiles] = useState<ImageFiles>({ before: null, after: null });

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return navigate('/admin/login');
      try {
        const [casesData, blocksData] = await Promise.all([
          supabase.from('cases').select('*').order('created_at', { ascending: false }),
          supabase.from('content_blocks').select('*'),
        ]);
        if (casesData.error || blocksData.error) throw new Error('Error loading data');
        setCases(casesData.data);
        setContentBlocks(blocksData.data);
      } catch (error) {
        console.error(error);
        alert('Ошибка при загрузке данных');
      }
    };
    init();
  }, [navigate]);

  const uploadImage = async (file: File, prefix: string): Promise<string | null> => {
    if (!file) return null;
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${file.name.split('.').pop()}`;
    const path = `${prefix}/${fileName}`;
    try {
      const { error: uploadError } = await supabase.storage.from('images').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(path);
      return publicUrl;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleSaveCase = async () => {
    try {
      if (!newCase.title || !newCase.description) {
        alert('Не все поля заполнены!');
        return;
      }

      const [beforeImageUrl, afterImageUrl] = await Promise.all([
        imageFiles.before ? uploadImage(imageFiles.before, 'before') : newCase.before_image,
        imageFiles.after ? uploadImage(imageFiles.after, 'after') : newCase.after_image,
      ]);

      const caseData = {
        title: newCase.title,
        description: newCase.description,
        before_image: beforeImageUrl,
        after_image: afterImageUrl,
        process: newCase.process,
        duration: newCase.duration,
        category: newCase.category,
      };

      if (newCase.id && newCase.id !== '') {
        const { data, error } = await supabase.from('cases').update(caseData).eq('id', newCase.id).select('*').maybeSingle();
        if (error) throw error;
        setCases(prev => prev.map(c => (c.id === newCase.id ? { ...c, ...data } : c)));
      } else {
        const { data, error } = await supabase.from('cases').insert(caseData).select('*').single();
        if (error) throw error;
        setCases(prev => [data, ...prev]);
      }

      resetForm();
    } catch (error) {
      console.error('Save error:', error);
      alert(`Ошибка при сохранении: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  };

  const handleDeleteCase = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту работу?')) return;
    try {
      const { error } = await supabase.from('cases').delete().eq('id', id);
      if (error) throw error;
      setCases(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error(error);
      alert('Ошибка при удалении');
    }
  };

  const resetForm = () => {
    setNewCase(INITIAL_CASE);
    setNewCaseFormVisible(false);
    setImageFiles({ before: null, after: null });
  };

  const renderCaseForm = () => (
    <div className="border rounded-lg p-4 mb-4 space-y-4">
      {INPUT_FIELDS.map(({ key, label, type }) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          {type === 'textarea' ? (
            <textarea
              value={newCase[key as keyof Case]} // Указываем ключи с типом keyof Case
              onChange={e => setNewCase(prev => ({ ...prev, [key]: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
            />
          ) : (
            <input
              type="text"
              value={newCase[key as keyof Case]} // Указываем ключи с типом keyof Case
              onChange={e => setNewCase(prev => ({ ...prev, [key]: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg"
            />
          )}
        </div>
      ))}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Процесс (через запятую)</label>
        <input
          type="text"
          value={newCase.process.join(', ')} // Конкатенируем строку
          onChange={e => setNewCase(prev => ({ ...prev, process: e.target.value.split(',').map(s => s.trim()) }))}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>
      <div className="flex space-x-4">
        {['before', 'after'].map(type => (
          <div key={type} className="flex-1 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Изображение {type === 'before' ? 'до' : 'после'}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files?.[0] || null;
                setImageFiles(prev => ({ ...prev, [type]: file }));
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () =>
                    setNewCase(prev => ({ ...prev, [`${type}_image`]: reader.result as string }));
                  reader.readAsDataURL(file);
                }
              }}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {newCase[`${type}_image` as keyof Case] && (
              <img
                src={newCase[`${type}_image` as keyof Case] as string}
                alt={`${type}`}
                className="mt-2 w-full h-[300px] object-contain rounded-lg"
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <button onClick={handleSaveCase} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          Сохранить
        </button>
        <button onClick={resetForm} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg">
          Отмена
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="max-w-6xl mx-auto">
        <AdminHeader />
        <section className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Работы</h2>
          <button
            onClick={() => setNewCaseFormVisible(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4 hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Добавить работу
          </button>
          {newCaseFormVisible && renderCaseForm()}
          {cases.map(c => (
            <div key={c.id} className="border rounded-lg p-4 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{c.title}</h3>
                  <p className="text-gray-600">{c.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setNewCase(c);
                      setNewCaseFormVisible(true);
                    }}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-lg"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCase(c.id)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
        <section className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <ServicesEdit />
        </section>
        <ContentBlocks contentBlocks={contentBlocks} setContentBlocks={setContentBlocks} />
        <ContactEdit />
      </div>
    </div>
  );
}
