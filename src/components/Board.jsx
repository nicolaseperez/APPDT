import React, { useState } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor, DragOverlay } from '@dnd-kit/core';
import Field from './Field';
import Player from './Player';
import { useMediaQuery } from '../hooks/useMediaQuery';
import PlayerForm from './PlayerForm';
import AuthButton from './AuthButton';
import { useTactics } from '../hooks/useTactics';
import { Pencil, Plus, Save, Share2, Lock } from 'lucide-react';

const Board = () => {
    // Logic coordinates are always Vertical (0-100 X, 0-100 Y)
    // X: 0 (Left Sideline) -> 100 (Right Sideline)
    // Y: 0 (Top Goal) -> 100 (Bottom Goal)
    const initialPlayers = [
        { id: 'p1', number: 1, name: 'GK', x: 50, y: 90, color: 'bg-yellow-500', positionType: 'ARQ' },
        { id: 'p2', number: 2, name: 'DEF', x: 20, y: 70, color: 'bg-blue-600', positionType: 'DEF' },
        { id: 'p3', number: 3, name: 'DEF', x: 50, y: 70, color: 'bg-blue-600', positionType: 'DEF' },
        { id: 'p4', number: 4, name: 'DEF', x: 80, y: 70, color: 'bg-blue-600', positionType: 'DEF' },
        { id: 'p5', number: 5, name: 'MID', x: 35, y: 50, color: 'bg-blue-600', positionType: 'MED' },
        { id: 'p6', number: 6, name: 'MID', x: 65, y: 50, color: 'bg-blue-600', positionType: 'MED' },
        { id: 'p7', number: 7, name: 'FWD', x: 50, y: 20, color: 'bg-red-600', positionType: 'DEL' },
    ];

    const { players, setPlayers, saveTactics, user, isReadOnly, error } = useTactics(initialPlayers);

    const [activeId, setActiveId] = useState(null);
    const [selectedPlayerId, setSelectedPlayerId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const isDesktop = useMediaQuery('(min-width: 768px)');
    // If desktop, we act as 'horizontal' (TV View)
    const orientation = isDesktop ? 'horizontal' : 'vertical';

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handleDragStart = (event) => {
        if (isReadOnly) return;
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        if (isReadOnly) return;
        const { active, delta } = event;
        const id = active.id;

        const field = document.getElementById('field-container');
        if (!field) return;
        const rect = field.getBoundingClientRect();

        const deltaPercentX = (delta.x / rect.width) * 100;
        const deltaPercentY = (delta.y / rect.height) * 100;

        setPlayers((prev) => prev.map(p => {
            if (p.id === id) {
                let newX, newY;

                if (orientation === 'horizontal') {
                    newY = p.y + deltaPercentX;
                    newX = p.x - deltaPercentY; // Inverted axis
                } else {
                    // Vertical (Standard)
                    newX = p.x + deltaPercentX;
                    newY = p.y + deltaPercentY;
                }

                return {
                    ...p,
                    x: Math.min(100, Math.max(0, newX)),
                    y: Math.min(100, Math.max(0, newY))
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
            ...playerData,
            x: 50,
            y: 50 // Default center
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

    const handleSave = async () => {
        if (isReadOnly) return;
        setIsSaving(true);
        await saveTactics(players);
        setIsSaving(false);
    };

    const handleShare = () => {
        if (!user) return alert("You must be logged in to share.");
        const url = `${window.location.origin}?uid=${user.uid}`;
        navigator.clipboard.writeText(url);
        alert("Enlace copiado! Envíalo a tu equipo: " + url);
    };

    const getVisualPosition = (logicalX, logicalY) => {
        if (orientation === 'horizontal') {
            return { x: logicalY, y: 100 - logicalX };
        }
        return { x: logicalX, y: logicalY };
    };

    const selectedPlayer = players.find(p => p.id === selectedPlayerId);

    // Group players logic
    const groupedPlayers = {
        'ARQ': players.filter(p => !p.positionType || p.positionType === 'ARQ'),
        'DEF': players.filter(p => p.positionType === 'DEF'),
        'MED': players.filter(p => p.positionType === 'MED'),
        'DEL': players.filter(p => p.positionType === 'DEL'),
    };
    const groupLabels = {
        'ARQ': 'Arqueros', 'DEF': 'Defensores', 'MED': 'Medios', 'DEL': 'Delanteros'
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="min-h-screen flex flex-col items-center">

                {/* Desktop Top Ad */}
                {isDesktop && (
                    <div className="w-full max-w-5xl h-24 bg-gray-900 mb-2 flex items-center justify-center overflow-hidden rounded-b-lg">
                        <img src="/Publi1.jpg" alt="Publicidad" className="w-full h-full object-cover" />
                    </div>
                )}

                {/* Header for Auth - Absolute positioned on Mobile to sit "above right" */}
                {/* On Desktop, we keep it floating or integrate it? Keeping it consistent with previous request: floating top right */}
                <div className={`fixed top-4 right-4 z-50 ${isDesktop ? 'top-8 right-8' : ''}`}>
                    <div className="backdrop-blur-md bg-black/30 rounded-lg">
                        <AuthButton />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row flex-1 w-full max-w-[1920px] p-4 gap-4 items-center md:items-start overflow-hidden">

                    {/* Field Area */}
                    <div className="flex-1 flex justify-center items-center relative w-full h-full" onClick={() => { setSelectedPlayerId(null); setShowAddForm(false); }}>
                        <div
                            id="field-container"
                            className={`
                                relative transition-all duration-500 origin-top
                                ${isDesktop ? 'w-full max-w-5xl' : 'h-[65vh] aspect-[3/4]'}
                            `}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Field orientation={orientation}>
                                {players.map((p) => {
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
                                                color={p.color}
                                                position={visualPos}
                                                isOverlay={false}
                                                imageUrl={p.imageUrl}
                                            />
                                            {/* Selection Indicator */}
                                            {selectedPlayerId === p.id && (
                                                <div
                                                    className="absolute w-12 h-12 rounded-full border-2 border-yellow-400 animate-pulse pointer-events-none"
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
                    </div>

                    {/* Sidebar / Tools / Mobile List */}
                    {/* Mobile: Fixed Bottom drawer style */}
                    {/* Desktop: Standard Sidebar */}
                    <div className={`
                        bg-slate-900/90 backdrop-blur-xl border border-white/10 text-white shadow-2xl z-40
                        ${isDesktop
                            ? 'w-80 rounded-xl p-4 flex flex-col h-[600px] overflow-hidden'
                            : 'fixed bottom-0 left-0 right-0 h-[25vh] rounded-t-2xl p-3 flex flex-col' // Mobile Drawer
                        }
                    `}>
                        {error && (
                            <div className="bg-red-500/20 text-red-200 p-2 rounded text-xs mb-2 border border-red-500/30">
                                {error}
                            </div>
                        )}

                        {isReadOnly && (
                            <div className="bg-blue-500/20 text-blue-200 p-1 rounded text-xs mb-2 border border-blue-500/30 flex items-center justify-center gap-2">
                                <Lock size={12} />
                                Solo Lectura
                            </div>
                        )}

                        {/* Toolbar Header */}
                        <div className={`flex justify-between items-center ${isDesktop ? 'mb-4 border-b border-white/10 pb-4' : 'mb-2'}`}>
                            <h2 className="text-sm md:text-xl font-bold text-white flex items-center gap-2">
                                Equipo <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-gray-400">{players.length}</span>
                            </h2>
                            <div className="flex gap-2">
                                {user && !isReadOnly && (
                                    <>
                                        <button
                                            onClick={handleShare}
                                            className="bg-indigo-600 hover:bg-indigo-500 text-white p-1.5 md:p-2 rounded-lg transition-colors shadow-lg"
                                        >
                                            <Share2 size={isDesktop ? 20 : 16} />
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-1.5 md:p-2 rounded-lg transition-colors shadow-lg"
                                        >
                                            <Save size={isDesktop ? 20 : 16} className={isSaving ? 'animate-spin' : ''} />
                                        </button>
                                    </>
                                )}
                                {!isReadOnly && (
                                    <button
                                        onClick={() => { setShowAddForm(true); setSelectedPlayerId(null); }}
                                        className="bg-green-600 hover:bg-green-500 text-white p-1.5 md:p-2 rounded-lg transition-colors shadow-lg shadow-green-900/20 flex items-center gap-1"
                                    >
                                        <Plus size={isDesktop ? 20 : 16} /> <span className="text-xs font-bold hidden md:inline">Agregar</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Content Area */}

                        {/* Edit/Add Form takes priority (Overlay on mobile, inline on desktop) */}
                        {(!isReadOnly && (selectedPlayerId || showAddForm)) ? (
                            <div className="flex-1 overflow-y-auto pr-1">
                                <PlayerForm
                                    selectedPlayer={selectedPlayer}
                                    onSave={selectedPlayerId ? handleUpdatePlayer : handleAddPlayer}
                                    onDelete={handleDeletePlayer}
                                    onCancel={() => { setSelectedPlayerId(null); setShowAddForm(false); }}
                                    onClose={() => { setSelectedPlayerId(null); setShowAddForm(false); }}
                                />
                            </div>
                        ) : (
                            // List View
                            <div className={`flex-1 ${isDesktop ? 'overflow-y-auto space-y-4 pr-1' : 'overflow-x-auto flex gap-4 items-center pb-2'}`}>
                                {['ARQ', 'DEF', 'MED', 'DEL'].map(group => {
                                    const groupPlayers = groupedPlayers[group];
                                    if (groupPlayers.length === 0) return null;

                                    // Container style based on desktop vs mobile
                                    return (
                                        <div key={group} className={`${isDesktop ? 'animate-fade-in' : 'flex flex-row gap-2 items-center flex-shrink-0 border-r border-white/10 pr-4 last:border-0'}`}>
                                            {/* Group Label */}
                                            {isDesktop && <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 border-b border-white/5 pb-1">{groupLabels[group]}</h4>}

                                            {/* Players Grid/Row */}
                                            <div className={`${isDesktop ? 'grid grid-cols-1 gap-2' : 'flex gap-2'}`}>
                                                {groupPlayers.map(p => (
                                                    <div
                                                        key={p.id}
                                                        onClick={() => !isReadOnly && setSelectedPlayerId(p.id)}
                                                        className={`
                                                            flex items-center gap-2 rounded-lg border transition-all hover:bg-white/5
                                                            ${selectedPlayerId === p.id ? 'bg-white/10 border-green-500/50' : 'bg-slate-800/50 border-white/5'}
                                                            ${isReadOnly ? 'cursor-default' : 'cursor-pointer'}
                                                            ${isDesktop ? 'p-2' : 'flex-col p-2 w-20 justify-center text-center'}
                                                        `}
                                                    >
                                                        <div className={`
                                                            rounded-full flex items-center justify-center text-xs font-bold text-white border border-white/20 overflow-hidden 
                                                            ${p.color} ${p.imageUrl ? 'bg-white' : ''}
                                                            ${isDesktop ? 'w-8 h-8' : 'w-10 h-10'}
                                                        `}>
                                                            {p.imageUrl ? (
                                                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                                                            ) : p.number}
                                                        </div>
                                                        <div className="flex-1 min-w-0" >
                                                            <p className="font-semibold text-sm text-white truncate">{p.name || '...'}</p>
                                                            {/* Mobile Group Label (since we removed header) */}
                                                            {!isDesktop && <p className="text-[9px] text-gray-400">{group}</p>}
                                                        </div>
                                                        {isDesktop && !isReadOnly && <Pencil size={14} className="text-gray-500 group-hover:text-white" />}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                    </div>

                </div>

                {/* Desktop Bottom Ad */}
                {isDesktop && (
                    <div className="w-full max-w-5xl h-24 bg-gray-900 mt-auto mb-4 flex items-center justify-center overflow-hidden rounded-lg">
                        <img src="/Publi2.jpg" alt="Publicidad" className="w-full h-full object-cover" />
                    </div>
                )}
            </div>

            <DragOverlay>
                {activeId ? (
                    <Player
                        id={activeId}
                        number={players.find(p => p.id === activeId)?.number}
                        imageUrl={players.find(p => p.id === activeId)?.imageUrl}
                        isOverlay
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default Board;
