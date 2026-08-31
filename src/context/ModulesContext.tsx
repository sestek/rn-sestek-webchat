import React, { createContext, useContext, useMemo } from 'react';
import type PropsModules from '../types/propsModules';

interface ModulesContextType {
  modules: PropsModules;
}

const ModulesContext = createContext<ModulesContextType | undefined>(undefined);

const ModulesProvider: React.FC<{ modules: PropsModules }> = ({ modules, children }) => {
  const value = useMemo(() => ({ modules }), [modules]);
  return (
    <ModulesContext.Provider value={value}>
      {children}
    </ModulesContext.Provider>
  );
};

const useModules = (): ModulesContextType => {
  const context = useContext(ModulesContext);
  if (!context) {
    throw new Error('useModules must be used within a ModulesProvider');
  }
  return context;
};

export { ModulesProvider, useModules };
