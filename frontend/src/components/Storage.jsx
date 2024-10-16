import React, { useEffect, useState, useCallback } from 'react';
import { deletImage, getAllImages, updateImages, updateSingleImage } from '../api/user';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import EditModal from './EditModal';
import convertBlobUrlToBase64 from '../helperFunctions/convertFile';
import toast from 'react-hot-toast';

// Define a type for drag and drop items
const ItemType = 'IMAGE';

const Storage = () => {
  const [images, setImages] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(null)
  const [currentObjId, setCurrentObjId] = useState()

  const restoreImages = async () => {
    try {
      const response = await getAllImages();
      console.log(response);

      // Assuming response.data.data is an array of objects
      const newImages = response.data.data.flatMap((post) =>
        post.images.map((img) => ({
          image: img.image, // Accessing the image property
          caption: img.caption,
          objId: img._id  // Accessing the caption property
        }))
      );

      setImages(newImages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    restoreImages();
  }, []);

  // Toggle the dropdown for a specific image
  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const moveImage = useCallback(async (dragIndex, hoverIndex) => {
    const updatedImages = [...images];
    const [draggedImage] = updatedImages.splice(dragIndex, 1);
    updatedImages.splice(hoverIndex, 0, draggedImage);
    setImages(updatedImages);

    try {
      const response = await updateImages(updatedImages)
      console.log(response);

    } catch (error) {
      console.log(error);
      throw error

    }
  }, [images]);

  const handleEdit = (index, objId) => {
    setCurrentImageIndex(index)
    setCurrentObjId(objId)
    setIsModalOpen(true)
  }
  const handleDelete = async (objId) => {
    try {
      const response = await deletImage(objId)
      if (response.data.status === 'success') {
        const updatedImages = images.filter(image => image.objId !== objId);
        setImages(updatedImages);
        toast.success('deleted successfully')
        setDropdownOpen(null)
      } else {
        toast.error('deletion failed')
      }

    } catch (error) {
      toast.error('deletion failed')
      throw error
    }
  }

  const handleSave = async (newImage, newCaption) => {
    const updateImages = [...images]
    setDropdownOpen(null)
    if (newImage) {
      const imageUrl = URL.createObjectURL(newImage)
      const base64Image = await convertBlobUrlToBase64(imageUrl);
      updateImages[currentImageIndex].image = imageUrl
    }
    if (newCaption) {
      updateImages[currentImageIndex].caption = newCaption
    }

    setImages(updateImages)
    try {
      const imageUrl = newImage !== null ? URL.createObjectURL(newImage) : ''
      let base64Image = ''
      if (imageUrl !== '') {
        base64Image = await convertBlobUrlToBase64(imageUrl);
      }
      const response = await updateSingleImage(currentObjId, base64Image, newCaption)
      console.log("singleImage", response);
      if (response.data.status === 'success') {
        toast.success('updated successfully')
      } else {
        toast.error('updated failed')
      }
    } catch (error) {
      console.log(error);
      toast.error('server down')
      throw error
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {images.length > 0 ? (
          images.map((image, index) => (
            <DraggableImage
              key={index}
              image={image}
              index={index}
              moveImage={moveImage}
              dropdownOpen={dropdownOpen}
              toggleDropdown={toggleDropdown}
              handleEdit={() => handleEdit(index, image.objId)}
              handleDelete={() => handleDelete(image.objId)}
            />
          ))
        ) : (
          <p>No images to display</p>
        )}
      </div>
      <EditModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setDropdownOpen(null)
        }}
        onSave={handleSave}
        initialImage={currentImageIndex !== null ? images[currentImageIndex].image : ''}
        initialCaption={currentImageIndex !== null ? images[currentImageIndex].caption : ''}
      />
    </DndProvider>
  );
};

// DraggableImage Component
const DraggableImage = ({ image, objId, index, moveImage, dropdownOpen, toggleDropdown, handleEdit, handleDelete }) => {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: ItemType,
    hover(item) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveImage(dragIndex, hoverIndex);
      item.index = hoverIndex; // Update the dragged item's index
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`relative bg-white shadow-md rounded-lg overflow-hidden border border-gray-300 ${isDragging ? 'opacity-50' : ''}`}
      style={{ height: '340px', padding: '10px', cursor: 'move' }}
    >
      {/* Image */}
      <img
        src={image.image}
        alt={`Image ${index}`}
        className="w-full h-3/4 object-cover rounded-md"
      />

      {/* Caption */}
      <p className="text-gray-700 text-center mt-2">{image.caption || 'No caption available'}</p>

      {/* Dropdown Icon */}
      <div className="absolute top-2 right-1">
        <button
          onClick={() => toggleDropdown(index)}
          className="focus:outline-none text-gray-600"
        >
          <FontAwesomeIcon icon={faEllipsisV} />
        </button>

        {/* Dropdown Menu with Animation */}
        <div
          className={`absolute right-0 mt-2 w-24 bg-white border border-gray-300 rounded-md shadow-lg z-10 transition-all duration-300 ease-in-out transform origin-top ${
            dropdownOpen === index ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
          }`}
        >
          <ul className="py-1">
            <li
              onClick={() => handleEdit(index, objId)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              Edit
            </li>
            <li
              onClick={() => handleDelete(objId)}
              className="px-4 py-2 text-red-600 hover:bg-red-100 cursor-pointer"
            >
              Delete
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Storage;
