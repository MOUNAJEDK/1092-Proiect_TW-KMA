import React from 'react';

const AcceptedRequestsList = ({ requests }) => {
  // Directly log the props to verify they are passed correctly
  console.log('AcceptedRequestsList props:', requests);

  return (
    <div>
      <h3>Accepted Requests</h3>
      {requests && requests.length === 0 ? (
        <p>No accepted requests available.</p>
      ) : (
        <ul>
          {requests && requests.map(request => (
            <li key={request.request_id}>
              {request.student_name}
              {/* More information or actions can be added here */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AcceptedRequestsList;
