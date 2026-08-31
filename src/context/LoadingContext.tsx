import React, { createContext, useState, useContext, useMemo } from 'react';

interface LoadingContextType {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoadingContext = createContext<LoadingContextType>({
  loading: false,
  setLoading: () => {},
});

export const LoadingProvider: React.FC = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const value = useMemo(() => ({ loading, setLoading }), [loading]);
  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
