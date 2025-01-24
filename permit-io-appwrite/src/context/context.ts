import { createContext, useContext } from "react";

interface ContextValue {
    user: object | null;
    loginUser: (email: string, password: string) => void;
    logoutUser: () => void;
    registerUser: (email: string, password: string, name: string) => void;
    checkUserStatus: () => void;
    loading: boolean;
}

export const AuthContext = createContext<ContextValue | null>(null);


export const useAuth = () => useContext(AuthContext);