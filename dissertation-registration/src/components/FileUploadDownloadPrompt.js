import React, { useState } from 'react';

const FileUploadDownloadPrompt = ({ onFileUpload }) => {
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    // You can add logic to validate the file if needed

    // Call the parent component's function to handle the upload
    onFileUpload(file);
    setFileUploaded(true);
  };

  const fileUrl = '/static/Formular.pdf'; // The URL to your 'Formular.pdf' file

  const handleDownloadClick = async () => {
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();

      // Create a Blob URL for the blob data
      const blobUrl = window.URL.createObjectURL(blob);

      // Create an anchor element for downloading
      const link = document.createElement('a');
      link.href = blobUrl;
      link.target = '_blank'; // Open in a new tab
      link.download = 'Formular.pdf'; // Set the downloaded file name
      link.click();
      
      // Clean up the Blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  return (
    <div>
      {fileUploaded ? (
        <div>
          <p>File uploaded successfully. Awaiting further instructions...</p>
        </div>
      ) : (
        <div>
          <button onClick={handleDownloadClick} title="Formular" style={{ maxWidth: '250px' }}>
            Download the Request Form
          </button>
          <br />
          <input type="file" onChange={handleUpload} style={{ width: '250px' }} />
        </div>
      )}
    </div>
  );
};

export default FileUploadDownloadPrompt;
