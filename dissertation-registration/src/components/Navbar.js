import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Redirect to the login page
        navigate('/');
    };

    return (
        <div className="navbar">
            <div className="navbar-left">
                {/* Left side elements */}
            </div>
            <h1>Dissertation Registration System</h1>
            <div className="navbar-right">
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}

export default Navbar;