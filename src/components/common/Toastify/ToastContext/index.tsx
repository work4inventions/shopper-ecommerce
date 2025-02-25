import React, { createContext, useContext, useState } from 'react';
import Toastify from '..';


const ToastContext = createContext();

export const useToast = () => {
  return useContext(ToastContext);
};

export const ToastProvider = ({ children }) => {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState('');
  const [toastText, setToastText] = useState('');

  const ToastifyMessage = (message, type) => {
    setToastText(message);
    setToastType(type);
    setToastVisible(true);
  };

  const value = {
    ToastifyMessage,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toastify
        visible={toastVisible}
        type={toastType}
        textBody={toastText}
        buttonText="Dismiss"
        onDismiss={() => setToastVisible(false)}
      />
    </ToastContext.Provider>
  );
};
