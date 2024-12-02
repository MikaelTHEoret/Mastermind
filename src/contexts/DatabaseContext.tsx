import React, { createContext, useContext, useState } from 'react';
import { DatabaseManager } from '../core/database/DatabaseManager';
import type { DatabaseType, DatabaseConfig } from '../types/database';

const DatabaseContext = createContext<{
  connect: (type: DatabaseType, config: DatabaseConfig) => Promise<boolean>;
  disconnect: (type: DatabaseType) => Promise<void>;
} | null>(null);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [dbManager] = useState(() => new DatabaseManager());

  const connect = async (type: DatabaseType, config: DatabaseConfig) => {
    return dbManager.connect(type, config);
  };

  const disconnect = async (type: DatabaseType) => {
    await dbManager.disconnect(type);
  };

  return (
    <DatabaseContext.Provider value={{ connect, disconnect }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}