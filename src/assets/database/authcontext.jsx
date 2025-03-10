import { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { appfirebase } from "./firebase";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const auth = getAuth(appfirebase);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setIsLoggedIn(!!user);
        });
        return () => unsubscribe();
    }, []);
    
}

const logout = async () => {
    const auth = getAuth(appfirebase);
    await signOut(auth);
    setUser(null);
    setIsLoggedIn(false);
};

return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
        {children}
    </AuthContext.Provider>
);

