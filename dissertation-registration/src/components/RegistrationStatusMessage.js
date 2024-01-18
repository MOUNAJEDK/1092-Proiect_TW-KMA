import React, { useState, useEffect } from 'react';

const RegistrationStatusMessage = ({ studentId }) => {
    const [registrationFinished, setRegistrationFinished] = useState(false);
  
    useEffect(() => {
      fetch(`http://localhost:3001/check-registration-status/${studentId}`)
        .then(response => response.json())
        .then(data => {
          setRegistrationFinished(data.registrationFinished);
        })
        .catch(error => console.error('Error:', error));
    }, [studentId]);
  
    if (!registrationFinished) {
      return null;
    }
  
    return (
      <p>Registration process finished</p>
    );
  };
  
  export default RegistrationStatusMessage;
  