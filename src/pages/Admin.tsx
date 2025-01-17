import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Plus, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import ContactEdit from '../components/ContactEdit';
import ServicesEdit from '../components/ServicesEdit';



interface Case {
  id: string;
  title: string;
  description: string;
  before_image: string;
  after_image: string;
  process: string[];
  duration: string;
  category: string;
}

interface ContentBlock {
  id: string;
  name: string;
  title: string;
  description: string;
}

interface ContactInfo {
  id: string;
  phone: string;
  email: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const [cases, setCases] = useState<Case[]>([]);
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [editingContact, setEditingContact] = useState(false);
  const [newCase, setNewCase] = useState<Case>({
    id: '',
    title: '',
    description: '',
    before_image: '',
    after_image: '',
    process: [],
    duration: '',
    category: '',
  });
  const [newCaseFormVisible, setNewCaseFormVisible] = useState(false);
  const [beforeImageFile, setBeforeImageFile] = useState<File | null>(null);
  const [afterImageFile, setAfterImageFile] = useState<File | null>(null);

  useEffect(() => {
    checkAuth();
    loadData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin/login');
    }
  };

  const loadData = async () => {
    const { data: casesData } = await supabase
      .from('cases')
      .select('*')
      .order('created_at', { ascending: false });
    if (casesData) setCases(casesData);

    const { data: blocksData } = await supabase
      .from('content_blocks')
      .select('*');
    if (blocksData) setContentBlocks(blocksData);

    const { data: contactData } = await supabase
      .from('contact_info')
      .select('*')
      .single();
    if (contactData) setContactInfo(contactData);
  };

  const uploadImage = async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from('images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    const publicUrl = supabase.storage.from('images').getPublicUrl(path);
    return publicUrl.data.publicUrl;
  };

  const handleSaveCase = async () => {
    if (!newCase.title || !newCase.description) {
      alert('Не все поля заполнены!');
      return;
    }

    let beforeImageUrl = newCase.before_image;
    let afterImageUrl = newCase.after_image;

    // Upload images if provided
    if (beforeImageFile) {
      const beforePath = `cases/before/${Date.now()}_${beforeImageFile.name}`;
      beforeImageUrl = await uploadImage(beforeImageFile, beforePath);
    }

    if (afterImageFile) {
      const afterPath = `cases/after/${Date.now()}_${afterImageFile.name}`;
      afterImageUrl = await uploadImage(afterImageFile, afterPath);
    }

    const caseToInsert = {
      title: newCase.title,
      description: newCase.description,
      before_image: beforeImageUrl,
      after_image: afterImageUrl,
      process: newCase.process,
      duration: newCase.duration,
      category: newCase.category,
    };

    if (newCase.id) {
      const { error } = await supabase
        .from('cases')
        .update(caseToInsert)
        .eq('id', newCase.id);

      if (!error) {
        setCases(cases.map(c => c.id === newCase.id ? newCase : c));
      }
    } else {
      const { data, error } = await supabase
        .from('cases')
        .insert([caseToInsert])
        .select()
        .single();

      if (error) {
        console.error('Error inserting case:', error);
      } else {
        setCases([data, ...cases]);
      }
    }

    setNewCaseFormVisible(false);
    setNewCase({
      id: '',
      title: '',
      description: '',
      before_image: '',
      after_image: '',
      process: [],
      duration: '',
      category: '',
    });
    setBeforeImageFile(null);
    setAfterImageFile(null);
  };

  const handleDeleteCase = async (id: string) => {
    const { error } = await supabase
      .from('cases')
      .delete()
      .eq('id', id);

    if (!error) {
      setCases(cases.filter(c => c.id !== id));
    }
  };

  const handleSaveBlock = async (block: ContentBlock) => {
    const { error } = await supabase
      .from('content_blocks')
      .update({ title: block.title, description: block.description })
      .eq('id', block.id);

    if (!error) {
      setContentBlocks(contentBlocks.map(b => b.id === block.id ? block : b));
    }
    setEditingBlock(null);
  };

  const handleSaveContact = async () => {
    if (contactInfo) {
      const { error } = await supabase
        .from('contact_info')
        .update({ phone: contactInfo.phone, email: contactInfo.email })
        .eq('id', contactInfo.id);

      if (!error) {
        setEditingContact(false);
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const handleEditCase = (caseToEdit: Case) => {
    setNewCase(caseToEdit);
    setNewCaseFormVisible(true);
  };

  const handleEditBlock = (block: ContentBlock) => {
    setEditingBlock(block);
  };


  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Админ-панель</h1>
          <div className="space-x-4">
            <button
              onClick={handleLogout}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
            >
              Выйти
            </button>
            <Link to="/admin/form">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Показать Заявки
              </button>
            </Link>
          </div>
        </div>
        <section className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Работы</h2>

          <button
            onClick={() => setNewCaseFormVisible(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Добавить работу
          </button>

          {newCaseFormVisible && (
            <div className="border rounded-lg p-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название
                </label>
                <input
                  type="text"
                  value={newCase.title}
                  onChange={e => setNewCase({ ...newCase, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание
                </label>
                <textarea
                  value={newCase.description}
                  onChange={e => setNewCase({ ...newCase, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Процесс
                </label>
                <input
                  type="text"
                  value={newCase.process.join(', ')}
                  onChange={e =>
                    setNewCase({ ...newCase, process: e.target.value.split(',') })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Длительность
                </label>
                <input
                  type="text"
                  value={newCase.duration}
                  onChange={e => setNewCase({ ...newCase, duration: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Категория
                </label>
                <input
                  type="text"
                  value={newCase.category}
                  onChange={e => setNewCase({ ...newCase, category: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="flex space-x-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Изображение до</label>
                  <input
                    type="file"
                    onChange={e => setBeforeImageFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Изображение после</label>
                  <input
                    type="file"
                    onChange={e => setAfterImageFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveCase}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Сохранить
                </button>
                <button
                  onClick={() => setNewCaseFormVisible(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          {cases.map(c => (
            <div key={c.id} className="border rounded-lg p-4 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{c.title}</h3>
                  <p className="text-gray-600">{c.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditCase(c)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCase(c.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
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
        <section className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Блоки контента</h2>
          <div className="space-y-4">
            {contentBlocks.map(block => (
              <div key={block.id} className="border rounded-lg p-4">
                {editingBlock?.id === block.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Заголовок
                      </label>
                      <input
                        type="text"
                        value={editingBlock.title}
                        onChange={e => setEditingBlock({ ...editingBlock, title: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Описание
                      </label>
                      <textarea
                        value={editingBlock.description}
                        onChange={e => setEditingBlock({ ...editingBlock, description: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg"
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSaveBlock(editingBlock)}
                        className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                      >
                        <Save className="h-4 w-4" />
                        <span>Сохранить</span>
                      </button>
                      <button
                        onClick={() => setEditingBlock(null)}
                        className="flex items-center space-x-1 bg-gray-200 text-gray-800 px-3 py-1 rounded-lg hover:bg-gray-300"
                      >
                        <X className="h-4 w-4" />
                        <span>Отмена</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{block.name}</h3>
                        <h4 className="text-lg">{block.title}</h4>
                      </div>
                      <button
                        onClick={() => handleEditBlock(block)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-gray-600">{block.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
        <div>
      <ContactEdit />
    </div>
      </div>
    </div>
  );
} 