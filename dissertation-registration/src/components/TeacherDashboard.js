// TeacherDashboard.js
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import PendingRequestsList from './PendingRequestsList';
import AcceptedRequestsList from './AcceptedRequestsList';

const TeacherDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { teacherId } = location.state ?? {};

  const containerRef = useRef(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);

  const handleRequestAccepted = (acceptedRequest) => {
    const updatedPendingRequests = pendingRequests.filter(
      (req) => req.request_id !== acceptedRequest.request_id
    );
    setAcceptedRequests((prevAccepted) => [...prevAccepted, acceptedRequest]);
    setPendingRequests(updatedPendingRequests);
  };

  const handleDownloadFile = async (studentId) => {
    try {
      const response = await fetch(`http://localhost:3001/get-file/${studentId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Use response.blob() to get the file data
      const blob = await response.blob();
  
      // Create a download link and trigger a click event to start the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `file_${studentId}.pdf`; // Set a default filename or fetch it from the server
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleUploadTeacherFile = async (studentId, event) => {
    // Implement the logic to upload the teacher file
    const file = event.target.files[0];
    if (!file) {
      console.error('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('studentId', studentId);

    try {
      const response = await fetch('http://localhost:3001/upload-teacher-file', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log('Teacher file uploaded successfully');
    } catch (error) {
      console.error('Error uploading teacher file:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchPending = fetch(`http://localhost:3001/pending-requests/${teacherId}`);
        const fetchAccepted = fetch(`http://localhost:3001/accepted-requests/${teacherId}`);

        const [pendingResponse, acceptedResponse] = await Promise.all([fetchPending, fetchAccepted]);

        if (!pendingResponse.ok) {
          throw new Error(`HTTP error! Status: ${pendingResponse.status}`);
        }

        if (!acceptedResponse.ok) {
          throw new Error(`HTTP error! Status: ${acceptedResponse.status}`);
        }

        const pendingData = await pendingResponse.json();
        const acceptedData = await acceptedResponse.json();

        setPendingRequests(pendingData);
        setAcceptedRequests(acceptedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (!teacherId) {
      // Redirect if there is no teacherId
      navigate('/login'); // or any other route
    } else {
      fetchData();
    }

    const handleAnimationEnd = () => {
      containerRef.current.style.overflow = 'auto';
    };

    const containerElement = containerRef.current;
    containerElement.addEventListener('animationend', handleAnimationEnd);

    return () => {
      containerElement.removeEventListener('animationend', handleAnimationEnd);
    };
  }, [teacherId, navigate]);

  return (
    <div className="dashboard-container" ref={containerRef}>
      <div className="dashboard-content">
        <h2>Teacher Dashboard</h2>
        <PendingRequestsList
          teacherId={teacherId}
          requests={pendingRequests}
          setPendingRequests={setPendingRequests}
          onAccept={handleRequestAccepted}
        />
        <AcceptedRequestsList
          requests={acceptedRequests}
          onDownload={handleDownloadFile}
          onUpload={handleUploadTeacherFile}
        />
      </div>
    </div>
  );
};

export default TeacherDashboard;
