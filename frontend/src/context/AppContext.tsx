import React, { createContext, useContext, useState } from 'react';

// This tells the memory what it is allowed to remember
interface AppState {
    isLoading: boolean;
    error: string | null;
    setLoading: (state: boolean) => void;
    setError: (msg: string | null) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <AppContext.Provider value={{ isLoading, error, setLoading, setError }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useAppContext must be used within AppProvider");
    return context;
};