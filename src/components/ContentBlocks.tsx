import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Pencil, X, Save } from 'lucide-react';

type ContentBlock = {
  id: string;
  name: string;
  title: string;
  description: string;
};

type Props = {
  contentBlocks: ContentBlock[];
  setContentBlocks: (blocks: ContentBlock[]) => void;
};

const ContentBlocks: React.FC<Props> = ({ contentBlocks, setContentBlocks }) => {
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);

  const handleSaveBlock = async () => {
    if (!editingBlock) return;

    try {
      const { error } = await supabase
        .from('content_blocks')
        .update({
          title: editingBlock.title,
          description: editingBlock.description
        })
        .eq('id', editingBlock.id);

      if (error) throw error;

      // Обновляем список блоков
      setContentBlocks(
        contentBlocks.map(block =>
          block.id === editingBlock.id ? editingBlock : block
        )
      );
      setEditingBlock(null);
    } catch (error) {
      console.error('Block save error:', error);
      alert('Ошибка при сохранении блока');
    }
  };

  return (
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
                    onChange={e => setEditingBlock(prev => ({
                      ...prev!,
                      title: e.target.value
                    }))}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Описание
                  </label>
                  <textarea
                    value={editingBlock.description}
                    onChange={e => setEditingBlock(prev => ({
                      ...prev!,
                      description: e.target.value
                    }))}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows={3}
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSaveBlock}
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
                    onClick={() => setEditingBlock(block)}
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
  );
};

export default ContentBlocks;
