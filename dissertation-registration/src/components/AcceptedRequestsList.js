import React, { useState, useEffect } from 'react';

const AcceptedRequestsList = ({ teacherId }) => {
  const [acceptedRequests, setAcceptedRequests] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3001/accepted-requests/${teacherId}`)
      .then(response => response.json())
      .then(data => setAcceptedRequests(data))
      .catch(error => console.error('Error fetching accepted requests:', error));
  }, [teacherId]);

  return (
    <div>
      <h3>Accepted Requests</h3>
      <ul>
        {acceptedRequests.map(request => (
          <li key={request.request_id}>
            {request.student_name}
            {/* More information or actions can be added here */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AcceptedRequestsList;
