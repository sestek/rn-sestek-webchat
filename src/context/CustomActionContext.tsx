import React, { createContext, useState, useContext, useMemo } from 'react';

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
  const value = useMemo(
    () => ({ globalCustomAction, setGlobalCustomAction }),
    [globalCustomAction]
  );
  return (
    <CustomActionContext.Provider value={value}>
      {children}
    </CustomActionContext.Provider>
  );
};

export const useCustomAction = () => useContext(CustomActionContext);
