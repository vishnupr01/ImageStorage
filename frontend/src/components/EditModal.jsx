import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const EditModal = ({ isOpen, onClose, onSave, initialImage, initialCaption }) => {
  const [newImage, setNewImage] = useState(null);
  const [caption, setCaption] = useState(initialCaption || '');

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleSave = () => {
    onSave(newImage, caption.trim());
    setNewImage(null)
    setCaption('')
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600">
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2 className="text-xl mb-4">Edit Image</h2>
        
        {/* Image Preview */}
        {newImage ? (
          <img
            src={URL.createObjectURL(newImage)}
            alt="Preview"
            className="w-full h-40 object-cover rounded-md mb-4"
          />
        ) : (
          <img
            src={initialImage}
            alt="Current"
            className="w-full h-40 object-cover rounded-md mb-4"
          />
        )}

        {/* Image Upload */}
        <input type="file" onChange={handleImageChange} className="mb-4" />

        {/* Caption Input */}
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2"
          placeholder="Enter new caption"
          maxLength={25}
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
