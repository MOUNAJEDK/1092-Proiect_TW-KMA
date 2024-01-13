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
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.status === 200) {
        if (data.userType === 'Student') {
          navigate('/student-dashboard');
        } else if (data.userType === 'Teacher') {
          navigate('/teacher-dashboard');
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
          placeholder="Parola"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Intra in cont</button>
      </form>
    </div>
  );
};

export default Login;
