import { useState } from 'react';
import { Case } from '../types';

interface CaseModalProps {
  case_: Case;
  onClose: () => void;
}

function CaseModal({ case_, onClose }: CaseModalProps) {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const handleClickOutside = (event: React.MouseEvent) => {
    // Проверяем, что event.target является элементом (не нодой) с методом closest
    const target = event.target as Element;

    // Проверяем, что клик был вне модального окна и полноэкранного изображения
    if (target && !target.closest('.modal-content') && !fullscreenImage) {
      onClose();
    }
  };

  const closeFullscreenImage = () => setFullscreenImage(null);

  const handleClose = () => {
    if (fullscreenImage) {
      closeFullscreenImage(); // Закрыть полноэкранное изображение
    } else {
      onClose(); // Закрыть модальное окно
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleClickOutside}
    >
      {/* Полноэкранное изображение */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={closeFullscreenImage}
        >
          <img
            src={fullscreenImage}
            alt="Fullscreen"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
          />
        </div>
      )}

      <div className="modal-content bg-white rounded-lg max-w-4xl w-full max-h-[85vh] overflow-y-auto relative">
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
                className="w-full h-64 object-cover rounded-lg cursor-pointer"
                onClick={() => setFullscreenImage(case_.before_image || null)}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">После реставрации</h3>
              <img
                src={case_.after_image}
                alt="После реставрации"
                className="w-full h-64 object-cover rounded-lg cursor-pointer"
                onClick={() => setFullscreenImage(case_.after_image || null)}
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

      {/* Кнопка закрытия модального окна/изображения */}
      <button
        onClick={handleClose}
        className="fixed top-5 right-5 text-3xl text-gray-600 hover:text-gray-900 focus:outline-none z-50"
      >
        &times;
      </button>
    </div>
  );
}

export default CaseModal;
