import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import * as LucideIcons from 'lucide-react';

// Получаем список уникальных иконок и удаляем дубликаты
const iconNames = Array.from(new Set(
  Object.keys(LucideIcons)
    .filter(key => key !== 'createLucideIcon' && !key.startsWith('Lucide'))
    .map(name => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase())
));

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
  const [iconFilter, setIconFilter] = useState('');
  const [isEditing, setIsEditing] = useState(false); // New state to track editing mode
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null); // ID of the service being edited

  // Fetch services from Supabase
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
      // Update service
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
      // Add new service
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
    setIsEditing(true);
    setEditingServiceId(service.id);
    setNewService(service);
  };

  const DynamicIcon: React.FC<{ iconName: string; className?: string }> = ({ iconName, className }) => {
    const pascalCaseName = iconName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');

    const IconComponent = (LucideIcons as Record<string, React.FC<any>>)[pascalCaseName];

    if (!IconComponent) return null;
    return <IconComponent className={className} />;
  };

  const filteredIcons = iconNames.filter(name => 
    name.toLowerCase().includes(iconFilter.toLowerCase())
  );

  const handleIconSelection = (iconName: string) => {
    setNewService({ ...newService, icon: iconName });
  };

  const IconPickerModal: React.FC<{ isOpen: boolean; onClose: () => void; onSelectIcon: (iconName: string) => void }> = ({
    isOpen,
    onClose,
    onSelectIcon
  }) => {
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
            type="text"
            placeholder="Поиск иконок..."
            value={iconFilter}
            onChange={(e) => setIconFilter(e.target.value)}
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

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold mb-4">Редактор Сервисов</h2>
      <div className="mb-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
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
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors w-full md:w-auto"
          >
            {isEditing ? 'Обновить' : 'Добавить'}
          </button>
        </div>
      </div>

      <ul className="space-y-4">
        {services.map(service => (
          <li key={service.id} className="p-4 border rounded-lg flex justify-between items-center">
            <div className="flex items-center gap-4">
              <DynamicIcon iconName={service.icon} className="w-6 h-6" />
              <div>
                <p className="font-bold">{service.title}</p>
                <p className="text-gray-600">{service.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditService(service)}
                className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-colors"
              >
                Редактировать
              </button>
              <button
                onClick={() => handleDeleteService(service.id)}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
              >
                Удалить
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
