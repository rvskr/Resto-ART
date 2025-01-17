import React, { useState, useEffect } from 'react';
import { ChevronRight, Hammer, Mail, Phone, Palette, Brush, HandMetal } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link for routing
import { Case } from './types';
import Header from './components/Header';
import CaseModal from './components/CaseModal';
import ContactForm from './components/ContactForm'; // Импортируем компонент ContactForm
import { supabase } from './lib/supabase';

function App() {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [contentBlocks, setContentBlocks] = useState<Record<string, { title: string; description: string }>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Загружаем блоки контента
    const { data: blocksData } = await supabase.from('content_blocks').select('*');
    if (blocksData) {
      const blocks = blocksData.reduce((acc, block) => ({
        ...acc,
        [block.name]: {
          title: block.title,
          description: block.description,
        }
      }), {});
      setContentBlocks(blocks);
      
      // Load background image URL from the content blocks or another table
      const heroBlock = blocksData.find(block => block.name === 'hero');
      if (heroBlock && heroBlock.background_image) {
        setBackgroundImage(heroBlock.background_image); 
      }
    }
  
    // Загружаем кейсы
    const { data: casesData } = await supabase.from('cases').select('*').order('created_at', { ascending: false });
    if (casesData) setCases(casesData);
  };
  

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      {/* Hero Section */}
      <section id="hero" className="relative h-[80vh] bg-cover bg-center" style={{
  backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'url(https://cdn.pixabay.com/photo/2016/04/18/13/53/room-1336497_1280.jpg)'
}}>
  <div className="absolute inset-0 bg-black/50" />
  <div className="relative container mx-auto px-4 h-full flex items-center">
    <div className="max-w-2xl text-white">
      <h1 className="text-5xl font-bold mb-6">{contentBlocks.hero?.title}</h1>
      <p className="text-xl mb-8">{contentBlocks.hero?.description}</p>
      <a href="#contact" className="inline-flex items-center bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors">
        Обсудить проект
        <ChevronRight className="ml-2 h-5 w-5" />
      </a>
    </div>
  </div>
</section>


      {/* Services Section */}
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

      {/* Process Section */}
      <section id="process" className="py-20 bg-stone-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">{contentBlocks.process?.title}</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">{contentBlocks.process?.description}</p>
          <div className="grid md:grid-cols-4 gap-8">
            {[{
              step: '01',
              title: contentBlocks.process_step1?.title || 'Консультация',
              description: contentBlocks.process_step1?.description || 'Обсуждаем ваши идеи и пожелания, изучаем историю предмета',
            },
            {
              step: '02',
              title: contentBlocks.process_step2?.title || 'Разработка концепции',
              description: contentBlocks.process_step2?.description || 'Создаем уникальный план реставрации и художественного оформления',
            },
            {
              step: '03',
              title: contentBlocks.process_step3?.title || 'Ручная работа',
              description: contentBlocks.process_step3?.description || 'Выполняем реставрацию и художественные работы вручную',
            },
            {
              step: '04',
              title: contentBlocks.process_step4?.title || 'Финальные штрихи',
              description: contentBlocks.process_step4?.description || 'Доводим каждую деталь до совершенства',
            }].map((phase, index) => (
              <div key={index} className="relative p-6 bg-white rounded-lg">
                <span className="absolute -top-4 right-4 text-4xl font-bold text-amber-600/20">{phase.step}</span>
                <h3 className="text-xl font-semibold mb-2">{phase.title}</h3>
                <p className="text-gray-600">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">{contentBlocks.portfolio?.title}</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">{contentBlocks.portfolio?.description}</p>
          <div className="grid md:grid-cols-2 gap-8">
            {cases.slice(0, 2).map((case_) => (
              <div
                key={case_.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
                onClick={() => setSelectedCase(case_)}
              >
                <div className="aspect-video relative">
                  <img
                    src={case_.after_image}
                    alt={case_.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{case_.title}</h3>
                  <p className="text-gray-600">{case_.description}</p>
                  <div className="mt-4 flex items-center text-amber-600">
                    <span>Подробнее</span>
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          <div className="text-center mt-8">
            <Link
              to="/portfolio"  // Link to the PortfolioPage
              className="inline-flex items-center bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Показать еще
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-stone-100">
              <ContactForm /> 
      </section>

      {/* Case Modal */}
      {selectedCase && (
        <CaseModal case_={selectedCase} onClose={() => setSelectedCase(null)} />
      )}
    </div>
  );
}

export default App;
