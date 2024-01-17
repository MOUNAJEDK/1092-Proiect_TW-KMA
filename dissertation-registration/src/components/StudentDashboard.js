import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AvailableTeachersList from './AvailableTeachersList';
import FileUploadDownloadPrompt from './FileUploadDownloadPrompt';
import '../styles/Dashboard.css';

const StudentDashboard = () => {
  const location = useLocation();
  const studentId = location.state?.studentId;

  const containerRef = useRef(null);
  const [isAssigned, setIsAssigned] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false); // State to track if a file has been uploaded

  const handleFileUpload = async (file) => {
    // Handle the file upload logic here
    console.log('File uploaded:', file);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('studentId', studentId);

      const response = await fetch('http://localhost:3001/upload-file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      // Set the flag in local storage to remember the file upload
      localStorage.setItem(`fileUploaded_${studentId}`, 'true');

      // Update the state to reflect the file upload
      setFileUploaded(true);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  useEffect(() => {
    containerRef.current.getBoundingClientRect();

    console.log('Student ID in Dashboard:', studentId); // Log studentId

    const checkIfAssigned = async () => {
      try {
        const response = await fetch(`http://localhost:3001/student-assigned/${studentId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setIsAssigned(data.isAssigned);

        console.log('Is Assigned:', data.isAssigned); // Log isAssigned value
      } catch (error) {
        console.error('Error:', error);
      }
    };

    checkIfAssigned();

    const handleAnimationEnd = () => {
      containerRef.current.style.overflow = 'auto';
    };

    const containerElement = containerRef.current;
    containerElement.addEventListener('animationend', handleAnimationEnd);

    // Check local storage to see if a file has been uploaded for this student
    const isFileUploaded = localStorage.getItem(`fileUploaded_${studentId}`);
    if (isFileUploaded === 'true') {
      setFileUploaded(true);
    }

    return () => {
      containerElement.removeEventListener('animationend', handleAnimationEnd);
    };
  }, [studentId]);

  return (
    <div className="dashboard-container" ref={containerRef}>
      <div className="dashboard-content">
        <h2>Dashboard Student</h2>
        {isAssigned ? (
          // Display the "File uploaded successfully. Awaiting further instructions..." message
          fileUploaded ? (
            <div>
              <p>File uploaded successfully. Awaiting further instructions...</p>
            </div>
          ) : (
            // Display the file upload/download prompt if a file has not been uploaded
            <FileUploadDownloadPrompt onFileUpload={handleFileUpload} />
          )
        ) : (
          <AvailableTeachersList studentId={studentId} />
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
