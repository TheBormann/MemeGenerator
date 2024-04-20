import React, { createContext, useContext } from 'react';
import useMeme from '../components/single-view/useMeme';

const MemeContext = createContext();  // Set a default value of null or appropriate default object

export const MemeProvider = ({ children }) => {
  const meme = useMeme();
  const providerValue = React.useMemo(() => meme, [meme]); 
  return <MemeContext.Provider value={providerValue}>{children}</MemeContext.Provider>;
};

export const useMemeContext = () => {
  const context = useContext(MemeContext);
  if (context === undefined) {  // You can check for null or undefined based on your default value
    throw new Error('useMemeContext must be used within a MemeProvider');
  }
  return context;
};
