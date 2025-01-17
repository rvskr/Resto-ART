import React, { useEffect, useState } from 'react';
import { Hammer, Palette } from 'lucide-react';
import { supabase } from '../lib/supabase';

function Header() {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [contentBlocks, setContentBlocks] = useState<Record<string, { title: string; description: string }>>({});

  // Функция для вычисления высоты хедера
  const updateHeaderHeight = () => {
    const header = document.getElementById('header');
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
  };

  // Загружаем контент из Supabase
  useEffect(() => {
    const loadData = async () => {
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
      }
    };

    loadData();
    updateHeaderHeight(); // Изначально
    window.addEventListener('resize', updateHeaderHeight);  // Обновление при изменении размера

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);  // Убираем обработчик
    };
  }, []);

  const scrollToSection = (id: string) => {
    if (window.location.pathname !== '/') {
      window.location.href = `/#${id}`;
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header id="header" className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-20 py-4 sm:py-0">
            {/* Logo and icons */}
            <div className="flex flex-col sm:flex-row items-center space-x-2 sm:space-x-2 mb-4 sm:mb-0">
              <div className="flex -space-x-1">
                <Hammer className="h-8 w-8 text-amber-600" />
                <Palette className="h-8 w-8 text-amber-600" />
              </div>
              <span className="text-xl font-semibold">{contentBlocks.header?.title || 'РестоАрт'}</span>
            </div>

            {/* Navigation */}
            <nav>
              <ul className="flex space-x-4 sm:space-x-8 flex-wrap sm:flex-nowrap">
                <li>
                  <button onClick={() => scrollToSection('hero')} className="text-gray-600 hover:text-amber-600 transition-colors">
                    {contentBlocks.menu1?.title || 'Меню 1'}
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('services')} className="text-gray-600 hover:text-amber-600 transition-colors">
                    {contentBlocks.menu2?.title || 'Меню 2'}
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('process')} className="text-gray-600 hover:text-amber-600 transition-colors">
                    {contentBlocks.menu3?.title || 'Меню 3'}
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('portfolio')} className="text-gray-600 hover:text-amber-600 transition-colors">
                    {contentBlocks.menu4?.title || 'Меню 4'}
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('contact')} className="text-gray-600 hover:text-amber-600 transition-colors">
                    {contentBlocks.menu5?.title || 'Меню 5'}
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Контент, который будет прокручиваться с учетом отступа */}
      <div className="pt-[var(--header-height)]" style={{ '--header-height': `${headerHeight}px` }}>
        {/* Ваш контент */}
      </div>
    </>
  );
}

export default Header;
