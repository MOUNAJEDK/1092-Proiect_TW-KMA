import React, { useEffect, useRef } from 'react';
import '../styles/Dashboard.css';

const TeacherDashboard = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Trigger a reflow which ensures the animation will run
    containerRef.current.getBoundingClientRect();
    
    const handleAnimationEnd = () => {
      // Actions after animation ends, if necessary
      containerRef.current.style.overflow = 'auto'; // Enable scrolling if needed after animation
    };

    const containerElement = containerRef.current;
    containerElement.addEventListener('animationend', handleAnimationEnd);

    // Remove event listener on cleanup
    return () => {
      containerElement.removeEventListener('animationend', handleAnimationEnd);
    };
  }, []);

  return (
    <div className="dashboard-container" ref={containerRef}>
      <div className="dashboard-content">
        <h2>Dashboard Profesor</h2>
        {/* Add more content and structure as needed */}
      </div>
    </div>
  );
};

export default TeacherDashboard;
