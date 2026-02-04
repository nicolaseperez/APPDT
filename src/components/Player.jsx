import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Lock, Unlock } from 'lucide-react';

const Player = ({ id, number, name, position, color = 'bg-blue-600', isOverlay, imageUrl, locked, onToggleLock }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        data: { id, number, name, color, imageUrl },
        disabled: locked,
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

            {/* Lock/Unlock Button */}
            {!isOverlay && onToggleLock && (
                <div
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent drag/select
                        onToggleLock();
                    }}
                    className={`
                        absolute -top-2 -right-2 z-50 p-1 rounded-full cursor-pointer shadow-sm border border-white/20 transition-colors
                        ${locked ? 'bg-red-500 text-white' : 'bg-gray-700/80 text-gray-300 hover:bg-gray-600'}
                    `}
                >
                    {locked ? <Lock size={10} /> : <Unlock size={10} />}
                </div>
            )}

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
