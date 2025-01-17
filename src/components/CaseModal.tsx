import React, { useEffect, useRef } from 'react';
import { Case } from '../types';

interface CaseModalProps {
  case_: Case;
  onClose: () => void;
}

function CaseModal({ case_, onClose }: CaseModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{case_.title}</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">До реставрации</h3>
              <img
                src={case_.before_image}
                alt="До реставрации"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">После реставрации</h3>
              <img
                src={case_.after_image}
                alt="После реставрации"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Описание</h3>
            <p className="text-gray-600">{case_.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Процесс работы</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              {case_.process.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between text-gray-600">
            <span>Категория: {case_.category}</span>
            <span>Длительность: {case_.duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CaseModal;
