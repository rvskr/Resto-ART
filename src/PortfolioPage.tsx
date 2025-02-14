import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Case } from './types';
import Header from './components/Header';
import CaseModal from './components/CaseModal';
import ContactForm from './components/ContactForm';

const PortfolioPage = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [contentBlocks, setContentBlocks] = useState<Record<string, { title: string; description: string }>>({});

  useEffect(() => {
    // Загружаем блоки контента
    const loadContentBlocks = async () => {
      const cachedBlocks = localStorage.getItem('contentBlocks');
      const cacheTimestamp = localStorage.getItem('cacheTimestamp');
      const CACHE_DURATION = 1000 * 60 * 5; // 5 минут

      const isStale = !cacheTimestamp || Date.now() - Number(cacheTimestamp) > CACHE_DURATION;

      if (!isStale && cachedBlocks) {
        setContentBlocks(JSON.parse(cachedBlocks));
        return;
      }

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
        localStorage.setItem('cacheTimestamp', Date.now().toString());
      }
    };
    loadContentBlocks();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadCases = async () => {
      const cachedCases = localStorage.getItem('cases');
      const cacheTimestamp = localStorage.getItem('casesTimestamp');
      const CACHE_DURATION = 1000 * 60 * 5; // 5 минут

      const isStale = !cacheTimestamp || Date.now() - Number(cacheTimestamp) > CACHE_DURATION;

      if (!isStale && cachedCases) {
        setCases(JSON.parse(cachedCases));
        return;
      }

      const { data: casesData } = await supabase.from('cases').select('*').order('created_at', { ascending: false });
      if (casesData) {
        setCases(casesData);
        localStorage.setItem('cases', JSON.stringify(casesData));
        localStorage.setItem('casesTimestamp', Date.now().toString());
      }
    };
    loadCases();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <div className="container mx-auto px-4 py-20">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-6">
          <ChevronRight className="transform rotate-180 h-5 w-5 mr-2" />
          {contentBlocks.backButton?.title}
        </Link>

        <h2 className="text-3xl font-bold text-center mb-4">{contentBlocks.ourWorks?.title}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {cases.map((case_) => (
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

        {/* Contact Section */}
        <ContactForm />

        {/* Case Modal */}
        {selectedCase && (
          <CaseModal case_={selectedCase} onClose={() => setSelectedCase(null)} />
        )}
      </div>
    </div>
  );
};

export default PortfolioPage;
