import React, { useState } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor, TouchSensor, DragOverlay, useDraggable } from '@dnd-kit/core';
import Field from './Field';
import Player from './Player';
import { useMediaQuery } from '../hooks/useMediaQuery';
import PlayerForm from './PlayerForm';
import AuthButton from './AuthButton';
import { useTactics } from '../hooks/useTactics';
import { Pencil, Plus, Save, Share2, Lock, UserCheck, UserPlus, UserMinus, ChevronRight, CheckCircle2, Circle } from 'lucide-react';

const DraggableListItem = ({ player, isSelected, isReadOnly, onClick, isDesktop, customColor, onToggleConfirm }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `sidebar-${player.id}`,
        data: { ...player, fromSidebar: true },
        disabled: isReadOnly,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 100,
        opacity: 0.5,
    } : undefined;

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

    const fillColor = colorMap[customColor || player.color] || '#2563eb';

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
                group flex items-center gap-2 rounded-2xl border transition-all duration-300
                ${isSelected ? 'bg-blue-600/20 border-blue-500 scale-[1.02]' : 'bg-white/5 border-white/5 hover:bg-white/10'}
                ${isReadOnly ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}
                ${isDesktop ? 'p-2' : 'flex-col p-2 w-20 justify-center text-center'}
                ${isDragging ? 'invisible' : ''}
                ${player.isConfirmed ? 'opacity-100' : 'opacity-60'}
            `}
        >
            <div
                {...listeners}
                {...attributes}
                onClick={onClick}
                className="relative flex items-center justify-center shrink-0 cursor-grab active:cursor-grabbing"
            >
                <svg viewBox="0 0 100 100" className={`${isDesktop ? 'w-8 h-8' : 'w-10 h-10'} drop-shadow-md`}>
                    <path
                        d="M25 20 L40 10 L60 10 L75 20 L85 35 L75 45 L75 90 L25 90 L25 45 L15 35 Z"
                        fill={fillColor}
                        className="transition-colors duration-500"
                        stroke="rgba(255,255,255,0.4)"
                        strokeWidth="1"
                    />
                </svg>
                {player.isConfirmed && (
                    <div className="absolute -top-1 -right-1 bg-emerald-500/90 text-white rounded-full p-0.5 shadow-lg border border-white/20">
                        <CheckCircle2 size={8} strokeWidth={4} />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0 pointer-events-none" >
                <p className={`font-bold text-xs text-white truncate max-w-full ${!isDesktop && 'text-[9px]'}`}>{player.name || '...'}</p>
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
                    className={`
                        p-1.5 rounded-lg transition-all active:scale-90
                        ${player.isConfirmed ? 'text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20' : 'text-gray-500 bg-white/5 hover:bg-white/10 opacity-0 group-hover:opacity-100'}
                    `}
                    title={player.isConfirmed ? "Quitar de convocados" : "Confirmar convocatoria"}
                >
                    {player.isConfirmed ? <UserMinus size={14} /> : <UserPlus size={14} />}
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

    const { players, setPlayers, teamColor, setTeamColor, gkColor, setGkColor, saveTactics, user, isReadOnly, error } = useTactics(initialPlayers);

    const [activeId, setActiveId] = useState(null);
    const [selectedPlayerId, setSelectedPlayerId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

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
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
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
        const isFromSidebar = String(id).startsWith('sidebar-');
        const playerRealId = isFromSidebar ? id.replace('sidebar-', '') : id;

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
            // Calculate visual coordinates relative to field container
            const pointerX = activatorEvent.clientX + delta.x;
            const pointerY = activatorEvent.clientY + delta.y;

            const visualX = ((pointerX - rect.left) / rect.width) * 100;
            const visualY = ((pointerY - rect.top) / rect.height) * 100;

            if (orientation === 'horizontal') {
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

        setPlayers((prev) => prev.map(p => {
            if (p.id === playerRealId) {
                return {
                    ...p,
                    x: Number(Math.min(100, Math.max(0, newX)).toFixed(2)),
                    y: Number(Math.min(100, Math.max(0, newY)).toFixed(2)),
                    onField: true,
                    isConfirmed: true // Al arrastrar a la cancha, se confirma automáticamente
                };
            }
            return p;
        }));

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
    const fullSquadPlayers = players;

    const groupLabels = {
        'ARQ': 'Arqueros', 'DEF': 'Defensores', 'MED': 'Medios', 'DEL': 'Delanteros'
    };

    const isFormOpen = !isReadOnly && (selectedPlayerId || showAddForm);

    const renderPlayerList = (list, title, isMatchSquad = false) => {
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
                                            key={p.id}
                                            player={p}
                                            isSelected={selectedPlayerId === p.id}
                                            isReadOnly={isReadOnly}
                                            isDesktop={isDesktop}
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
            <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden bg-slate-950 font-sans">

                {isFormOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300"
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
                            relative transition-all duration-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden
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
                                        />
                                        {selectedPlayerId === p.id && (
                                            <div
                                                className="absolute w-14 h-14 rounded-full border-4 border-blue-500 animate-pulse pointer-events-none"
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

                        <div
                            className={`absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900/80 to-transparent border-t border-white/10 pointer-events-none flex items-center justify-center`}
                        >
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Banco de Suplentes</span>
                        </div>
                    </div>

                    {isDesktop && (
                        <div className="w-full max-w-4xl h-24 bg-gray-900 border border-white/10 rounded-2xl mt-2 overflow-hidden flex-shrink-0 shadow-2xl">
                            <img src="/Publi2.jpg" alt="Publicidad" className="w-full h-full object-cover" />
                        </div>
                    )}

                    {!isDesktop && <div className="h-40 w-full flex-shrink-0" />}
                </div>

                <div className={`
                    bg-slate-900/80 backdrop-blur-2xl border-l border-white/10 text-white shadow-2xl z-50
                    ${isDesktop
                        ? 'w-80 h-full p-6 flex flex-col'
                        : 'fixed bottom-0 left-0 right-0 h-auto max-h-[50vh] rounded-t-[2.5rem] p-5 flex flex-col border-t border-white/10'
                    }
                `}>
                    {error && (
                        <div className="bg-red-500/20 text-red-200 p-2 rounded-xl text-xs mb-3 border border-red-500/30">
                            {error}
                        </div>
                    )}

                    <div className={`flex justify-between items-center ${isDesktop ? 'mb-6 border-b border-white/10 pb-6' : 'mb-4'}`}>
                        {isDesktop ? (
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                                Equipo <span className="text-xs font-medium bg-blue-600 px-2.5 py-1 rounded-full ml-1 align-middle">{players.length}</span>
                            </h2>
                        ) : (
                            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PLANTILLA</div>
                        )}

                        <div className="flex gap-2 items-center">
                            {isDesktop && <AuthButton />}
                            {user && !isReadOnly && (
                                <>
                                    <button onClick={handleShare} className="bg-white/5 hover:bg-white/10 text-white p-2.5 rounded-xl transition-all border border-white/10 active:scale-90"><Share2 size={isDesktop ? 22 : 18} /></button>
                                    <button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all active:scale-90"><Save size={isDesktop ? 22 : 18} className={isSaving ? 'animate-spin' : ''} /></button>
                                </>
                            )}
                            {!isReadOnly && (
                                <button onClick={() => { setShowAddForm(true); setSelectedPlayerId(null); }} className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-xl transition-all shadow-xl shadow-emerald-900/20 flex items-center gap-1 active:scale-95">
                                    <Plus size={isDesktop ? 22 : 18} /> <span className="text-xs font-bold hidden md:inline ml-1 uppercase">Agregar</span>
                                </button>
                            )}
                            {!isDesktop && <div className="scale-90 origin-right"><AuthButton /></div>}
                        </div>
                    </div>

                    {/* Color Selectors */}
                    {isDesktop && !isReadOnly && (
                        <div className="mb-6 space-y-4 bg-white/5 p-4 rounded-3xl border border-white/5">
                            <div className="space-y-2">
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
                            <div className="space-y-2">
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
                        </div>
                    )}

                    <div className={`flex-1 overflow-y-auto pr-1 scrollbar-hide`}>
                        {renderPlayerList(confirmedPlayers, "Convocados / Banco Real", true)}
                        {renderPlayerList(fullSquadPlayers, "Plantilla Completa", false)}
                    </div>
                </div>
            </div>

            <DragOverlay>
                {activeId ? (
                    (() => {
                        const p = players.find(p => p.id === (String(activeId).startsWith('sidebar-') ? activeId.replace('sidebar-', '') : activeId));
                        return <Player id={activeId} number={p?.number} color={p ? getPlayerColor(p) : 'bg-blue-600'} isOverlay position={{ x: 0, y: 0 }} />;
                    })()
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default Board;
