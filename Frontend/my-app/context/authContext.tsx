'use client';

import React, {
    createContext,
    useEffect,
    useState
} from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    token: string | null;
    refreshToken: string | null;
    login: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

export const AuthProvider = ({ children }: AuthProviderProps) => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [token, setToken] = useState<string | null>(null);

    const [refreshToken, setRefreshToken] = useState<string | null>(null);


    const isAuth = () => {

        const savedToken = localStorage.getItem('token');
        const savedRefreshToken = localStorage.getItem('refreshToken');

        setToken(savedToken);
        setRefreshToken(savedRefreshToken);
        if (!savedToken) {
            setIsAuthenticated(false);
        } else {
            setIsAuthenticated(true);
        }
    };


    const login = (
        accessToken: string,
        refreshToken: string
    ) => {

        if (!accessToken || !refreshToken) {
            return;
        }

        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        setToken(accessToken);
        setRefreshToken(refreshToken);
        setIsAuthenticated(true);
    };


    const logout = () => {

        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');

        setToken(null);
        setRefreshToken(null);
        setIsAuthenticated(false);
    };


    useEffect(() => {
        isAuth();
    }, []);


    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                token,
                refreshToken,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};