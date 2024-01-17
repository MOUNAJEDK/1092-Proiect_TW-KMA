import React, { useState, useEffect } from 'react';
import "../styles/PendingRequestsList.css";

const PendingRequestsList = ({ requests, onAccept }) => {
  useEffect(() => {
    // Update the local state based on the prop when it changes
    // This ensures that the component reflects the latest data
    setPendingRequests(requests);
  }, [requests]);

  const [pendingRequests, setPendingRequests] = useState([]);

  const handleAccept = (requestId) => {
    fetch('http://localhost:3001/accept-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId })
    })
      .then(() => {
        const acceptedRequest = requests.find(req => req.request_id === requestId);
        if (acceptedRequest) {
          onAccept(acceptedRequest); // Call the function passed from the parent
        }
      })
      .catch(error => console.error('Error accepting request:', error));
  };

  const handleDeny = (requestId) => {
    fetch('http://localhost:3001/deny-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId })
    })
      .then(response => response.json())
      .then(() => {
        // Remove the request from the pending list
        // Use the updater function to ensure state immutability
        setPendingRequests(prev => prev.filter(req => req.request_id !== requestId));
      })
      .catch(error => console.error('Error denying request:', error));
  };

  return (
    <div className='PendingRequestsList'>
      <h3>Pending Requests</h3>
      <ul>
        {pendingRequests.map(request => (
          <li key={request.request_id}>
            {request.student_name}
            <button onClick={() => handleAccept(request.request_id)}>Accept</button>
            <button onClick={() => handleDeny(request.request_id)}>Deny</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingRequestsList;
