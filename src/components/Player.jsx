import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Lock, Unlock, X } from 'lucide-react';

const JerseyIcon = ({ color, isDragging }) => {
    // Basic mapping for tailwind colors to hex since we are using SVGs
    // and dynamic fill classes might not be purged correctly or work with Tailwind 4
    const colorMap = {
        'bg-blue-600': '#2563eb',
        'bg-red-600': '#dc2626',
        'bg-emerald-600': '#059669',
        'bg-yellow-500': '#eab308',
        'bg-orange-500': '#f97316',
        'bg-purple-600': '#9333ea',
        'bg-pink-500': '#ec4899',
        'bg-sky-400': '#38bdf8',
        'bg-slate-100': '#f1f5f9',
        'bg-slate-800': '#1e293b',
    };

    const fillColor = colorMap[color] || '#2563eb';

    return (
        <div className={`relative transition-all duration-300 ${isDragging ? 'scale-125' : 'group-hover:scale-110'}`}>
            <svg viewBox="0 0 100 100" className="w-16 h-16 drop-shadow-2xl">
                {/* Jersey Body */}
                <path
                    d="M25 20 L40 10 L60 10 L75 20 L85 35 L75 45 L75 90 L25 90 L25 45 L15 35 Z"
                    fill={fillColor}
                    className="transition-colors duration-500"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="1"
                />
                {/* Collar */}
                <path
                    d="M40 10 C45 15 55 15 60 10"
                    fill="none"
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                {/* Details/Side stripes */}
                <path d="M25 45 L25 90" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <path d="M75 45 L75 90" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

                {/* Sleeve details */}
                <path d="M25 20 L40 10" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <path d="M75 20 L60 10" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            </svg>
        </div>
    );
};

const Player = ({ id, number, name, position, color = 'bg-blue-600', isOverlay, locked, onToggleLock, onRemoveFromField, isReadOnly }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        data: { id, number, name, color },
        disabled: locked || isReadOnly,
    });

    const style = {
        position: isOverlay ? 'relative' : 'absolute',
        left: isOverlay ? undefined : `${position.x}%`,
        top: isOverlay ? undefined : `${position.y}%`,
        transform: isOverlay
            ? CSS.Translate.toString(transform)
            : `translate(-50%, -50%) ${CSS.Translate.toString(transform) || ''}`,
        touchAction: 'none',
        zIndex: isDragging ? 50 : 10,
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={`flex flex-col items-center group ${isReadOnly ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}>
            {/* Player Jersey */}
            <JerseyIcon color={color} isDragging={isDragging} />

            {/* Lock Button (Right Side) */}
            {!isOverlay && !isReadOnly && onToggleLock && (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleLock();
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className={`
                        absolute top-0 -right-4 z-50 p-1.5 rounded-full cursor-pointer shadow-lg border border-white/30 transition-all active:scale-90
                        ${locked ? 'bg-red-500 text-white' : 'bg-slate-800 text-gray-400 hover:text-white'}
                    `}
                    title={locked ? "Desbloquear" : "Bloquear posición"}
                >
                    {locked ? <Lock size={12} strokeWidth={3} /> : <Unlock size={12} strokeWidth={3} />}
                </div>
            )}

            {/* Remove from Field Button (Left Side - 'X') */}
            {!isOverlay && !isReadOnly && onRemoveFromField && (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromField();
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="absolute top-0 -left-4 z-50 p-1.5 rounded-full cursor-pointer shadow-lg border border-white/30 bg-slate-800 text-gray-400 hover:text-white hover:bg-red-500 transition-all active:scale-90"
                    title="Mandar al banco"
                >
                    <X size={12} strokeWidth={3} />
                </div>
            )}

            {/* Name Label */}
            {!isOverlay && (
                <div className={`
                    mt-1 px-3 py-0.5 bg-black/80 backdrop-blur-md rounded-lg border border-white/10
                    text-[10px] font-black text-white uppercase tracking-tighter text-center whitespace-nowrap
                    transition-opacity duration-200 shadow-xl
                    ${isDragging ? 'opacity-0' : 'opacity-100'}
                `}>
                    {name}
                </div>
            )}
        </div>
    );
};

export default Player;
