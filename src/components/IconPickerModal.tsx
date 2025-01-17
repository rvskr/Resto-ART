const IconPickerModal: React.FC<{ isOpen: boolean; onClose: () => void; onSelectIcon: (iconName: string) => void }> = ({
    isOpen,
    onClose,
    onSelectIcon
  }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-3/4 max-w-2xl">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Выбор иконки</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              X
            </button>
          </div>
          <input
            type="text"
            placeholder="Поиск иконок..."
            value={iconFilter}
            onChange={(e) => setIconFilter(e.target.value)}
            className="border p-2 w-full mt-4 rounded"
          />
          <div className="grid grid-cols-6 gap-2 max-h-60 overflow-y-auto mt-4">
            {filteredIcons.map((iconName, index) => (
              <button
                key={`${iconName}-${index}`}
                onClick={() => {
                  onSelectIcon(iconName);
                  onClose();
                }}
                className="p-2 hover:bg-gray-100 rounded flex items-center justify-center"
                title={iconName}
              >
                <DynamicIcon iconName={iconName} className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };
  