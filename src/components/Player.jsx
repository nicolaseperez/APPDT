import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const Player = ({ id, number, name, position, color = 'bg-blue-600', isOverlay, imageUrl }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        data: { id, number, name, color, imageUrl },
    });

    const style = {
        // If overlay (being dragged), we use basic styles (no transform) because dnd-kit handles it
        // If regular player, we position absolutely based on percentages
        position: isOverlay ? 'relative' : 'absolute',
        left: isOverlay ? undefined : `${position.x}%`,
        top: isOverlay ? undefined : `${position.y}%`,
        transform: isOverlay ? undefined : CSS.Translate.toString(transform),
        touchAction: 'none',
        zIndex: isDragging ? 50 : 10,
        // Translate -50% -50% to center the element on the coordinate
        marginLeft: isOverlay ? 0 : '-1.5rem', // Half of w-12 (3rem) = 1.5rem
        marginTop: isOverlay ? 0 : '-1.5rem',
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="flex flex-col items-center group cursor-grab active:cursor-grabbing">
            {/* Player Circle */}
            <div
                className={`
            w-12 h-12 rounded-full border-2 border-white shadow-xl flex items-center justify-center font-black text-lg select-none transition-transform
            ${isDragging ? 'scale-125 shadow-2xl ring-4 ring-white/30' : 'group-hover:scale-110'}
            ${color}
            ${imageUrl ? 'overflow-hidden bg-white' : ''} 
        `}
            >
                {imageUrl ? (
                    <img src={imageUrl} alt={name} className="w-full h-full object-cover pointer-events-none" />
                ) : (
                    <span className="text-white drop-shadow-md">{number}</span>
                )}
            </div>

            {/* Name Label */}
            {!isOverlay && (
                <div className={`
             mt-1 px-2 py-0.5 bg-black/70 backdrop-blur-sm rounded-full border border-white/20
             text-[10px] font-bold text-white uppercase tracking-wider text-center whitespace-nowrap
             transition-opacity duration-200
             ${isDragging ? 'opacity-0' : 'opacity-100'}
        `}>
                    {name}
                </div>
            )}
        </div>
    );
};

export default Player;
