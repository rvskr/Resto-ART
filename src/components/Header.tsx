import React, { useEffect, useState } from 'react';
import { Hammer, Palette } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory

function Header() {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [contentBlocks, setContentBlocks] = useState<Record<string, { title: string; description: string }>>({});
  
  // States for click tracking
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState<number>(0);
  
  const navigate = useNavigate(); // For navigation

  // Function to calculate header height
  const updateHeaderHeight = () => {
    const header = document.getElementById('header');
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }
  };


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
    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);  

    return () => {
      window.removeEventListener('resize', updateHeaderHeight); 
    };
  }, []);

  const scrollToSection = (id: string) => {
    if (window.location.pathname !== '/') {
      window.location.href = `/#${id}`;
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTitleClick = () => {
    const currentTime = Date.now();
    if (currentTime - lastClickTime > 5000) {
      setClickCount(1);
    } else {
      setClickCount(prevCount => prevCount + 1);
    }

    setLastClickTime(currentTime);
    if (clickCount + 1 >= 5) {
      navigate('/admin'); 
    }
  };

  return (
    <>
      <header id="header" className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-20 py-4 sm:py-0">
            {/* Logo and icons */}
            <div onClick={() => scrollToSection('hero')} className="flex flex-col sm:flex-row items-center space-x-2 sm:space-x-2 mb-4 sm:mb-0">
              <div  className="flex -space-x-1" >
                <Hammer  className="h-8 w-8 text-amber-600" />
                <Palette className="h-8 w-8 text-amber-600" />
                
              </div>
              <span
                className="text-xl font-semibold cursor-pointer"
                onClick={handleTitleClick}
              >
                {contentBlocks.Title?.title}
              </span>
            </div>

            {/* Navigation */}
            <nav>
              <ul className="flex space-x-4 sm:space-x-8 flex-wrap sm:flex-nowrap">
                <li>
                  <button onClick={() => scrollToSection('hero')} className="text-gray-600 hover:text-amber-600 transition-colors">
                    {contentBlocks.menu1?.title}
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('services')} className="text-gray-600 hover:text-amber-600 transition-colors">
                    {contentBlocks.menu2?.title}
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('process')} className="text-gray-600 hover:text-amber-600 transition-colors">
                    {contentBlocks.menu3?.title}
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('portfolio')} className="text-gray-600 hover:text-amber-600 transition-colors">
                    {contentBlocks.menu4?.title}
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('contact')} className="text-gray-600 hover:text-amber-600 transition-colors">
                    {contentBlocks.menu5?.title}
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Content with scroll offset */}
      <div className="pt-[var(--header-height)]" style={{ '--header-height': `${headerHeight}px` }}>
        {/* Your content */}
      </div>
    </>
  );
}

export default Header;
