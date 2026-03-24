import React from 'react';
import Board from './components/Board';
import './index.css';

function App() {
  return (
    <div 
      className="min-h-screen text-white overflow-hidden relative selection:bg-cyan-500 selection:text-white bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/fondo1.jpg')" }}
    >
      {/* Dark overlay to make UI pop */}
      <div className="absolute inset-0 bg-slate-950/80 md:bg-slate-950/70 pointer-events-none backdrop-blur-[2px]"></div>

      {/* Ambient Background Effects - Changed to cyan/green neon vibes */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-green-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 w-full h-full">
        <Board />
      </div>
    </div>
  );
}

export default App;
