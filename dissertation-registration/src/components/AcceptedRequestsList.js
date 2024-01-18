import React from 'react';

const AcceptedRequestsList = ({ requests, onDownload, onUpload }) => {
  console.log("Requests in AcceptedRequestsList:", requests); // Add this line
  const handleUploadTeacherFile = (studentId, event) => {
    onUpload(studentId, event);
  };

  return (
    <div>
      <h3>Accepted Requests</h3>
      {requests && requests.length === 0 ? (
        <p>No accepted requests available.</p>
      ) : (
        <ul>
          {requests.map((request) => (
            <li key={request.request_id}>
              {request.student_name}
              {request.file_path ? (
                <>
                  <p>File uploaded by the student: <a href={`http://localhost:3001/${request.file_path}`} target="_blank" rel="noopener noreferrer">Download File</a></p>
                  <input
                    type="file"
                    onChange={(e) => handleUploadTeacherFile(request.student_id, e)}
                    style={{ width: '50%' }}
                  />
                </>
              ) : (
                <p>No file uploaded by the student.</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AcceptedRequestsList;
