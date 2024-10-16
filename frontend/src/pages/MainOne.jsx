import React from 'react'
import MainPage from '../components/Home';
import ImageUploadComponent from '../components/ImageUpload';
import { useState } from 'react';
import Storage from '../components/Storage';

const MainOne = () => {
    const [currentPage, setCurrentPage] = useState("upload"); // Default page set to "upload"
    const handleClick=(data)=>{
      setCurrentPage(data)
    }
    return (
      <div>
        <MainPage setCurrentPage={setCurrentPage} />
        {currentPage === "upload" ? (
          <ImageUploadComponent setCurrent={handleClick} />
        ) : (
          <Storage /> // This component will be displayed when "Go To Storage" is clicked
        )}
      </div>
    );
  
}

export default MainOne