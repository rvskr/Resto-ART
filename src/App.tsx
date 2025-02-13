import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import Header from './components/Header';
import CaseModal from './components/CaseModal';
import ContactForm from './components/ContactForm';
import ServicesSection from './components/ServicesSection'; // Импортируем компонент ServicesSection
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
    // Проверяем данные в localStorage
    const cachedBlocks = localStorage.getItem('contentBlocks');
    const cachedCases = localStorage.getItem('cases');
    const cacheTimestamp = localStorage.getItem('cacheTimestamp');
    const CACHE_DURATION = 1000 * 60 * 5; // 5 минут

    const isStale = !cacheTimestamp || Date.now() - Number(cacheTimestamp) > CACHE_DURATION;

    if (!isStale && cachedBlocks && cachedCases) {
      setContentBlocks(JSON.parse(cachedBlocks));
      setCases(JSON.parse(cachedCases));
      return;
    }

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
      localStorage.setItem('contentBlocks', JSON.stringify(blocks));
      
      // Загружаем фоновое изображение из блока "hero" или другой таблицы
      const heroBlock = blocksData.find(block => block.name === 'hero');
      if (heroBlock && heroBlock.background_image) {
        setBackgroundImage(heroBlock.background_image); 
      }
    }
  
    // Загружаем кейсы
    const { data: casesData } = await supabase.from('cases').select('*').order('created_at', { ascending: false });
    if (casesData) {
      setCases(casesData);
      localStorage.setItem('cases', JSON.stringify(casesData));
    }

    // Обновляем timestamp кэша
    localStorage.setItem('cacheTimestamp', Date.now().toString());
  };
  

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      {/* Hero Section */}
      <section
  id="hero"
  className="relative h-[80vh] bg-cover bg-center overflow-hidden"
  style={{
    backgroundImage: backgroundImage
      ? `url(${backgroundImage})`
      : 'url(https://cdn.pixabay.com/photo/2016/04/18/13/53/room-1336497_1280.jpg)',
  }}
>
  <div className="absolute inset-0 bg-black/50" />
  <div className="relative container mx-auto px-4 h-full flex items-center justify-center">
    <div className="max-w-2xl text-white">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 break-words">{contentBlocks.hero?.title}</h1>
      <p className="text-xl mb-8">{contentBlocks.hero?.description}</p>
      <a
        href="#contact"
        className="inline-flex items-center bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors"
      >
        {contentBlocks.discussButton?.title}
        <ChevronRight className="ml-2 h-5 w-5" />
      </a>
    </div>
  </div>
</section>

      {/* Services Section */}
      <ServicesSection contentBlocks={contentBlocks} /> {/* Используем компонент ServicesSection */}

      {/* Process Section */}
      <section id="process" className="py-20 bg-stone-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">{contentBlocks.process?.title}</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">{contentBlocks.process?.description}</p>
          <div className="grid md:grid-cols-4 gap-8">
            {[{
              step: '01',
              title: contentBlocks.process_step1?.title ,
              description: contentBlocks.process_step1?.description ,
            },
            {
              step: '02',
              title: contentBlocks.process_step2?.title ,
              description: contentBlocks.process_step2?.description ,
            },
            {
              step: '03',
              title: contentBlocks.process_step3?.title ,
              description: contentBlocks.process_step3?.description,
            },
            {
              step: '04',
              title: contentBlocks.process_step4?.title ,
              description: contentBlocks.process_step4?.description,
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
                    <span>{contentBlocks.details?.title}</span>
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          <div className="text-center mt-8">
            <a
              href="/portfolio"
              className="inline-flex items-center bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              {contentBlocks.more_button?.title }
              <ChevronRight className="ml-2 h-5 w-5" />
            </a>
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