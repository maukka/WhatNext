// LoginContext.tsx  
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LoginContextType {
    username: string | null;
    login: (username: string) => void;
    logout: () => void;
}

export const LoginContext = createContext<LoginContextType | undefined>(undefined);

export const LoginProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [username, setUsername] = useState<string | "">(() => {
        // Retrieve the username from sessionStorage on initial start  
        return sessionStorage.getItem('username') || "";
    });

    const login = (username: string) => {
        setUsername(username);
        sessionStorage.setItem('username', username);
    };

    const logout = () => {
        setUsername("");
        sessionStorage.removeItem('username');
    };

    useEffect(() => {
        sessionStorage.setItem('username', username); // Store the data in sessionStorage  
    }, [username]); // Update when data changes 

    return (
        <LoginContext.Provider value={{ username, login, logout }}>
            {children}
        </LoginContext.Provider>
    );
};

export const useLogin = (): LoginContextType => {
    const context = useContext(LoginContext);
    if (!context) {
        throw new Error('useLogin must be used within a LoginProvider');
    }
    return context;
};