import React from 'react';
import { useDroppable } from '@dnd-kit/core';

const Field = ({ children, orientation }) => {
    const { setNodeRef } = useDroppable({
        id: 'field',
    });

    const isVertical = orientation === 'vertical';

    return (
        <div
            ref={setNodeRef}
            className="w-full h-full relative mx-auto rounded-lg overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.3)] border-[3px] border-emerald-500/60 select-none bg-emerald-950/30 backdrop-blur-sm"
        >
            {/* Hologram/Glass Grid Pattern Overlay */}
            <div 
                className="absolute inset-0 opacity-20 pointer-events-none" 
                style={{ 
                    backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.4) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }} 
            />

            {/* Neon Tactical Field Lines using SVG for perfect scaling */}
            <svg 
                className={`absolute inset-0 w-full h-full pointer-events-none ${isVertical ? 'rotate-90 scale-[1.6]' : ''}`} 
                viewBox="0 0 100 65" 
                preserveAspectRatio="none"
            >
                <style>
                    {`
                        .line { stroke: rgba(16, 185, 129, 0.8); stroke-width: 0.5; fill: none; filter: drop-shadow(0 0 4px rgba(16, 185, 129, 0.8)); }
                        .area { stroke: rgba(16, 185, 129, 0.5); stroke-width: 0.3; fill: rgba(16, 185, 129, 0.05); }
                    `}
                </style>
                {/* Border */}
                <rect x="2" y="2" width="96" height="61" className="line" />
                {/* Center Line */}
                <line x1="50" y1="2" x2="50" y2="63" className="line" />
                {/* Center Circle */}
                <circle cx="50" cy="32.5" r="9.15" className="line" />
                {/* Center Dot */}
                <circle cx="50" cy="32.5" r="0.5" className="line" fill="rgba(16,185,129,0.8)" />

                {/* Left Penalty Area */}
                <rect x="2" y="13.84" width="16.5" height="37.32" className="area line" />
                {/* Left Goal Area */}
                <rect x="2" y="24.84" width="5.5" height="15.32" className="line" />
                {/* Left Penalty Arc (Approximated) */}
                <path d="M 18.5 25.5 A 9.15 9.15 0 0 1 18.5 39.5" className="line" />
                {/* Left Penalty Mark */}
                <circle cx="11" cy="32.5" r="0.5" className="line" fill="rgba(16,185,129,0.8)" />

                {/* Right Penalty Area */}
                <rect x="81.5" y="13.84" width="16.5" height="37.32" className="area line" />
                {/* Right Goal Area */}
                <rect x="92.5" y="24.84" width="5.5" height="15.32" className="line" />
                {/* Right Penalty Arc (Approximated) */}
                <path d="M 81.5 25.5 A 9.15 9.15 0 0 0 81.5 39.5" className="line" />
                {/* Right Penalty Mark */}
                <circle cx="89" cy="32.5" r="0.5" className="line" fill="rgba(16,185,129,0.8)" />

                {/* Goal posts (outside the field slightly) */}
                <rect x="0.5" y="28.84" width="1.5" height="7.32" stroke="rgba(255,255,255,0.7)" strokeWidth="0.5" fill="none" />
                <rect x="98" y="28.84" width="1.5" height="7.32" stroke="rgba(255,255,255,0.7)" strokeWidth="0.5" fill="none" />
            </svg>

            {/* Glowing Arrows / Directions inside the tactical field (Optional aesthetic layer based on the screenshot) */}
            <svg 
                className={`absolute inset-0 w-full h-full pointer-events-none opacity-40 ${isVertical ? 'rotate-90 scale-[1.6]' : ''}`} 
                viewBox="0 0 100 65" 
                preserveAspectRatio="none"
            >
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="rgba(6, 182, 212, 0.8)" />
                    </marker>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{stopColor:'rgba(6,182,212,0.1)', stopOpacity:1}} />
                        <stop offset="100%" style={{stopColor:'rgba(6,182,212,0.8)', stopOpacity:1}} />
                    </linearGradient>
                </defs>
                {/* Example glowing passing lanes as seen in the sci-fi ref image */}
                <path d="M 25 50 Q 50 20 75 15" fill="none" stroke="url(#grad1)" strokeWidth="2" markerEnd="url(#arrowhead)" filter="drop-shadow(0 0 6px cyan)" style={{ animation: 'dash 5s linear infinite' }} />
                <path d="M 30 15 Q 50 60 80 50" fill="none" stroke="url(#grad1)" strokeWidth="2" markerEnd="url(#arrowhead)" filter="drop-shadow(0 0 6px cyan)" strokeDasharray="4 2" />
            </svg>

            {/* Overlays to dim edges */}
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-emerald-950/40 pointer-events-none" />

            {/* Children (Players) - Z-Index 10 to sit above background */}
            <div className="absolute inset-0 z-10">
                {children}
            </div>
        </div>
    );
};

export default Field;
