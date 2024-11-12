import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        username: 'John Doe',
        profilePhoto: './pictures/pic.png',
        bannerPhoto: 'background-photo-url',
        bio: 'A passionate developer and tech enthusiast!',
        connections: 150,
        posts: 20
    });

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
