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
                    // Scale needed? Ideally bg-cover handles it if container matches, but rotation swaps dimensions.
                    // A simple rotation might leave gaps if not sized.
                    // Using a pseudo-element strategy or transforming a larger container is safer, 
                    // but let's try simple rotation first. If it's a 16:9 image in a 3:4 container rotated, it might need 'bg-contain' or specific scaling.
                    // Let's assume standard bg-cover on the DIV itself works best if we don't rotate the div but use a rotated inner div?
                    // Actually, if we rotate the div, we rotate the children (players). WE MUST NOT ROTATE PLAYERS.
                    // So we rotate this background layer only.
                    transform: isVertical ? 'scale(1.5) rotate(90deg)' : 'none',
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
