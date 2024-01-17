import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AvailableTeachersList from './AvailableTeachersList';
import '../styles/Dashboard.css';

const StudentDashboard = () => {
  const location = useLocation();
  const studentId = location.state?.studentId;

  const containerRef = useRef(null);
  const [isAssigned, setIsAssigned] = useState(false);

  useEffect(() => {
    containerRef.current.getBoundingClientRect();

    console.log('Student ID in Dashboard:', studentId);

    const checkIfAssigned = async () => {
      try {
        const response = await fetch(`http://localhost:3001/student-assigned/${studentId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setIsAssigned(data.isAssigned);
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

    return () => {
      containerElement.removeEventListener('animationend', handleAnimationEnd);
    };
  }, [studentId]);

  return (
    <div className="dashboard-container" ref={containerRef}>
      <div className="dashboard-content">
        <h2>Dashboard Student</h2>
        {!isAssigned && <AvailableTeachersList studentId={studentId} />}
      </div>
    </div>
  );
};

export default StudentDashboard;