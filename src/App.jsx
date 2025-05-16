import React from 'react';
import CryptoChart from './components/CryptoChart/CryptoChart';
import BasePrice from './components/BasePrice/BasePrice';

function App() {
  return (
    <div className='App'>
      <CryptoChart />
      <div className='base-price'>
        <BasePrice />
      </div>
    </div>
  );
}

export default App;
