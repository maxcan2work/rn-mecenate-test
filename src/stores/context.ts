import { createContext, useContext } from 'react';
import type { RootStore } from './RootStore';

export const StoreContext = createContext<RootStore | null>(null);

export const useStores = (): RootStore => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('useStores must be used within StoreContext.Provider');
  }
  return store;
};
