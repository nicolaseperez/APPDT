import React, { useState } from 'react';
import { DndContext, useSensor, useSensors, MouseSensor, TouchSensor, DragOverlay, useDraggable } from '@dnd-kit/core';
import Field from './Field';
import Player from './Player';
import { useMediaQuery } from '../hooks/useMediaQuery';
import PlayerForm from './PlayerForm';
import AuthButton from './AuthButton';
import { useTactics } from '../hooks/useTactics';
import { Pencil, Plus, Minus, Save, Share2, Lock, UserCheck, UserPlus, UserMinus, ChevronRight, CheckCircle2, Circle, ChevronUp, ChevronDown } from 'lucide-react';

const formations = {
    "4-3-3": {
        ARQ: [{x: 50, y: 90}],
        DEF: [{x: 15, y: 75}, {x: 38, y: 75}, {x: 62, y: 75}, {x: 85, y: 75}],
        MED: [{x: 25, y: 45}, {x: 50, y: 45}, {x: 75, y: 45}],
        DEL: [{x: 20, y: 20}, {x: 50, y: 20}, {x: 80, y: 20}]
    },
    "4-4-2": {
        ARQ: [{x: 50, y: 90}],
        DEF: [{x: 15, y: 75}, {x: 38, y: 75}, {x: 62, y: 75}, {x: 85, y: 75}],
        MED: [{x: 15, y: 45}, {x: 38, y: 45}, {x: 62, y: 45}, {x: 85, y: 45}],
        DEL: [{x: 35, y: 20}, {x: 65, y: 20}]
    },
    "4-2-3-1": {
        ARQ: [{x: 50, y: 90}],
        DEF: [{x: 15, y: 75}, {x: 38, y: 75}, {x: 62, y: 75}, {x: 85, y: 75}],
        MED: [{x: 35, y: 55}, {x: 65, y: 55}, {x: 20, y: 35}, {x: 50, y: 35}, {x: 80, y: 35}],
        DEL: [{x: 50, y: 15}]
    },
    "3-5-2": {
        ARQ: [{x: 50, y: 90}],
        DEF: [{x: 25, y: 75}, {x: 50, y: 75}, {x: 75, y: 75}],
        MED: [{x: 10, y: 45}, {x: 30, y: 55}, {x: 50, y: 45}, {x: 70, y: 55}, {x: 90, y: 45}],
        DEL: [{x: 35, y: 20}, {x: 65, y: 20}]
    },
    "3-4-3": {
        ARQ: [{x: 50, y: 90}],
        DEF: [{x: 25, y: 75}, {x: 50, y: 75}, {x: 75, y: 75}],
        MED: [{x: 15, y: 45}, {x: 38, y: 45}, {x: 62, y: 45}, {x: 85, y: 45}],
        DEL: [{x: 20, y: 20}, {x: 50, y: 20}, {x: 80, y: 20}]
    },
    "5-3-2": {
        ARQ: [{x: 50, y: 90}],
        DEF: [{x: 10, y: 70}, {x: 30, y: 78}, {x: 50, y: 78}, {x: 70, y: 78}, {x: 90, y: 70}],
        MED: [{x: 25, y: 45}, {x: 50, y: 45}, {x: 75, y: 45}],
        DEL: [{x: 35, y: 20}, {x: 65, y: 20}]
    }
};

