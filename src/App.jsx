import React from 'react';
import Board from './components/Board';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative selection:bg-green-500 selection:text-white">
      {/* Ambient Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-green-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full h-full">
        <Board />
      </div>
    </div>
  );
}

export default App;
