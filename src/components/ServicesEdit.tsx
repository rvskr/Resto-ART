import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import * as LucideIcons from 'lucide-react';
import { Pencil, Trash2, Plus, Check } from 'lucide-react';

// Получаем список уникальных иконок и удаляем дубликаты
const iconNames = Array.from(new Set(
  Object.keys(LucideIcons)
    .filter(key => key !== 'createLucideIcon' && !key.startsWith('Lucide'))
    .map(name => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase())
));

const DynamicIcon: React.FC<{ iconName: string; className?: string }> = ({ iconName, className }) => {
  const pascalCaseName = iconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');

  const IconComponent = (LucideIcons as unknown as Record<string, React.FC<any>>)[pascalCaseName];

  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};

const IconPickerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelectIcon: (iconName: string) => void;
}> = ({
  isOpen,
  onClose,
  onSelectIcon
}) => {
  const [localIconFilter, setLocalIconFilter] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredIcons = iconNames.filter(name =>
    name.toLowerCase().includes(localIconFilter.toLowerCase())
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-3/4 max-w-2xl">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Выбор иконки</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            X
          </button>
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Поиск иконок..."
          value={localIconFilter}
          onChange={(e) => setLocalIconFilter(e.target.value)}
          className="border p-2 w-full mt-4 rounded"
        />
        <div className="grid grid-cols-6 gap-2 max-h-60 overflow-y-auto mt-4">
          {filteredIcons.map((iconName, index) => (
            <button
              key={`${iconName}-${index}`}
              onClick={() => {
                onSelectIcon(iconName);
                onClose();
              }}
              className="p-2 hover:bg-gray-100 rounded flex items-center justify-center"
              title={iconName}
            >
              <DynamicIcon iconName={iconName} className="w-5 h-5" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

type Service = {
  id: number;
  title: string;
  description: string;
  icon: string;
};

const ServicesEditor: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState({ title: '', description: '', icon: 'circle' });
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*');

      if (error) {
        console.error('Ошибка при загрузке сервисов:', error.message);
      } else {
        setServices(data || []);
      }
    };

    fetchServices();
  }, []);

  const handleAddOrUpdateService = async () => {
    if (!newService.title || !newService.description || !newService.icon) {
      alert('Заполните все поля!');
      return;
    }

    if (isEditing && editingServiceId) {
      const { error } = await supabase
        .from('services')
        .update(newService)
        .match({ id: editingServiceId });

      if (error) {
        console.error('Ошибка при обновлении сервиса:', error.message);
      } else {
        setServices(services.map(service => 
          service.id === editingServiceId ? { ...service, ...newService } : service
        ));
        setIsEditing(false);
        setEditingServiceId(null);
        setNewService({ title: '', description: '', icon: 'circle' });
      }
    } else {
      const { error } = await supabase
        .from('services')
        .insert([newService]);

      if (error) {
        console.error('Ошибка при добавлении сервиса:', error.message);
      } else {
        setServices([...services, { id: Date.now(), ...newService }]);
        setNewService({ title: '', description: '', icon: 'circle' });
      }
    }
  };

  const handleDeleteService = async (id: number) => {
    const confirmDelete = window.confirm('Вы уверены, что хотите удалить этот сервис?');
    if (!confirmDelete) return;

    const { error } = await supabase
      .from('services')
      .delete()
      .match({ id });

    if (error) {
      console.error('Ошибка при удалении сервиса:', error.message);
    } else {
      setServices(services.filter(service => service.id !== id));
    }
  };

  const handleEditService = (service: Service) => {
    if (isEditing && editingServiceId === service.id) {
      setIsEditing(false);
      setEditingServiceId(null);
      setNewService({ title: '', description: '', icon: 'circle' });
    } else {
      setIsEditing(true);
      setEditingServiceId(service.id);
      setNewService(service);
    }
  };
  

  const handleIconSelection = (iconName: string) => {
    setNewService({ ...newService, icon: iconName });
  };

  return (
    <div className="container mx-auto p-1">
      <h2 className="text-3xl font-bold mb-4">Редактор Сервисов</h2>
      <div className="mb-2 space-y-2">
        <div className="flex flex-col md:flex-row gap-2 md:gap-2">
          <input
            type="text"
            value={newService.title}
            onChange={(e) => setNewService({ ...newService, title: e.target.value })}
            placeholder="Название сервиса"
            className="border p-2 rounded w-full md:w-1/3"
          />
          <input
            type="text"
            value={newService.description}
            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
            placeholder="Описание сервиса"
            className="border p-2 rounded w-full md:w-1/3"
          />
          <div className="relative w-full md:w-1/3">
            <button
              onClick={() => setIsIconPickerOpen(true)}
              className="border p-2 rounded flex items-center gap-2 w-full"
            >
              <DynamicIcon iconName={newService.icon} className="w-5 h-5" />
              <span>Выбрать иконку</span>
            </button>
          </div>
          <button 
            onClick={handleAddOrUpdateService} 
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors w-full md:w-auto flex items-center gap-2"
          >
            {isEditing ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                <span>Обновить</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Добавить сервис</span>
              </>
            )}
          </button>
        </div>
      </div>

      <ul className="space-y-4">
        {services.map(service => (
          <li key={service.id} className="p-4 border rounded-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <DynamicIcon iconName={service.icon} className="w-6 h-6" />
              <div>
                <p className="font-bold">{service.title}</p>
                <p className="text-gray-600">{service.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditService(service)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDeleteService(service.id)}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <IconPickerModal
        isOpen={isIconPickerOpen}
        onClose={() => setIsIconPickerOpen(false)}
        onSelectIcon={handleIconSelection}
      />
    </div>
  );
};

export default ServicesEditor;  