import { X } from "../../components/Icons";

export default function ConfirmModal({ isOpen, onConfirm, onCancel, message, t }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-lg text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100"
          title={t ? t('confirmModal.close') : "Close"}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4 text-gray-800 mt-4">{message}</div>
        <div className="flex justify-around mt-6">
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded font-semibold transition-colors"
          >
            {t ? t('confirmModal.delete') : 'Delete'}
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-2 rounded font-semibold transition-colors"
          >
            {t ? t('confirmModal.cancel') : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
}
