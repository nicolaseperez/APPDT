import React from 'react';
import { useDroppable } from '@dnd-kit/core';

const Field = ({ children, orientation = 'vertical' }) => {
    const { setNodeRef } = useDroppable({
        id: 'field',
    });

    const isHorizontal = orientation === 'horizontal';

    // Gradient definitions for grid pattern
    const gridPattern = 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)';

    return (
        <div
            ref={setNodeRef}
            className={`relative w-full ${isHorizontal ? 'aspect-[3/2]' : 'aspect-[2/3]'} bg-green-700 rounded-lg overflow-hidden border-4 border-white/20 shadow-2xl transition-all duration-500 ease-in-out`}
            style={{
                backgroundImage: gridPattern,
                backgroundSize: '10% 10%'
            }}
        >
            {/* Field Markings */}
            <div className="absolute inset-4 border-2 border-white/50 rounded-sm pointer-events-none"></div>

            {/* Center Circle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/50 rounded-full pointer-events-none"></div>

            {/* Center Line */}
            <div className={`absolute bg-white/50 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none
        ${isHorizontal
                    ? 'top-0 bottom-0 left-1/2 w-0.5 h-full'
                    : 'left-0 right-0 top-1/2 h-0.5 w-full'
                }
      `}></div>

            {/* Penalty Areas */}
            {/* Top/Left Goal Area */}
            <div className={`absolute border-2 border-white/50 pointer-events-none
        ${isHorizontal
                    ? 'top-1/2 left-4 transform -translate-y-1/2 w-16 h-32 border-l-0'
                    : 'left-1/2 top-4 transform -translate-x-1/2 w-32 h-16 border-t-0'
                }
      `}></div>

            {/* Bottom/Right Goal Area */}
            <div className={`absolute border-2 border-white/50 pointer-events-none
        ${isHorizontal
                    ? 'top-1/2 right-4 transform -translate-y-1/2 w-16 h-32 border-r-0'
                    : 'left-1/2 bottom-4 transform -translate-x-1/2 w-32 h-16 border-b-0'
                }
      `}></div>

            {children}
        </div>
    );
};

export default Field;
