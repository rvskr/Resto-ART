import React from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Case } from '../../types';
import { CaseForm } from './CaseForm';

interface CasesSectionProps {
  cases: Case[];
  newCase: Case;
  isFormVisible: boolean;
  onSave: () => void;
  onDelete: (id: string) => void;
  onEdit: (caseItem: Case) => void;
}

export function CasesSection({ cases, newCase, isFormVisible, onSave, onDelete, onEdit }: CasesSectionProps) {
  return (
    <section className="bg-white rounded-lg p-6 mb-8 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Работы</h2>
      
      {/* Кнопка добавления */}
      <button
        onClick={() => onEdit(newCase)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4 hover:bg-blue-700 flex items-center gap-2"
      >
        <Plus className="h-4 w-4" /> Добавить работу
      </button>

      {/* Форма редактирования */}
      {isFormVisible && <CaseForm case={newCase} onSave={onSave} />}

      {/* Список кейсов */}
      {cases.map(c => (
        <div key={c.id} className="border rounded-lg p-4 mb-4">
          {/* ... содержимое карточки кейса ... */}
        </div>
      ))}
    </section>
  );
} 