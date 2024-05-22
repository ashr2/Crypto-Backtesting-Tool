import React from 'react';
import InteractiveDataTable from './components/InteractiveDataTable';

const App = () => {
  return (
    <div>
      <h1>Crypto Prices</h1>
      <InteractiveDataTable ticker="BTCUSDT"/>
    </div>
  );
};

export default App;