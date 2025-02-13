import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import Header from './components/Header';
import CaseModal from './components/CaseModal';
import ContactForm from './components/ContactForm';
import ServicesSection from './components/ServicesSection';
import { supabase } from './lib/supabase';
import { Case } from './types';

function App() {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [contentBlocks, setContentBlocks] = useState<Record<string, { title: string; description: string }>>({});

  useEffect(() => {
    const loadData = async () => {
      const cachedBlocks = localStorage.getItem('contentBlocks');
      const cachedCases = localStorage.getItem('cases');
      const cacheTimestamp = localStorage.getItem('cacheTimestamp');
      const isStale = !cacheTimestamp || Date.now() - Number(cacheTimestamp) > 300000;

      if (!isStale && cachedBlocks && cachedCases) {
        setContentBlocks(JSON.parse(cachedBlocks));
        setCases(JSON.parse(cachedCases));
        return;
      }

      const { data: blocksData, error: blocksError } = await supabase.from('content_blocks').select('*');
      if (blocksError) return console.error('Ошибка загрузки данных из базы:', blocksError);

      if (blocksData) {
        const blocks = blocksData.reduce((acc, { name, title, description }) => ({
          ...acc, [name]: { title, description }
        }), {});
        setContentBlocks(blocks);
        localStorage.setItem('contentBlocks', JSON.stringify(blocks));
      }

      const { data: casesData, error: casesError } = await supabase.from('cases').select('*').order('created_at', { ascending: false });
      if (casesError) return console.error('Ошибка загрузки кейсов:', casesError);
      if (casesData) {
        setCases(casesData);
        localStorage.setItem('cases', JSON.stringify(casesData));
      }

      localStorage.setItem('cacheTimestamp', Date.now().toString());
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      
      {/* Hero Section */}
      <section
        id="hero"
        className="relative h-[80vh] bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: contentBlocks.background_image?.description
            ? `url(${contentBlocks.background_image.description})`
            : 'url(https://cdn.pixabay.com/photo/2016/04/18/13/53/room-1336497_1280.jpg)', // fallback изображение
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
      <ServicesSection contentBlocks={contentBlocks} />

      {/* Process Section */}
      <section id="process" className="py-20 bg-stone-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">{contentBlocks.process?.title}</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">{contentBlocks.process?.description}</p>
          <div className="grid md:grid-cols-4 gap-8">
            {['step1', 'step2', 'step3', 'step4'].map((step, index) => (
              <div key={index} className="relative p-6 bg-white rounded-lg">
                <span className="absolute -top-4 right-4 text-4xl font-bold text-amber-600/20">{`0${index + 1}`}</span>
                <h3 className="text-xl font-semibold mb-2">{contentBlocks[`process_${step}`]?.title}</h3>
                <p className="text-gray-600">{contentBlocks[`process_${step}`]?.description}</p>
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
            {cases.slice(0, 2).map(case_ => (
              <div key={case_.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group" onClick={() => setSelectedCase(case_)}>
                <div className="aspect-video relative">
                  <img src={case_.after_image} alt={case_.title} className="absolute inset-0 w-full h-full object-cover" />
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
          <div className="text-center mt-8">
            <a href="/portfolio" className="inline-flex items-center bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors">
              {contentBlocks.more_button?.title}
              <ChevronRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-stone-100">
        <ContactForm />
      </section>

      {selectedCase && <CaseModal case_={selectedCase} onClose={() => setSelectedCase(null)} />}
    </div>
  );
}

export default App;
