import React from 'react';
import { useDroppable } from '@dnd-kit/core';

const Field = ({ children, orientation }) => {
    const { setNodeRef } = useDroppable({
        id: 'field',
    });

    return (
        <div
            ref={setNodeRef}
            className="w-full h-full relative mx-auto rounded-lg overflow-hidden shadow-2xl border-4 border-white/10 select-none bg-cover bg-center bg-no-repeat"
            style={{
                // Use the custom image from public folder
                backgroundImage: "url('/cancha.jpg')",
            }}
        >
            {/* Background Overlay for better contrast if needed, subtle gradient */}
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />

            {/* Children (Players) */}
            <div className="absolute inset-0 z-10">
                {children}
            </div>
        </div>
    );
};

export default Field;
