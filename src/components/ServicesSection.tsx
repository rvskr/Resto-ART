import React from 'react';
import { HandMetal, Palette, Brush } from 'lucide-react'; // Импортируем необходимые иконки

type ServicesSectionProps = {
  contentBlocks: Record<string, { title: string; description: string }>;
};

const ServicesSection: React.FC<ServicesSectionProps> = ({ contentBlocks }) => {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">{contentBlocks.services?.title}</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">{contentBlocks.services?.description}</p>
        <div className="grid md:grid-cols-3 gap-8">
          {[{
            icon: <HandMetal className="h-8 w-8 text-amber-600" />,
            title: contentBlocks.services_handwork?.title || 'Ручная реставрация',
            description: contentBlocks.services_handwork?.description || 'Бережное восстановление антикварной мебели с использованием традиционных техник и материалов',
          },
          {
            icon: <Palette className="h-8 w-8 text-amber-600" />,
            title: contentBlocks.services_painting?.title || 'Художественная роспись',
            description: contentBlocks.services_painting?.description || 'Создание уникальных художественных элементов и декоративной росписи на мебели',
          },
          {
            icon: <Brush className="h-8 w-8 text-amber-600" />,
            title: contentBlocks.services_finishing?.title || 'Авторская отделка',
            description: contentBlocks.services_finishing?.description || 'Разработка индивидуальных решений для отделки и декорирования мебели',
          }].map((service, index) => (
            <div key={index} className="p-6 bg-stone-50 rounded-lg hover:shadow-lg transition-shadow">
              {service.icon}
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
