import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import Navbar from './Navbar'; 
import './css/Home.css';

const Home = () => {
    const navigate = useNavigate();
    let socket;

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/session-check'); 
                if (response.status !== 200) {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Session check failed:', error);
                navigate('/login');
            }
        };

        checkSession();

        socket = io('http://localhost:5000'); 

        socket.on('message', (msg) => {
            console.log('New message:', msg);
        });

        return () => {
            socket.disconnect();
        };
    }, [navigate]);


    return (
        <div className="dashboard">
            <div className="grid-container">
                <div className="navbar-container">
                    <Navbar /> {/* Navbar grid item */}
                </div>
                <div className="left-sidebar"> {/* New grid item for the left sidebar */}
                    <h2>Sidebar Content</h2>
                    <ul>
                        <li>Option 1</li>
                        <li>Option 2</li>
                        <li>Option 3</li>
                    </ul>
                </div>
                <div className="additional-item-1"> {/* First additional item */}
                    <h1>Welcome to Your Dashboard</h1>
                </div>
                <div className="additional-item-2"> {/* Second additional item */}
                    <h1>More Dashboard Info</h1>
                </div>
                <div className="main-content"> {/* Main content area */}
                    <h1>Main Content</h1>
                </div>
                <div className='right-sidebar'> {/* Right sidebar */}
                    <h2>Sidebar Content</h2>
                    <ul>
                        <li>Option 1</li>
                        <li>Option 2</li>
                        <li>Option 3</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Home;
