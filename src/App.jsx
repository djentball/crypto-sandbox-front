import React from 'react';
import CryptoChart from './components/CryptoChart/CryptoChart';
import BasePrice from './components/BasePrice/BasePrice';
import { ToastContainer } from 'react-toastify';
import { SymbolProvider } from './context/SymbolContext';

function App() {
  return (
    <SymbolProvider>
      <div className='App'>
        <CryptoChart />
        <div className='base-price'>
          <BasePrice />
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </div>
    </SymbolProvider>
  );
}

export default App;
