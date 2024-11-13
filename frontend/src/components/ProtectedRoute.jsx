import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkSession = async () => {
            try {
                await axios.get('http://localhost:5000/api/session-check');
                //request token jwt 
                //backend verfiy token valid 
                //res status 200
                //200 access home page 
                //else 302
                //login 
                setIsAuthenticated(true);
                run(); // User is authenticated
            } catch (error) {
                console.log(error);
                setIsAuthenticated(false); 
                run(); // User is not authenticated
            }
        };
        checkSession();
    }, []);


    function run(){
        console.log("running secong time");
    }

    if (isAuthenticated === null) {
        // Optional: Render a loading spinner or placeholder
        return children;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
