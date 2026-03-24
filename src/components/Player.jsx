import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Lock, Unlock, X } from 'lucide-react';

const ShieldIcon = ({ color, isDragging, number }) => {
    // Basic mapping for tailwind colors to hex since we are using SVGs
    // Mapped to brighter/neon equivalents
    const colorMap = {
        'bg-blue-600': '#06b6d4', // cyan-500
        'bg-red-600': '#f43f5e', // rose-500
        'bg-emerald-600': '#10b981', // emerald-500
        'bg-yellow-500': '#fbbf24', // amber-400
        'bg-orange-500': '#fb923c', // orange-400
        'bg-purple-600': '#a855f7', // purple-500
        'bg-pink-500': '#f472b6', // pink-400
        'bg-sky-400': '#38bdf8', // sky-400
        'bg-slate-100': '#f8fafc',
        'bg-slate-800': '#94a3b8',
    };

    const outlineColor = colorMap[color] || '#06b6d4';
    const glowFilter = `drop-shadow(0 0 5px ${outlineColor})`;

    return (
        <div className={`relative transition-all duration-300 flex items-center justify-center ${isDragging ? 'scale-125 z-50' : 'group-hover:scale-110'}`}>
            <svg viewBox="0 0 100 100" className="w-[3rem] h-[3rem] md:w-[3.8rem] md:h-[3.8rem]" style={{ filter: glowFilter }}>
                <defs>
                    <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{stopColor: outlineColor, stopOpacity: 0.3}} />
                        <stop offset="100%" style={{stopColor: outlineColor, stopOpacity: 0.1}} />
                    </linearGradient>
                </defs>
                {/* Shield Body */}
                <path
                    d="M 50 5 L 90 20 L 90 55 C 90 75 50 95 50 95 C 50 95 10 75 10 55 L 10 20 Z"
                    fill={`url(#grad-${color})`}
                    stroke={outlineColor}
                    strokeWidth="3.5"
                />
                {/* Inner decorative line */}
                <path
                    d="M 50 14 L 80 26 L 80 52 C 80 67 50 82 50 82 C 50 82 20 67 20 52 L 20 26 Z"
                    fill="none"
                    stroke={outlineColor}
                    strokeWidth="1"
                    strokeOpacity="0.6"
                />
                <text 
                    x="50" y="55" 
                    textAnchor="middle" 
                    alignmentBaseline="middle" 
                    fill="#ffffff" 
                    fontSize="34" 
                    fontWeight="bold" 
                    fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                >
                    {number || '#'}
                </text>
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
            {/* Player Shield */}
            <ShieldIcon color={color} isDragging={isDragging} number={number} />

            {/* Lock Button (Right Side) */}
            {!isOverlay && !isReadOnly && onToggleLock && (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleLock();
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className={`
                        absolute top-0 -right-4 z-50 p-1.5 rounded-full cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.5)] border border-cyan-500/50 transition-all active:scale-90
                        ${locked ? 'bg-red-500 text-white border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-slate-900/80 text-cyan-400 hover:text-white hover:bg-cyan-900/80'}
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
                    className="absolute top-0 -left-4 z-50 p-1.5 rounded-full cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.5)] border border-cyan-500/50 bg-slate-900/80 text-cyan-400 hover:text-white hover:bg-red-500/80 hover:border-red-500/50 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all active:scale-90"
                    title="Mandar al banco"
                >
                    <X size={12} strokeWidth={3} />
                </div>
            )}

            {/* Name Label */}
            {!isOverlay && (
                <div className={`
                    mt-1 px-2.5 py-0.5 md:px-3 md:py-0.5 bg-slate-950/80 backdrop-blur-md rounded border border-cyan-500/40
                    text-[8px] md:text-[10px] font-bold text-cyan-100 uppercase tracking-widest text-center whitespace-nowrap
                    transition-opacity duration-200 shadow-[0_0_8px_rgba(6,182,212,0.3)]
                    ${isDragging ? 'opacity-0' : 'opacity-100'}
                `}>
                    {name}
                </div>
            )}
        </div>
    );
};

export default Player;
