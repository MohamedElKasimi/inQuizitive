import React, { ReactNode } from 'react';
import { StyledEngineProvider } from '@mui/material/styles';

interface AppWrapperProps {
  children: ReactNode;
}

const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  return <StyledEngineProvider injectFirst>{children}</StyledEngineProvider>;
};

export default AppWrapper;
