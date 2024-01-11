// Login.js

import React, { useState } from 'react';
import '../styles/Login.css'

const Login = () => {
  // State to manage the input values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Here, you can add logic to validate the email and password
    // For simplicity, let's just log them to the console
    console.log('Email:', email);
    console.log('Password:', password);

    // You may want to add further authentication logic here
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
