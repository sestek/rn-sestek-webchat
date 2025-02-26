import React, { createContext, useState, useContext } from 'react';

interface CustomActionType {
  globalCustomAction: any;
  setGlobalCustomAction: React.Dispatch<React.SetStateAction<any>>;
}

const CustomActionContext = createContext<CustomActionType>({
  globalCustomAction: null,
  setGlobalCustomAction: () => {},
});

export const CustomActionProvider: React.FC = ({ children }) => {
  const [globalCustomAction, setGlobalCustomAction] = useState<any>();
  return (
    <CustomActionContext.Provider value={{ globalCustomAction, setGlobalCustomAction }}>
      {children}
    </CustomActionContext.Provider>
  );
};

export const useCustomAction = () => useContext(CustomActionContext);
