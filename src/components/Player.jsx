import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Lock, Unlock, X } from 'lucide-react';

const Player = ({ id, number, name, position, color = 'bg-blue-600', isOverlay, imageUrl, locked, onToggleLock, onRemoveFromField }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        data: { id, number, name, color, imageUrl },
        disabled: locked,
    });

    const style = {
        position: isOverlay ? 'relative' : 'absolute',
        left: isOverlay ? undefined : `${position.x}%`,
        top: isOverlay ? undefined : `${position.y}%`,
        // Centering logic: translate(-50%, -50%) for the circle center on point
        transform: isOverlay
            ? CSS.Translate.toString(transform)
            : `translate(-50%, -50%) ${CSS.Translate.toString(transform) || ''}`,
        touchAction: 'none',
        zIndex: isDragging ? 50 : 10,
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

            {/* Lock Button (Right Side) */}
            {!isOverlay && onToggleLock && (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleLock();
                    }}
                    className={`
                        absolute -top-1 -right-3 z-50 p-1.5 rounded-full cursor-pointer shadow-lg border border-white/30 transition-all active:scale-90
                        ${locked ? 'bg-red-500 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'}
                    `}
                    title={locked ? "Desbloquear" : "Bloquear posición"}
                >
                    {locked ? <Lock size={12} strokeWidth={3} /> : <Unlock size={12} strokeWidth={3} />}
                </div>
            )}

            {/* Remove from Field Button (Left Side - 'X') */}
            {!isOverlay && onRemoveFromField && (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromField();
                    }}
                    className="absolute -top-1 -left-3 z-50 p-1.5 rounded-full cursor-pointer shadow-lg border border-white/30 bg-slate-800 text-gray-400 hover:text-white hover:bg-red-500 transition-all active:scale-90"
                    title="Mandar al banco"
                >
                    <X size={12} strokeWidth={3} />
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
