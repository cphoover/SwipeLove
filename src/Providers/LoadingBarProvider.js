import React, { createContext, useContext, useState, useCallback } from 'react';

const LoadingBarContext = createContext();

export const LoadingBarProvider = ({ children }) => {
  const [loadingKeys, setLoadingKeys] = useState(new Set());
  global.loadingKeys = loadingKeys;
  const initializeLoadingBar = useCallback((key) => {
    setLoadingKeys((prevKeys) => new Set(prevKeys).add(key));
  }, []);

  const finishLoadingBar = useCallback((key) => {
    setLoadingKeys((prevKeys) => {
      const newKeys = new Set(prevKeys);
      newKeys.delete(key);
      return newKeys;
    });
  }, []);

  const loading = loadingKeys.size > 0;

  return (
    <LoadingBarContext.Provider value={{ loading, loadingKeys, initializeLoadingBar, finishLoadingBar }}>
      {children}
    </LoadingBarContext.Provider>
  );
};

export const useLoadingBar = () => {
  const context = useContext(LoadingBarContext);
  if (!context) {
    throw new Error('useLoadingBar must be used within a LoadingBarProvider');
  }
  return context;
}
