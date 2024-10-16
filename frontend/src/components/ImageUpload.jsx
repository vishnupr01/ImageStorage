import React, { useState } from "react";
import Image from '../assets/imageUpload.webp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import convertBlobUrlToBase64 from "../helperFunctions/convertFile";
import { imageSave } from "../api/user";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const ImageUploadComponent = ({ setCurrent }) => {
  const [images, setImages] = useState([]); // Store objects {image, title}
  const [buttonLoading, setButtonLoading] = useState(false);
  const [error, setError] = useState({ imageError: '', titleError: '' });
  const navigate = useNavigate();

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files); // Handle multiple files
    const uploadedImages = [];

    for (const file of files) {
      const blob = URL.createObjectURL(file);
      const base64Image = await convertBlobUrlToBase64(blob);
      uploadedImages.push({ image: base64Image, title: '' }); // Initialize with empty title
    }

    // Append new images to the existing ones
    setImages((prevImages) => [...prevImages, ...uploadedImages]);
    setError({ imageError: '', titleError: '' });
  };

  const handleTitleChange = (index, title) => {
    const updatedImages = images.map((img, i) =>
      i === index ? { ...img, title } : img
    );
    setImages(updatedImages);
    setError((prev) => ({ ...prev, titleError: '' }));
  };

  const onSubmit = async () => {
    try {
      setButtonLoading(true);
      if (images.some((img) => img.title === '')) {
        setError((prev) => ({ ...prev, titleError: "All images must have a title" }));
        return;
      }

      if (images.length <= 0) {
        setError((prev) => ({ ...prev, imageError: "Please upload at least one image" }));
        return;
      }

      const titles = images.map(img => img.title);
      const base64Images = images.map(img => img.image);

      const response = await imageSave(base64Images, titles);
      if (response.data.status === 'success') {
        toast.success("Images uploaded");
        setCurrent('storage');
      }
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setButtonLoading(false);
    }
  };
console.log("loadd,:",images);

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${Image})`, // Use imported image here
      }}
    >
      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="text-center text-black">
          <h1 className="text-4xl font-bold">File Upload</h1>
          <p className="mt-4">Upload your images and provide titles for them</p>
        </div>

        <div className="mt-8 w-full max-w-md bg-white shadow-lg rounded-lg p-6">
          <label className="block text-lg font-medium text-gray-700">Upload Images:</label>
          <input
            type="file"
            accept="image/*"
            multiple // Allow multiple file selection
            onChange={handleImageUpload}
            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {error.imageError && <p className="text-red-600">{error.imageError}</p>}

          {/* Display uploaded images with title inputs */}
          {images.length > 0 && (
            <div className="mt-6">
              <h3 className="text-md font-semibold text-gray-800">Preview & Titles:</h3>
              {images.map((img, index) => (
                <div key={index} className="mt-4 border p-4">
                  <img
                    src={img.image} // Directly use the base64 image here
                    alt={`Uploaded Preview ${index + 1}`}
                    className="w-full h-64 object-contain mb-2"
                  />
                  <input
                    type="text"
                    value={img.title}
                    onChange={(e) => handleTitleChange(index, e.target.value)}
                    placeholder="Enter title"
                    className="block w-full p-2 border border-gray-300 rounded-md mt-2"
                  />
                </div>
              ))}
              {error.titleError && <p className="text-red-600 mt-2">{error.titleError}</p>}
            </div>
          )}
        </div>

        <button
          onClick={onSubmit}
          disabled={buttonLoading}
          className={`flex items-center px-4 py-2 mt-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 ${
            buttonLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          {buttonLoading ? "Uploading..." : (
            <>
              <span className="mr-2">Post</span>
              <FontAwesomeIcon icon={faPaperPlane} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ImageUploadComponent;
