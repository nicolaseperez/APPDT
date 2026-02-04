import React, { useState } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor, DragOverlay } from '@dnd-kit/core';
import Field from './Field';
import Player from './Player';
import { useMediaQuery } from '../hooks/useMediaQuery';
import PlayerForm from './PlayerForm';
import AuthButton from './AuthButton';
import { useTactics } from '../hooks/useTactics';
import { Pencil, Plus, Save } from 'lucide-react';

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

    const { players, setPlayers, saveTactics, user } = useTactics(initialPlayers);

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
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, delta } = event;
        const id = active.id;

        // Get field dimensions to calculate percentage delta
        const field = document.getElementById('field-container');
        if (!field) return;
        const rect = field.getBoundingClientRect();

        // Calculate percentage change based on VISUAL dimensions
        const deltaPercentX = (delta.x / rect.width) * 100;
        const deltaPercentY = (delta.y / rect.height) * 100;

        setPlayers((prev) => prev.map(p => {
            if (p.id === id) {
                let newX, newY;

                if (orientation === 'horizontal') {
                    // Mapping from Horizontal Visual to Vertical Logical
                    // Visual X (Left->Right) maps to Logical Y (0->100).
                    // Visual Y (Top->Bottom) maps to Logical X (100 -> 0) (Top visual is Right logical).

                    // So:
                    // Logical Y change = Visual X change
                    // Logical X change = - Visual Y change
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
        setPlayers(players.map(p => p.id === updatedData.id ? { ...p, ...updatedData } : p));
        setSelectedPlayerId(null);
    };

    const handleDeletePlayer = (id) => {
        setPlayers(players.filter(p => p.id !== id));
        setSelectedPlayerId(null);
    };

    const handleSave = async () => {
        setIsSaving(true);
        await saveTactics(players);
        setIsSaving(false);
    };

    const getVisualPosition = (logicalX, logicalY) => {
        if (orientation === 'horizontal') {
            // Logic: Left Goal (Y=0) is Left Screen.
            // Logic: Right Goal (Y=100) is Right Screen.
            // Logic: Left Sideline (X=0) is Bottom Screen.
            // Logic: Right Sideline (X=100) is Top Screen.

            // Visual X = Logical Y
            // Visual Y = 100 - Logical X
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
            <div className="flex flex-col md:flex-row h-screen p-4 gap-4">
                {/* Field Area */}
                <div className="flex-1 flex justify-center items-center relative" onClick={() => { setSelectedPlayerId(null); setShowAddForm(false); }}>
                    <div id="field-container" className={`w-full relative transition-all duration-500 ${isDesktop ? 'max-w-5xl' : 'max-w-md'}`} onClick={(e) => e.stopPropagation()}>
                        <Field orientation={orientation}>
                            {players.map((p) => {
                                const visualPos = getVisualPosition(p.x, p.y);
                                return (
                                    <div key={p.id} onClick={(e) => { e.stopPropagation(); setSelectedPlayerId(p.id); setShowAddForm(false); }}>
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
                <div className="w-full md:w-80 bg-slate-900/90 backdrop-blur-xl rounded-xl p-4 shadow-2xl border border-white/10 flex flex-col h-1/3 md:h-auto overflow-hidden">
                    <div className="mb-4">
                        <AuthButton />
                    </div>

                    <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            Squad <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-gray-400">{players.length}</span>
                        </h2>
                        <div className="flex gap-2">
                            {user && (
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-2 rounded-lg transition-colors shadow-lg"
                                    title="Save to Cloud"
                                >
                                    <Save size={20} className={isSaving ? 'animate-spin' : ''} />
                                </button>
                            )}
                            <button
                                onClick={() => { setShowAddForm(true); setSelectedPlayerId(null); }}
                                className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-lg transition-colors shadow-lg shadow-green-900/20"
                                title="Add Player"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">

                        {/* Edit/Add Form takes priority */}
                        {(selectedPlayerId || showAddForm) ? (
                            <PlayerForm
                                selectedPlayer={selectedPlayer}
                                onSave={selectedPlayerId ? handleUpdatePlayer : handleAddPlayer}
                                onDelete={handleDeletePlayer}
                                onCancel={() => { setSelectedPlayerId(null); setShowAddForm(false); }}
                                onClose={() => { setSelectedPlayerId(null); setShowAddForm(false); }}
                            />
                        ) : (
                            <div className="grid grid-cols-1 gap-2">
                                <p className="text-xs text-gray-500 mb-2 italic">Click a player on the field to edit.</p>
                                {players.map(p => (
                                    <div
                                        key={p.id}
                                        onClick={() => setSelectedPlayerId(p.id)}
                                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:bg-white/5
                                            ${selectedPlayerId === p.id ? 'bg-white/10 border-green-500/50' : 'bg-slate-800/50 border-white/5'}
                                        `}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border border-white/20 ${p.color}`}>
                                            {p.number}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm text-white">{p.name || 'Unnamed'}</p>
                                            <p className="text-xs text-gray-400 font-mono">ID: {p.id}</p>
                                        </div>
                                        <Pencil size={14} className="text-gray-500 group-hover:text-white" />
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
