import {createContext, useContext, useMemo, useRef, useState} from 'react';
import type {NavigationContainerRef} from '@react-navigation/native';

type DrawerContextType = {
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  navigationRef: React.RefObject<NavigationContainerRef<any> | null>;
};

const DrawerContext = createContext<DrawerContextType | null>(null);

export function DrawerProvider({children}: {children: React.ReactNode}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigationRef = useRef<NavigationContainerRef<any>>(null);

  const value = useMemo(
    () => ({
      isDrawerOpen,
      openDrawer: () => setIsDrawerOpen(true),
      closeDrawer: () => setIsDrawerOpen(false),
      toggleDrawer: () => setIsDrawerOpen(prev => !prev),
      navigationRef,
    }),
    [isDrawerOpen],
  );

  return (
    <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>
  );
}

export function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) {
    throw new Error('useDrawer must be used within DrawerProvider');
  }
  return ctx;
}
