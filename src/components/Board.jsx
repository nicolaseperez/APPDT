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
        { id: 'p1', number: 1, name: 'GK', x: 50, y: 90, color: 'bg-yellow-500' },
        { id: 'p2', number: 2, name: 'DEF', x: 20, y: 70, color: 'bg-blue-600' },
        { id: 'p3', number: 3, name: 'DEF', x: 50, y: 70, color: 'bg-blue-600' },
        { id: 'p4', number: 4, name: 'DEF', x: 80, y: 70, color: 'bg-blue-600' },
        { id: 'p5', number: 5, name: 'MID', x: 35, y: 50, color: 'bg-blue-600' },
        { id: 'p6', number: 6, name: 'MID', x: 65, y: 50, color: 'bg-blue-600' },
        { id: 'p7', number: 7, name: 'FWD', x: 50, y: 20, color: 'bg-red-600' },
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

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {/* Header for Auth - Absolute positioned on Mobile to sit "above right" */}
            <div className={`fixed top-4 right-4 z-50 ${isDesktop ? 'right-8' : ''}`}>
                <div className="backdrop-blur-md bg-black/30 rounded-lg">
                    <AuthButton />
                </div>
            </div>

            <div className="flex flex-col md:flex-row h-screen p-4 gap-4 md:pt-4 pt-16">
                {/* Field Area */}
                <div className="flex-1 flex justify-center items-center relative" onClick={() => { setSelectedPlayerId(null); setShowAddForm(false); }}>
                    {/* Added 'scale-90' to reduce size by 10% on mobile as requested, and removed instruction text */}
                    <div
                        id="field-container"
                        className={`w-full relative transition-all duration-500 scale-90 md:scale-100 ${isDesktop ? 'max-w-5xl' : 'max-w-md'}`}
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

                {/* Sidebar / Tools */}
                <div className="w-full md:w-80 bg-slate-900/90 backdrop-blur-xl rounded-xl p-4 shadow-2xl border border-white/10 flex flex-col h-1/3 md:h-auto overflow-hidden text-white">
                    {/* Auth Button removed from here, moved to float top right */}

                    {error && (
                        <div className="bg-red-500/20 text-red-200 p-2 rounded text-sm mb-4 border border-red-500/30">
                            {error}
                        </div>
                    )}

                    {isReadOnly && (
                        <div className="bg-blue-500/20 text-blue-200 p-2 rounded text-sm mb-4 border border-blue-500/30 flex items-center gap-2">
                            <Lock size={14} />
                            Vista Solo Lectura
                        </div>
                    )}

                    <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            Equipo <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-gray-400">{players.length}</span>
                        </h2>
                        <div className="flex gap-2">
                            {user && !isReadOnly && (
                                <>
                                    <button
                                        onClick={handleShare}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition-colors shadow-lg"
                                        title="Compartir Alineación"
                                    >
                                        <Share2 size={20} />
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-2 rounded-lg transition-colors shadow-lg"
                                        title="Guardar en la Nube"
                                    >
                                        <Save size={20} className={isSaving ? 'animate-spin' : ''} />
                                    </button>
                                </>
                            )}
                            {!isReadOnly && (
                                <button
                                    onClick={() => { setShowAddForm(true); setSelectedPlayerId(null); }}
                                    className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-lg transition-colors shadow-lg shadow-green-900/20"
                                    title="Agregar Jugador"
                                >
                                    <Plus size={20} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">

                        {/* Edit/Add Form takes priority */}
                        {(!isReadOnly && (selectedPlayerId || showAddForm)) ? (
                            <PlayerForm
                                selectedPlayer={selectedPlayer}
                                onSave={selectedPlayerId ? handleUpdatePlayer : handleAddPlayer}
                                onDelete={handleDeletePlayer}
                                onCancel={() => { setSelectedPlayerId(null); setShowAddForm(false); }}
                                onClose={() => { setSelectedPlayerId(null); setShowAddForm(false); }}
                            />
                        ) : (
                            <div className="grid grid-cols-1 gap-2">
                                {/* Removed instruction text as requested */}
                                {players.map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => !isReadOnly && setSelectedPlayerId(p.id)}
                                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all hover:bg-white/5
                                            ${selectedPlayerId === p.id ? 'bg-white/10 border-green-500/50' : 'bg-slate-800/50 border-white/5'}
                                            ${isReadOnly ? 'cursor-default' : 'cursor-pointer'}
                                        `}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border border-white/20 ${p.color}`}>
                                            {p.number}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm text-white">{p.name || 'Sin Nombre'}</p>
                                        </div>
                                        {!isReadOnly && <Pencil size={14} className="text-gray-500 group-hover:text-white" />}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <DragOverlay>
                {activeId ? (
                    <Player id={activeId} number={players.find(p => p.id === activeId)?.number} isOverlay />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
};

export default Board;
