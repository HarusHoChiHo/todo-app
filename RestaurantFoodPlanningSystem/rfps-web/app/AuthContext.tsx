'use client'
import React, {createContext, useState, useEffect, ReactNode} from "react";
import HttpServices from "../lib/HttpServices";

interface AuthContextType {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({children}: AuthProviderProps) {
    const [token, setToken] = useState<string | null>(null);
    const httpServices = new HttpServices();
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        (async () => {
            if (token){
                let server_res = await (await httpServices.callAPI("/api/TokenValidation", {token: storedToken}, "POST")).json();
                if (server_res.value === "Authorized") {
                    setToken(storedToken);
                } else {
                    localStorage.removeItem("token");
                }
            }
        })();
        
    }, []);

    const login = (newToken: string) => {
        setToken(newToken);
        localStorage.setItem("token", newToken);
    }

    const logout = () => {
        setToken(null);
        localStorage.removeItem("token");
    }

    const value = {
        token,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = React.useContext(AuthContext);
    
    if (context === undefined){
        throw new Error('useAuth must be used within an AuthProvider');
    }
    
    return context;
}

