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
         If Vertical (Mobile), we use geometry to fit the landscape image into vertical container.
         Parent is approx 3 units wide, 5 tall.
         We want image to be 5 units wide, 3 tall.
         W = 167% of Parent W. H = 60% of Parent H.
         Then centered and rotated.
      */}
            <div
                className="absolute z-0 bg-cover bg-center bg-no-repeat pointer-events-none"
                style={{
                    backgroundImage: "url('/cancha.jpg')",
                    top: '50%',
                    left: '50%',
                    width: isVertical ? '167%' : '100%',
                    height: isVertical ? '60%' : '100%',
                    transform: isVertical ? 'translate(-50%, -50%) rotate(90deg)' : 'translate(-50%, -50%)',
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