const DraggableListItem = ({ player, isSelected, isReadOnly, onClick, isDesktop, customColor, onToggleConfirm, idPrefix = 'side' }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `${idPrefix}-${player.id}`,
        data: { ...player, fromSidebar: true },
        disabled: isReadOnly,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 100,
        opacity: 0.5,
    } : undefined;

    const colorMap = {
        'bg-blue-600': '#06b6d4',
        'bg-red-600': '#f43f5e',
        'bg-emerald-600': '#10b981',
        'bg-yellow-500': '#fbbf24',
        'bg-orange-500': '#fb923c',
        'bg-purple-600': '#a855f7',
        'bg-pink-500': '#f472b6',
        'bg-sky-400': '#38bdf8',
        'bg-slate-100': '#f8fafc',
        'bg-slate-800': '#94a3b8',
    };

    const outlineColor = colorMap[customColor || player.color] || '#06b6d4';
    const glowFilter = `drop-shadow(0 0 5px ${outlineColor})`;

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            onClick={onClick}
            style={style}
            className={`
                group flex items-center gap-2 rounded-2xl border transition-all duration-300
                ${isSelected ? 'bg-cyan-900/40 border-cyan-500 scale-[1.02] shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'bg-slate-900/40 border-cyan-500/20 hover:bg-slate-800/60 hover:border-cyan-500/40'}
                ${isReadOnly ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}
                ${isDesktop ? 'p-3' : 'flex-col p-1.5 w-20 justify-center text-center'}
                ${isDragging ? 'opacity-0' : 'opacity-100'}
                ${player.isConfirmed ? 'opacity-100' : 'opacity-60'}
            `}
        >
            <div
                className="relative flex items-center justify-center shrink-0"
            >
                <svg viewBox="0 0 100 100" className={`${isDesktop ? 'w-8 h-8' : 'w-8 h-8'}`} style={{ filter: glowFilter }}>
                    <defs>
                        <linearGradient id={`grad-side-${player.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{stopColor: outlineColor, stopOpacity: 0.3}} />
                            <stop offset="100%" style={{stopColor: outlineColor, stopOpacity: 0.1}} />
                        </linearGradient>
                    </defs>
                    <path
                        d="M 50 5 L 90 20 L 90 55 C 90 75 50 95 50 95 C 50 95 10 75 10 55 L 10 20 Z"
                        fill={`url(#grad-side-${player.id})`}
                        stroke={outlineColor}
                        strokeWidth="3.5"
                    />
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
                        {player.number || '#'}
                    </text>
                </svg>
                {player.isConfirmed && (
                    <div className="absolute -top-1 -right-1 bg-emerald-500/90 text-white rounded-full p-0.5 shadow-lg border border-white/20">
                        <CheckCircle2 size={8} strokeWidth={4} />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0 pointer-events-none" >
                <p className={`font-bold text-xs text-white truncate max-w-full ${!isDesktop && '!text-[8px]'}`}>{player.name || '...'}</p>
                {isDesktop ? (
                    <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest truncate">
                        {player.positionType?.replace('LAT_', 'L').replace('VOL_', 'V')}
                    </p>
                ) : (
                    <p className="text-[7px] font-bold text-blue-400/80 uppercase tracking-widest text-center">
                        {player.positionType?.replace('LAT_', 'L').replace('VOL_', 'V')}
                    </p>
                )}
            </div>

            {!isReadOnly && onToggleConfirm && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleConfirm(player.id);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className={`
                        p-1.5 rounded-lg transition-all active:scale-90
                        ${player.isConfirmed ? 'text-red-400 bg-red-400/10 hover:bg-red-400/20' : 'text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20'}
                    `}
                    title={player.isConfirmed ? "Quitar de convocados" : "Agregar a convocados"}
                >
                    {player.isConfirmed ? <Minus size={16} /> : <Plus size={16} />}
                </button>
            )}
        </div>
    );
};

const Board = () => {
    const initialPlayers = [
        { id: 'p1', number: 1, name: 'GK', x: 50, y: 90, color: 'bg-yellow-500', positionType: 'ARQ', locked: false, onField: true },
        { id: 'p2', number: 2, name: 'DEF', x: 20, y: 70, color: 'bg-blue-600', positionType: 'DEF', locked: false, onField: true },
        { id: 'p3', number: 3, name: 'DEF', x: 50, y: 70, color: 'bg-blue-600', positionType: 'DEF', locked: false, onField: true },
        { id: 'p4', number: 4, name: 'DEF', x: 80, y: 70, color: 'bg-blue-600', positionType: 'DEF', locked: false, onField: true },
        { id: 'p5', number: 5, name: 'MID', x: 35, y: 50, color: 'bg-emerald-600', positionType: 'MED', locked: false, onField: true },
        { id: 'p6', number: 6, name: 'MID', x: 65, y: 50, color: 'bg-emerald-600', positionType: 'MED', locked: false, onField: true },
        { id: 'p7', number: 7, name: 'FWD', x: 50, y: 20, color: 'bg-red-600', positionType: 'DEL', locked: false, onField: true },
    ];

    const { players, setPlayers, teamColor, setTeamColor, gkColor, setGkColor, teamName, setTeamName, saveTactics, user, isReadOnly, error } = useTactics(initialPlayers);

    const [activeId, setActiveId] = useState(null);
    const [selectedPlayerId, setSelectedPlayerId] = useState(null);
    const [activeFormation, setActiveFormation] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [touchStartY, setTouchStartY] = useState(null);

    const handleTouchStart = (e) => {
        setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchEnd = (e) => {
        if (touchStartY === null) return;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchEndY - touchStartY;

        if (deltaY > 30) {
            setIsSidebarCollapsed(true);
        } else if (deltaY < -30) {
            setIsSidebarCollapsed(false);
        }
        setTouchStartY(null);
    };

    const isDesktop = useMediaQuery('(min-width: 768px)');
    const orientation = isDesktop ? 'horizontal' : 'vertical';

    const jerseyColors = [
        { name: 'Azul', class: 'bg-blue-600' },
        { name: 'Rojo', class: 'bg-red-600' },
        { name: 'Verde', class: 'bg-emerald-600' },
        { name: 'Amarillo', class: 'bg-yellow-500' },
        { name: 'Naranja', class: 'bg-orange-500' },
        { name: 'Morado', class: 'bg-purple-600' },
        { name: 'Rosa', class: 'bg-pink-500' },
        { name: 'Celeste', class: 'bg-sky-400' },
        { name: 'Blanco', class: 'bg-slate-100' },
        { name: 'Negro', class: 'bg-slate-800' },
    ];

    const getPlayerColor = (p) => {
        const pos = p.positionType?.toUpperCase();
        const name = p.name?.toUpperCase();
        const isArquero = pos === 'ARQ' || !pos || name === 'GK' || name?.includes('ARQUERO');
        return isArquero ? gkColor : teamColor;
    };

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 600,
                tolerance: 5,
            },
        })
    );

    const handleDragStart = (event) => {
        if (isReadOnly) return;
        setActiveId(event.active.id);
    };

    const handleToggleConfirm = (id) => {
        if (isReadOnly) return;
        setPlayers(players.map(p => p.id === id ? { ...p, isConfirmed: !p.isConfirmed, onField: p.isConfirmed ? false : p.onField } : p));
    };

    const handleDragEnd = (event) => {
        if (isReadOnly) return;
        const { active, over, delta, activatorEvent } = event;
        const id = active.id;
        const isFromSidebar = String(id).startsWith('side-');
        const playerRealId = isFromSidebar ? id.replace('side-conf-', '').replace('side-all-', '') : id;

        // Check if dropped over the field container
        const overField = over && over.id === 'field';

        // If from sidebar and not over field, don't do anything (snaps back)
        if (isFromSidebar && !overField) {
            setActiveId(null);
            return;
        }

        const field = document.getElementById('field-container');
        if (!field) return;
        const rect = field.getBoundingClientRect();

        let newX, newY;

        if (isFromSidebar) {
            // Get pointer coordinates, dnd-kit activatorEvent can be Mouse or Touch
            // We use the initial coordinates and add the current delta
            const activator = activatorEvent.touches ? activatorEvent.touches[0] : (activatorEvent.changedTouches ? activatorEvent.changedTouches[0] : activatorEvent);
            const clientX = activator.clientX;
            const clientY = activator.clientY;

            const pointerX = clientX + delta.x;
            const pointerY = clientY + delta.y;

            const visualX = ((pointerX - rect.left) / rect.width) * 100;
            const visualY = ((pointerY - rect.top) / rect.height) * 100;

            if (orientation === 'horizontal') {
                // Correct Inverse Landscape Transform:
                // Lx = 100 - Vy
                // Ly = Vx
                newX = 100 - visualY;
                newY = visualX;
            } else {
                newX = visualX;
                newY = visualY;
            }
        } else {
            const deltaPercentX = (delta.x / rect.width) * 100;
            const deltaPercentY = (delta.y / rect.height) * 100;

            const player = players.find(p => p.id === playerRealId);
            if (!player || player.locked) {
                setActiveId(null);
                return;
            }

            if (orientation === 'horizontal') {
                newY = player.y + deltaPercentX;
                newX = player.x - deltaPercentY;
            } else {
                newX = player.x + deltaPercentX;
                newY = player.y + deltaPercentY;
            }
        }

        if (isNaN(newX) || isNaN(newY)) {
            setActiveId(null);
            return;
        }

        setPlayers((prev) => {
            const finalX = Number(Math.min(100, Math.max(0, newX)).toFixed(2));
            const finalY = Number(Math.min(100, Math.max(0, newY)).toFixed(2));

            let swapTargetId = null;
            if (isFromSidebar) {
                let minDist = Infinity;
                prev.forEach(p => {
                    if (p.onField && !p.locked && p.id !== playerRealId) {
                        // Check distance
                        const dist = Math.sqrt(Math.pow(p.x - finalX, 2) + Math.pow(p.y - finalY, 2));
                        if (dist < 8 && dist < minDist) { // 8% threshold for substitution
                            minDist = dist;
                            swapTargetId = p.id;
                        }
                    }
                });
            }

            return prev.map(p => {
                // Return replaced player to the exact same sidebar state
                if (swapTargetId && p.id === swapTargetId) {
                    return { ...p, onField: false, locked: false };
                }
                // Set the dropped player
                if (p.id === playerRealId) {
                    if (swapTargetId) {
                        const target = prev.find(t => t.id === swapTargetId);
                        return {
                            ...p,
                            x: target.x,
                            y: target.y,
                            onField: true,
                            isConfirmed: true
                        };
                    }
                    return {
                        ...p,
                        x: finalX,
                        y: finalY,
                        onField: true,
                        isConfirmed: true
                    };
                }
                return p;
            });
        });

        setActiveId(null);
    };

    const handleAddPlayer = (playerData) => {
        if (isReadOnly) return;
        const newPlayer = {
            id: `p${Date.now()}`,
            name: playerData.name || 'NUEVO',
            number: playerData.number || 0,
            imageUrl: null,
            positionType: playerData.positionType || 'MED',
            x: 50,
            y: 95,
            locked: false,
            onField: false,
            isConfirmed: false
        };
        setPlayers([...players, newPlayer]);
        setShowAddForm(false);
    };

    const handleUpdatePlayer = (updatedData) => {
        if (isReadOnly) return;
        setPlayers(players.map(p => p.id === updatedData.id ? { ...p, ...updatedData } : p));
        setSelectedPlayerId(null);
    };

    const handleDeletePlayer = (id) => {
        if (isReadOnly) return;
        setPlayers(players.filter(p => p.id !== id));
        setSelectedPlayerId(null);
    };

    const handleRemoveFromField = (id) => {
        if (isReadOnly) return;
        setPlayers(players.map(p => p.id === id ? { ...p, onField: false, locked: false } : p));
    };

    const handleSave = async () => {
        if (isReadOnly) return;
        setIsSaving(true);
        await saveTactics(players);
        setIsSaving(false);
    };

    const handleShare = () => {
        if (!user) return alert("Debes iniciar sesión para compartir.");
        const url = `${window.location.origin}?uid=${user.uid}`;
        navigator.clipboard.writeText(url);
        alert("¡Enlace copiado! Envíalo a tu equipo: " + url);
    };

    const handleToggleLock = (id) => {
        if (isReadOnly) return;
        setPlayers(players.map(p => p.id === id ? { ...p, locked: !p.locked } : p));
    };

    const handleApplyFormation = (formationKey) => {
        if (isReadOnly || !formationKey) return;
        
        const layout = formations[formationKey];
        if (!layout) return;

        setPlayers(prev => {
            let onFieldPlayers = prev.filter(p => p.onField);

            const isArquero = (p) => {
                const pos = p.positionType?.toUpperCase();
                const name = p.name?.toUpperCase();
                return pos === 'ARQ' || !pos || name === 'GK' || name?.includes('ARQUERO') || name?.includes('ARQ');
            };

            const isDefensor = (p) => !isArquero(p) && ['DEF', 'LAT_IZQ', 'LAT_DER'].includes(p.positionType);
            const isDelantero = (p) => !isArquero(p) && p.positionType === 'DEL';
            
            // Si no es arquero, defensor o delantero explícitamente, asume que es medio
            const isMedio = (p) => !isArquero(p) && !isDefensor(p) && !isDelantero(p);
            
            let arqs = onFieldPlayers.filter(isArquero);
            let defs = onFieldPlayers.filter(isDefensor);
            let meds = onFieldPlayers.filter(isMedio);
            let dels = onFieldPlayers.filter(isDelantero);

            let substitutes = prev.filter(p => p.isConfirmed && !p.onField);
            let subArqs = substitutes.filter(isArquero);
            let subDefs = substitutes.filter(isDefensor);
            let subMeds = substitutes.filter(isMedio);
            let subDels = substitutes.filter(isDelantero);

            const fillOrTrim = (activeList, subList, requiredSlots) => {
                if (activeList.length > requiredSlots) {
                    const keeping = activeList.slice(0, requiredSlots);
                    const benching = activeList.slice(requiredSlots).map(p => ({ ...p, onField: false }));
                    return { active: keeping, benched: benching };
                } else if (activeList.length < requiredSlots && subList.length > 0) {
                    const deficit = requiredSlots - activeList.length;
                    const toAdd = subList.slice(0, deficit).map(p => ({ ...p, onField: true }));
                    return { active: [...activeList, ...toAdd], benched: [] };
                }
                return { active: activeList, benched: [] };
            };

            const arqsData = fillOrTrim(arqs, subArqs, layout.ARQ.length);
            const defsData = fillOrTrim(defs, subDefs, layout.DEF.length);
            const medsData = fillOrTrim(meds, subMeds, layout.MED.length);
            const delsData = fillOrTrim(dels, subDels, layout.DEL.length);

            arqs = arqsData.active;
            defs = defsData.active;
            meds = medsData.active;
            dels = delsData.active;

            const allBenched = [...arqsData.benched, ...defsData.benched, ...medsData.benched, ...delsData.benched];
            
            const defOrder = { 'LAT_IZQ': 1, 'DEF': 2, 'LAT_DER': 3 };
            defs.sort((a, b) => (defOrder[a.positionType] || 2) - (defOrder[b.positionType] || 2));
            
            const medOrder = { 'VOL_IZQ': 1, 'MED': 2, 'VOL_DER': 3 };
            meds.sort((a, b) => (medOrder[a.positionType] || 2) - (medOrder[b.positionType] || 2));

            const assignSlots = (playersList, slots) => {
                return playersList.map((p, index) => {
                    const slot = slots[Math.min(index, slots.length - 1)]; 
                    if (!slot) return p;
                    return { ...p, x: slot.x, y: slot.y };
                });
            };

            const newArqs = assignSlots(arqs, layout.ARQ);
            const newDefs = assignSlots(defs, layout.DEF);
            const newMeds = assignSlots(meds, layout.MED);
            const newDels = assignSlots(dels, layout.DEL);

            const allUpdatedOnField = [...newArqs, ...newDefs, ...newMeds, ...newDels];

            return prev.map(p => {
                const updatedActive = allUpdatedOnField.find(up => up.id === p.id);
                if (updatedActive) return updatedActive;
                
                const updatedBenched = allBenched.find(up => up.id === p.id);
                if (updatedBenched) return updatedBenched;

                return p;
            });
        });
    };

    const getVisualPosition = (logicalX, logicalY) => {
        if (orientation === 'horizontal') {
            return { x: logicalY, y: 100 - logicalX };
        }
        return { x: logicalX, y: logicalY };
    };

    const selectedPlayer = players.find(p => p.id === selectedPlayerId);

    const getGrouped = (playerList) => ({
        'ARQ': playerList.filter(p => !p.positionType || p.positionType === 'ARQ'),
        'DEF': playerList.filter(p => ['DEF', 'LAT_IZQ', 'LAT_DER'].includes(p.positionType)),
        'MED': playerList.filter(p => ['MED', 'VOL_IZQ', 'VOL_DER'].includes(p.positionType)),
        'DEL': playerList.filter(p => p.positionType === 'DEL'),
    });

    const confirmedPlayers = players.filter(p => p.isConfirmed && !p.onField);
    const generalPlayers = players.filter(p => !p.isConfirmed);

    const groupLabels = {
        'ARQ': 'Arqueros', 'DEF': 'Defensores', 'MED': 'Medios', 'DEL': 'Delanteros'
    };

    const isFormOpen = !isReadOnly && (selectedPlayerId || showAddForm);

    const renderPlayerList = (list, title, isMatchSquad = false, idPrefix = 'side') => {
        const grouped = getGrouped(list);
        const hasPlayers = list.length > 0;

        return (
            <div className={`space-y-4 ${isDesktop ? 'mb-8' : 'mb-4'}`}>
                <div className="flex items-center justify-between px-1">
                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                        {isMatchSquad ? <UserCheck size={12} /> : <Plus size={12} />}
                        {title}
                        {hasPlayers && <span className="bg-blue-600/20 text-blue-400 px-1.5 py-0.5 rounded text-[8px]">{list.length}</span>}
                    </h4>
                </div>

                <div className={`
                    ${isDesktop ? 'space-y-6' : 'flex gap-3 pb-2 overflow-x-auto scrollbar-hide'}
                `}>
                    {['ARQ', 'DEF', 'MED', 'DEL'].map(group => {
                        const groupPlayers = grouped[group];
                        if (groupPlayers.length === 0) return null;
                        return (
                            <div key={group} className={`${isDesktop ? '' : 'flex flex-row gap-2 items-center flex-shrink-0'}`}>
                                {isDesktop && groupPlayers.length > 0 && <span className="text-[8px] font-bold text-gray-600 uppercase mb-2 block ml-1">{groupLabels[group]}</span>}
                                <div className={`${isDesktop ? 'grid grid-cols-1 gap-2' : 'flex gap-2'}`}>
                                    {groupPlayers.map(p => (
                                        <DraggableListItem
                                            key={`${idPrefix}-${p.id}`}
                                            player={p}
                                            isSelected={selectedPlayerId === p.id}
                                            isReadOnly={isReadOnly}
                                            isDesktop={isDesktop}
                                            idPrefix={idPrefix}
                                            onClick={() => !isReadOnly && setSelectedPlayerId(p.id)}
                                            customColor={getPlayerColor(p)}
                                            onToggleConfirm={handleToggleConfirm}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
                {!hasPlayers && (
                    <div className="py-8 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-gray-600">
                        <p className="text-[10px] font-bold uppercase tracking-tighter">Sin jugadores</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden bg-transparent font-sans">

                {isFormOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-slate-950/80 md:bg-slate-950/60 md:backdrop-blur-md animate-in fade-in duration-200"
                            onClick={() => { setSelectedPlayerId(null); setShowAddForm(false); }}
                        />
                        <div className="relative z-10 w-full flex justify-center overflow-hidden">
                            <PlayerForm
                                selectedPlayer={selectedPlayer}
                                onSave={selectedPlayerId ? handleUpdatePlayer : handleAddPlayer}
                                onDelete={handleDeletePlayer}
                                onCancel={() => { setSelectedPlayerId(null); setShowAddForm(false); }}
                                onClose={() => { setSelectedPlayerId(null); setShowAddForm(false); }}
                            />
                        </div>
                    </div>
                )}

                <div className={`flex-1 flex flex-col items-center justify-center p-4 relative overflow-y-auto transition-all ${isFormOpen ? 'blur-[2px] scale-[0.98]' : ''}`}>

                    {isDesktop && (
                        <div className="w-full max-w-4xl h-24 bg-gray-900 border border-white/10 rounded-2xl mb-2 overflow-hidden flex-shrink-0 shadow-2xl">
                            <img src="/Publi1.jpg" alt="Publicidad" className="w-full h-full object-cover" />
                        </div>
                    )}

                    <div
                        id="field-container"
                        className={`
                            relative transition-all duration-500 md:duration-700 shadow-2xl md:shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden touch-none
                            ${isDesktop ? 'w-full max-w-4xl aspect-[4/3]' : 'w-full max-w-sm aspect-[3/5]'} 
                        `}
                        onClick={() => setSelectedPlayerId(null)}
                    >
                        <Field orientation={orientation}>
                            {players.filter(p => p.onField).map((p) => {
                                const visualPos = getVisualPosition(p.x, p.y);
                                return (
                                    <div key={p.id} onClick={(e) => {
                                        e.stopPropagation();
                                        if (!isReadOnly) {
                                            setSelectedPlayerId(p.id);
                                            setShowAddForm(false);
                                        }
                                    }}>
                                        <Player
                                            id={p.id}
                                            number={p.number}
                                            name={p.name}
                                            color={getPlayerColor(p)}
                                            position={visualPos}
                                            isOverlay={false}
                                            locked={p.locked}
                                            onToggleLock={() => handleToggleLock(p.id)}
                                            onRemoveFromField={() => handleRemoveFromField(p.id)}
                                            isReadOnly={isReadOnly}
                                        />
                                        {selectedPlayerId === p.id && (
                                            <div
                                                className="absolute w-14 h-14 rounded-full border-[3px] border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)] animate-pulse pointer-events-none"
                                                style={{
                                                    left: `${visualPos.x}%`,
                                                    top: `${visualPos.y}%`,
                                                    transform: 'translate(-50%, -50%)',
                                                    zIndex: 40
                                                }}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </Field>
                    </div>

                    {isDesktop && (
                        <div className="w-full max-w-4xl h-24 bg-gray-900 border border-white/10 rounded-2xl mt-2 overflow-hidden flex-shrink-0 shadow-2xl">
                            <img src="/Publi2.jpg" alt="Publicidad" className="w-full h-full object-cover" />
                        </div>
                    )}

                    {!isDesktop && <div className={`transition-all duration-500 flex-shrink-0 ${isSidebarCollapsed ? 'h-20' : 'h-40'} w-full`} />}
                </div>

                <div className={`
                    bg-slate-950/60 md:bg-slate-950/60 backdrop-blur-xl border-l border-cyan-500/20 text-cyan-50 shadow-[0_0_30px_rgba(6,182,212,0.1)] z-50
                    transition-all duration-300 md:duration-500 ease-in-out
                    ${isDesktop
                        ? 'w-96 h-full p-6 flex flex-col'
                        : `fixed bottom-0 left-0 right-0 h-auto max-h-[60vh] rounded-t-[3rem] p-6 pb-8 flex flex-col border-t border-cyan-500/30 ${isSidebarCollapsed ? 'translate-y-[calc(100%-80px)]' : 'translate-y-0'}`
                    }
                `}>
                    {!isDesktop && (
                        <div
                            className="absolute -top-6 left-0 right-0 h-16 pt-8 flex justify-center cursor-pointer select-none touch-none z-50"
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                        >
                            <div className="w-16 h-2 bg-white/20 rounded-full group-hover:bg-white/40 transition-colors" />
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-500/20 text-red-200 p-2 rounded-xl text-xs mb-3 border border-red-500/30">
                            {error}
                        </div>
                    )}

                    {isDesktop ? (
                        <div className="flex flex-col gap-4 mb-6 border-b border-white/10 pb-6">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center">
                                        {isReadOnly ? (
                                            'Táctica Compartida'
                                        ) : (
                                            isEditingName ? (
                                                <input 
                                                    type="text" 
                                                    value={teamName} 
                                                    onChange={(e) => setTeamName(e.target.value)}
                                                    onBlur={() => setIsEditingName(false)}
                                                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                                                    autoFocus
                                                    className="bg-transparent border-b border-cyan-500/50 outline-none text-cyan-50 w-48 focus:ring-0 p-0 m-0 leading-none"
                                                    placeholder="MI EQUIPO"
                                                />
                                            ) : (
                                                <span 
                                                    className="cursor-pointer truncate max-w-[180px]" 
                                                    onClick={() => setIsEditingName(true)}
                                                >
                                                    {teamName || 'MI EQUIPO'}
                                                </span>
                                            )
                                        )}
                                    </h2>
                                    {!isReadOnly && !isEditingName && (
                                        <button 
                                            onClick={() => setIsEditingName(true)}
                                            className="text-gray-500 hover:text-white transition-colors"
                                            title="Editar nombre del equipo"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                    )}
                                </div>
                                
                                <div className="flex gap-2 items-center">
                                    {!isReadOnly && <AuthButton />}
                                    {user && !isReadOnly && (
                                        <>
                                            <button onClick={handleShare} className="bg-white/5 hover:bg-white/10 text-white p-2.5 rounded-xl transition-all border border-white/10 active:scale-90" title="Compartir Táctica"><Share2 size={22} /></button>
                                            <button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all active:scale-90" title="Guardar Cambios"><Save size={22} className={isSaving ? 'animate-spin' : ''} /></button>
                                        </>
                                    )}
                                </div>
                            </div>
                            
                            {!isReadOnly && (
                                <button onClick={() => { setShowAddForm(true); setSelectedPlayerId(null); }} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-xl transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-2 active:scale-95">
                                    <Plus size={22} /> <span className="font-bold tracking-widest uppercase text-sm">Agregar Jugador</span>
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex justify-between items-center mb-4">
                            <div
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            >
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                    {isReadOnly ? (
                                        'TÁCTICA COMPARTIDA'
                                    ) : (
                                        isEditingName ? (
                                            <input 
                                                type="text" 
                                                value={teamName} 
                                                onChange={(e) => setTeamName(e.target.value)} 
                                                onClick={(e) => e.stopPropagation()}
                                                onBlur={() => setIsEditingName(false)}
                                                onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                                                autoFocus
                                                className="bg-transparent border-b border-cyan-500/50 outline-none text-cyan-400 uppercase w-24 focus:ring-0 p-0 m-0 leading-tight"
                                                placeholder="MI EQUIPO"
                                            />
                                        ) : (
                                            <>
                                                <span 
                                                    className="truncate max-w-[100px]"
                                                    onClick={(e) => { e.stopPropagation(); setIsEditingName(true); }}
                                                >
                                                    {teamName || 'MI EQUIPO'}
                                                </span>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setIsEditingName(true); }}
                                                    className="text-gray-500 hover:text-gray-300 transition-colors"
                                                >
                                                    <Pencil size={10} />
                                                </button>
                                            </>
                                        )
                                    )}
                                </div>
                                {isSidebarCollapsed ? <ChevronUp size={14} className="text-blue-500 animate-bounce" /> : <ChevronDown size={14} className="text-gray-600" />}
                            </div>

                            <div className="flex gap-2 items-center">
                                {user && !isReadOnly && (
                                    <>
                                        <button onClick={handleShare} className="bg-white/5 hover:bg-white/10 text-white p-2 rounded-xl transition-all border border-white/10 active:scale-90"><Share2 size={18} /></button>
                                        <button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-2 rounded-xl transition-all active:scale-90"><Save size={18} className={isSaving ? 'animate-spin' : ''} /></button>
                                    </>
                                )}
                                {!isReadOnly && (
                                    <button onClick={() => { setShowAddForm(true); setSelectedPlayerId(null); }} className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-xl transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center active:scale-95">
                                        <Plus size={18} />
                                    </button>
                                )}
                                {!isReadOnly && <div className="scale-90 origin-right"><AuthButton /></div>}
                            </div>
                        </div>
                    )}

                    {/* Configuraciones: Formación y Colores */}
                    {!isReadOnly && (
                        <div className={`mb-6 space-y-4 ${isDesktop ? 'bg-white/5 p-4 rounded-3xl border border-white/5' : ''}`}>
                            <div className="space-y-2 text-left">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Formación Automática</label>
                                <select 
                                    value={activeFormation}
                                    onChange={(e) => {
                                        setActiveFormation(e.target.value);
                                        handleApplyFormation(e.target.value);
                                    }}
                                    className="w-full bg-slate-900 border border-cyan-500/30 text-cyan-400 text-sm rounded-xl px-3 py-2 outline-none focus:border-cyan-400 transition-colors"
                                >
                                    <option value="">Seleccionar formación...</option>
                                    <option value="4-3-3">4-3-3</option>
                                    <option value="4-4-2">4-4-2</option>
                                    <option value="4-2-3-1">4-2-3-1</option>
                                    <option value="3-5-2">3-5-2</option>
                                    <option value="3-4-3">3-4-3</option>
                                    <option value="5-3-2">5-3-2</option>
                                </select>
                            </div>
                            
                            {isDesktop && (
                                <>
                                    <div className="space-y-2 text-left">
                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Color Jugadores</label>
                                        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                                            {jerseyColors.map((c) => (
                                                <button
                                                    key={`team-${c.class}`}
                                                    onClick={() => setTeamColor(c.class)}
                                                    className={`w-5 h-5 rounded-full border-2 shrink-0 transition-all ${c.class} ${teamColor === c.class ? 'border-white scale-110' : 'border-transparent opacity-40 hover:opacity-100'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-left">
                                        <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest ml-1">Color Arquero</label>
                                        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                                            {jerseyColors.map((c) => (
                                                <button
                                                    key={`gk-${c.class}`}
                                                    onClick={() => setGkColor(c.class)}
                                                    className={`w-5 h-5 rounded-full border-2 shrink-0 transition-all ${c.class} ${gkColor === c.class ? 'border-white scale-110' : 'border-transparent opacity-40 hover:opacity-100'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    <div className={`flex-1 overflow-y-auto pr-1 scrollbar-hide`}>
                        <div className="mb-4 bg-cyan-950/40 border border-cyan-800/50 rounded-xl p-3 flex justify-between items-center shadow-inner">
                            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Jugadores Totales</span>
                            <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-lg text-xs font-bold border border-cyan-500/20">{players.length}</span>
                        </div>
                        {renderPlayerList(confirmedPlayers, isReadOnly ? "Suplentes" : "Lista de Convocados", true, 'side-conf')}
                        {!isReadOnly && renderPlayerList(generalPlayers, "Lista General", false, 'side-all')}
                    </div>
                </div>
            </div>

            <DragOverlay>
                {activeId ? (
                    (() => {
                        const idStr = String(activeId);
                        const playerRealId = idStr.startsWith('side-')
                            ? idStr.replace('side-conf-', '').replace('side-all-', '')
                            : idStr;
                        const p = players.find(p => p.id === playerRealId);
                        return <Player id={activeId} number={p?.number} color={p ? getPlayerColor(p) : 'bg-blue-600'} isOverlay position={{ x: 0, y: 0 }} />;
                    })()
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default Board;
