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
            {!isVertical && (
                <svg 
                    className="absolute inset-0 w-full h-full pointer-events-none" 
                    viewBox="0 0 100 65" 
                >
                    <style>
                        {`
                            .line { stroke: rgba(16, 185, 129, 0.9); stroke-width: 0.5; fill: none; }
                            .area { stroke: rgba(16, 185, 129, 0.6); stroke-width: 0.3; fill: rgba(16, 185, 129, 0.05); }
                        `}
                    </style>
                    {/* Border */}
                    <rect x="2" y="2" width="96" height="61" className="line" />
                    {/* Center Line */}
                    <line x1="50" y1="2" x2="50" y2="63" className="line" />
                    {/* Center Circle */}
                    <circle cx="50" cy="32.5" r="9.15" className="line" />
                    {/* Center Dot */}
                    <circle cx="50" cy="32.5" r="0.5" className="line" fill="rgba(16,185,129,1)" />

                    {/* Left Penalty Area */}
                    <rect x="2" y="13.84" width="16.5" height="37.32" className="area line" />
                    {/* Left Goal Area */}
                    <rect x="2" y="24.84" width="5.5" height="15.32" className="line" />
                    {/* Left Penalty Arc (Approximated) */}
                    <path d="M 18.5 25.5 A 9.15 9.15 0 0 1 18.5 39.5" className="line" />
                    {/* Left Penalty Mark */}
                    <circle cx="11" cy="32.5" r="0.5" className="line" fill="rgba(16,185,129,1)" />

                    {/* Right Penalty Area */}
                    <rect x="81.5" y="13.84" width="16.5" height="37.32" className="area line" />
                    {/* Right Goal Area */}
                    <rect x="92.5" y="24.84" width="5.5" height="15.32" className="line" />
                    {/* Right Penalty Arc (Approximated) */}
                    <path d="M 81.5 25.5 A 9.15 9.15 0 0 0 81.5 39.5" className="line" />
                    {/* Right Penalty Mark */}
                    <circle cx="89" cy="32.5" r="0.5" className="line" fill="rgba(16,185,129,1)" />

                    {/* Goal posts (outside the field slightly) */}
                    <rect x="0.5" y="28.84" width="1.5" height="7.32" stroke="rgba(255,255,255,0.7)" strokeWidth="0.5" fill="none" />
                    <rect x="98" y="28.84" width="1.5" height="7.32" stroke="rgba(255,255,255,0.7)" strokeWidth="0.5" fill="none" />
                </svg>
            )}
            
            {isVertical && (
                <svg 
                    className="absolute inset-0 w-full h-full pointer-events-none" 
                    viewBox="0 0 65 100" 
                >
                    <style>
                        {`
                            .line { stroke: rgba(16, 185, 129, 0.9); stroke-width: 0.5; fill: none; }
                            .area { stroke: rgba(16, 185, 129, 0.6); stroke-width: 0.3; fill: rgba(16, 185, 129, 0.05); }
                        `}
                    </style>
                    {/* Border */}
                    <rect x="2" y="2" width="61" height="96" className="line" />
                    {/* Center Line */}
                    <line x1="2" y1="50" x2="63" y2="50" className="line" />
                    {/* Center Circle */}
                    <circle cx="32.5" cy="50" r="9.15" className="line" />
                    {/* Center Dot */}
                    <circle cx="32.5" cy="50" r="0.5" className="line" fill="rgba(16,185,129,1)" />

                    {/* Top Penalty Area (was Left) */}
                    <rect x="13.84" y="2" width="37.32" height="16.5" className="area line" />
                    {/* Top Goal Area */}
                    <rect x="24.84" y="2" width="15.32" height="5.5" className="line" />
                    {/* Top Penalty Arc */}
                    <path d="M 25.5 18.5 A 9.15 9.15 0 0 0 39.5 18.5" className="line" />
                    {/* Top Penalty Mark */}
                    <circle cx="32.5" cy="11" r="0.5" className="line" fill="rgba(16,185,129,1)" />

                    {/* Bottom Penalty Area (was Right) */}
                    <rect x="13.84" y="81.5" width="37.32" height="16.5" className="area line" />
                    {/* Bottom Goal Area */}
                    <rect x="24.84" y="92.5" width="15.32" height="5.5" className="line" />
                    {/* Bottom Penalty Arc */}
                    <path d="M 25.5 81.5 A 9.15 9.15 0 0 1 39.5 81.5" className="line" />
                    {/* Bottom Penalty Mark */}
                    <circle cx="32.5" cy="89" r="0.5" className="line" fill="rgba(16,185,129,1)" />

                    {/* Goal posts */}
                    <rect x="28.84" y="0.5" width="7.32" height="1.5" stroke="rgba(255,255,255,0.7)" strokeWidth="0.5" fill="none" />
                    <rect x="28.84" y="98" width="7.32" height="1.5" stroke="rgba(255,255,255,0.7)" strokeWidth="0.5" fill="none" />
                </svg>
            )}

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
