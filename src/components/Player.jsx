import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

const Player = ({ id, number, name, position, color = 'bg-blue-600', isOverlay }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        data: { number, name, color },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        left: position ? `${position.x}%` : undefined,
        top: position ? `${position.y}%` : undefined,
        position: position ? 'absolute' : 'relative',
        touchAction: 'none',
        zIndex: isDragging || isOverlay ? 50 : 10,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`
        flex flex-col items-center justify-center 
        cursor-grab active:cursor-grabbing 
        ${isOverlay ? 'scale-110 shadow-xl' : ''}
      `}
        >
            <div className={`
        w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center 
        text-white font-bold text-sm shadow-md border-2 border-white/30
        ${color} ${isDragging ? 'opacity-50' : 'opacity-100'}
        transition-all duration-200
      `}>
                {number}
            </div>
            {(name && (isDragging || isOverlay || position)) && (
                <span className="mt-1 text-xs font-semibold text-white bg-black/50 px-1 rounded backdrop-blur-sm pointer-events-none whitespace-nowrap">
                    {name}
                </span>
            )}
        </div>
    );
};

export default Player;
