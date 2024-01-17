import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/Dashboard.css';
import PendingRequestsList from './PendingRequestsList';
import AcceptedRequestsList from './AcceptedRequestsList';

const TeacherDashboard = () => {
  const location = useLocation();
  const teacherId = location.state?.teacherId;

  const containerRef = useRef(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);

  const handleRequestAccepted = (acceptedRequest) => {
    setAcceptedRequests(prevAccepted => [...prevAccepted, acceptedRequest]);
    setPendingRequests(prevPending =>
      prevPending.filter(req => req.request_id !== acceptedRequest.request_id)
    );
  };

  useEffect(() => {
    console.log("Teacher ID:", teacherId);
    containerRef.current.getBoundingClientRect();

    const fetchPendingRequests = async () => {
      console.log('Fetching pending requests for teacher:', teacherId);
      try {
        const response = await fetch(`http://localhost:3001/pending-requests/${teacherId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setPendingRequests(data);
      } catch (error) {
        console.error('Error fetching pending requests:', error);
      }
    };

    const fetchAcceptedRequests = async () => {
      console.log('Fetching accepted requests for teacher:', teacherId);
      try {
        const response = await fetch(`http://localhost:3001/accepted-requests/${teacherId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setAcceptedRequests(data);
      } catch (error) {
        console.error('Error fetching accepted requests:', error);
      }
    };

    fetchPendingRequests();
    fetchAcceptedRequests();

    const handleAnimationEnd = () => {
      containerRef.current.style.overflow = 'auto';
    };

    const containerElement = containerRef.current;
    containerElement.addEventListener('animationend', handleAnimationEnd);

    return () => {
      containerElement.removeEventListener('animationend', handleAnimationEnd);
    };
  }, [teacherId]);

  return (
    <div className="dashboard-container" ref={containerRef}>
      <div className="dashboard-content">
        <h2>Dashboard Profesor</h2>
        <PendingRequestsList
          teacherId={teacherId}
          requests={pendingRequests}
          setPendingRequests={setPendingRequests}
          onAccept={handleRequestAccepted}
        />
        <AcceptedRequestsList requests={acceptedRequests} />
      </div>
    </div>
  );
};

export default TeacherDashboard;
