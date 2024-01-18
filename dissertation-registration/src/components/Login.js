import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css'

const Login = () => {
  // State to manage the input values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.status === 200) {
        // Extract the user ID from the response
        const userId = data.userId;
        if (data.userType === 'Student') {
          navigate('/student-dashboard', { state: { studentId: userId } });
        } else if (data.userType === 'Teacher') {
          navigate('/teacher-dashboard', { state: { teacherId: userId } });
        }
      } else {
        // Handle login failure
        console.error('Login failed:', data.message);
        // Show error message to the user
      }
    } catch (error) {
      console.error('Network error:', error);
      // Handle network error
    }
  };

  return (
    <div className='login-container'>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Enter Account</button>
      </form>
    </div>
  );
};

export default Login;
