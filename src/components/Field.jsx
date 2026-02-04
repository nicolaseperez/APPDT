import React from 'react';
import { useDroppable } from '@dnd-kit/core';

const Field = ({ children, orientation }) => {
    const { setNodeRef } = useDroppable({
        id: 'field',
    });

    // Decide styles based on orientation
    const isHorizontal = orientation === 'horizontal';

    return (
        <div
            ref={setNodeRef}
            className={`relative mx-auto rounded-lg overflow-hidden shadow-2xl border-4 border-white/10 select-none
        ${isHorizontal ? 'aspect-[4/3] w-full' : 'aspect-[3/4] h-full'}
      `}
            style={{
                // Use the custom image from public folder
                backgroundImage: "url('/cancha.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                // Optional: Add a subtle overlay to ensure player contrast
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
