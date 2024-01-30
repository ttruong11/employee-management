import React from 'react';

const ImageUpload = ({ selectedFile, setSelectedFile, allowedTypes }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && allowedTypes.includes(file.type)) {
      setSelectedFile(file);
    } else {
      alert('Please select an image file (jpeg, png, gif).');
      event.target.value = '';
    }
  };

  return (
    <div className="image-upload-container">
      <input type="file" onChange={handleFileChange} accept={allowedTypes.join(', ')} />
    </div>
  );
};

export default ImageUpload;
