import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import * as LucideIcons from 'lucide-react';

type Service = {
  id: number;
  title: string;
  description: string;
  icon: string;
};

type ServicesSectionProps = {
  contentBlocks: Record<string, { title: string; description: string }>;
};

const ServicesSection: React.FC<ServicesSectionProps> = ({ contentBlocks }) => {
  const [services, setServices] = useState<Service[]>([]);

  const fetchServices = async () => {
    try {
      const cachedServices = localStorage.getItem('services');
      const cacheTimestamp = localStorage.getItem('servicesTimestamp');
      const CACHE_DURATION = 1000 * 60 * 5; // 5 минут

      const isStale = !cacheTimestamp || Date.now() - Number(cacheTimestamp) > CACHE_DURATION;

      if (!isStale && cachedServices) {
        setServices(JSON.parse(cachedServices));
        return;
      }

      const { data, error } = await supabase.from('services').select('*');
      if (error) {
        throw error;
      }
      setServices(data || []);
      localStorage.setItem('services', JSON.stringify(data));
      localStorage.setItem('servicesTimestamp', Date.now().toString());
    } catch (error) {
      console.error('Ошибка при загрузке сервисов:', error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const DynamicIcon: React.FC<{ iconName: string }> = ({ iconName }) => {
    // Конвертируем имя иконки из kebab-case в PascalCase
    const pascalCaseName = iconName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');

    // Получаем компонент иконки из Lucide
    const IconComponent = (LucideIcons as unknown as Record<string, React.FC<any>>)[pascalCaseName];

    if (!IconComponent) {
      console.warn(`Иконка "${iconName}" не найдена`);
      return null;
    }

    return <IconComponent className="h-8 w-8 text-amber-600" />;
  };

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">
          {contentBlocks.services?.title}
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          {contentBlocks.services?.description}
        </p>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="p-6 bg-stone-50 rounded-lg hover:shadow-lg transition-shadow"
            >
              <DynamicIcon iconName={service.icon} />
              <h3 className="text-xl font-semibold mt-4 mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;