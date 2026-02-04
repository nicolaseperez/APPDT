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
            className="w-full h-full relative mx-auto rounded-lg overflow-hidden shadow-2xl border-4 border-white/10 select-none bg-black"
        >
            {/* Background Image Layer */}
            {/* 
         If Vertical (Mobile), we assume the image is Horizontal (Landscape) and rotate it 90deg.
         We scale it up to cover the rotation gaps if necessary.
      */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-500"
                style={{
                    backgroundImage: "url('/cancha.jpg')",
                    // If vertical, rotate 90deg. 
                    // Reduced scale from 1.5 to 1.1 as requested.
                    transform: isVertical ? 'scale(1.1) rotate(90deg)' : 'none',
                }}
            />

            {/* Background Overlay for better contrast */}
            <div className="absolute inset-0 z-0 bg-black/10 pointer-events-none" />

            {/* Children (Players) - Z-Index 10 to sit above background */}
            <div className="absolute inset-0 z-10">
                {children}
            </div>
        </div>
    );
};

export default Field;
