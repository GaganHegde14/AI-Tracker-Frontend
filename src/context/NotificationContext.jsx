import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification from '../Components/Notification/Notification';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const showNotification = useCallback((message, type = 'info', customColor = null) => {
        setNotification({ message, type, customColor });
    }, []);

    const hideNotification = useCallback(() => {
        setNotification(null);
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    customColor={notification.customColor}
                    onClose={hideNotification}
                />
            )}
        </NotificationContext.Provider>
    );
};
