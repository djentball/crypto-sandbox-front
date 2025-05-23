// src/context/SymbolContext.jsx
import { createContext, useContext, useState } from 'react';

// Створюємо контекст
const SymbolContext = createContext();

// Провайдер — обгортає частину застосунку і передає selectedSymbol всередину
export const SymbolProvider = ({ children }) => {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');

  return (
    <SymbolContext.Provider value={{ selectedSymbol, setSelectedSymbol }}>
      {children}
    </SymbolContext.Provider>
  );
};

// Кастомний хук для зручності
export const useSymbol = () => useContext(SymbolContext);
