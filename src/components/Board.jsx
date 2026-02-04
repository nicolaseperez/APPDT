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
    const initialPlayers = [
        { id: 'p1', number: 1, name: 'GK', x: 50, y: 90, color: 'bg-yellow-500', positionType: 'ARQ', locked: false },
        { id: 'p2', number: 2, name: 'DEF', x: 20, y: 70, color: 'bg-blue-600', positionType: 'DEF', locked: false },
        { id: 'p3', number: 3, name: 'DEF', x: 50, y: 70, color: 'bg-blue-600', positionType: 'DEF', locked: false },
        { id: 'p4', number: 4, name: 'DEF', x: 80, y: 70, color: 'bg-blue-600', positionType: 'DEF', locked: false },
        { id: 'p5', number: 5, name: 'MID', x: 35, y: 50, color: 'bg-emerald-600', positionType: 'MED', locked: false },
        { id: 'p6', number: 6, name: 'MID', x: 65, y: 50, color: 'bg-emerald-600', positionType: 'MED', locked: false },
        { id: 'p7', number: 7, name: 'FWD', x: 50, y: 20, color: 'bg-red-600', positionType: 'DEL', locked: false },
    ];

    const { players, setPlayers, saveTactics, user, isReadOnly, error } = useTactics(initialPlayers);

    const [activeId, setActiveId] = useState(null);
    const [selectedPlayerId, setSelectedPlayerId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const isDesktop = useMediaQuery('(min-width: 768px)');
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
                    newX = p.x - deltaPercentY;
                } else {
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
            y: 95, // Place at the bottom (substitute bench area) by default
            locked: false
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

    const groupedPlayers = {
        'ARQ': players.filter(p => !p.positionType || p.positionType === 'ARQ'),
        'DEF': players.filter(p => p.positionType === 'DEF' || p.positionType === 'LAT_IZQ' || p.positionType === 'LAT_DER'),
        'MED': players.filter(p => p.positionType === 'MED' || p.positionType === 'VOL_IZQ' || p.positionType === 'VOL_DER'),
        'DEL': players.filter(p => p.positionType === 'DEL'),
    };
    const groupLabels = {
        'ARQ': 'Arqueros', 'DEF': 'Defensores', 'MED': 'Medios', 'DEL': 'Delanteros'
    };

    const isFormOpen = !isReadOnly && (selectedPlayerId || showAddForm);

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
                                            locked={p.locked}
                                            onToggleLock={() => handleToggleLock(p.id)}
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
                    </div>

                    {isDesktop && (
                        <div className="w-full max-w-4xl h-24 bg-gray-900 border border-white/10 rounded-2xl mt-2 overflow-hidden flex-shrink-0 shadow-2xl">
                            <img src="/Publi2.jpg" alt="Publicidad" className="w-full h-full object-cover" />
                        </div>
                    )}

                    {!isDesktop && <div className="h-32 w-full flex-shrink-0" />}
                </div>

                <div className={`
                    bg-slate-900/80 backdrop-blur-2xl border-l border-white/10 text-white shadow-2xl z-50
                    ${isDesktop
                        ? 'w-80 h-full p-6 flex flex-col'
                        : 'fixed bottom-0 left-0 right-0 h-auto max-h-[35vh] rounded-t-[2.5rem] p-5 flex flex-col border-t border-white/10'
                    }
                `}>
                    {error && (
                        <div className="bg-red-500/20 text-red-200 p-2 rounded-xl text-xs mb-3 border border-red-500/30">
                            {error}
                        </div>
                    )}

                    {isReadOnly && (
                        <div className="bg-blue-500/10 text-blue-300 p-2 rounded-xl text-[10px] font-bold uppercase tracking-widest mb-3 border border-blue-500/20 flex items-center justify-center gap-2">
                            <Lock size={12} />
                            MODO LECTURA
                        </div>
                    )}

                    <div className={`flex justify-between items-center ${isDesktop ? 'mb-6 border-b border-white/10 pb-6' : 'mb-4'}`}>
                        {isDesktop ? (
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                                Equipo <span className="text-xs font-medium bg-blue-600 px-2.5 py-1 rounded-full ml-1 align-middle">{players.length}</span>
                            </h2>
                        ) : (
                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">PLANTILLA ({players.length})</div>
                        )}

                        <div className="flex gap-2 items-center">
                            {isDesktop && <AuthButton />}

                            {user && !isReadOnly && (
                                <>
                                    <button
                                        onClick={handleShare}
                                        className="bg-white/5 hover:bg-white/10 text-white p-2.5 rounded-xl transition-all shadow-lg border border-white/10 active:scale-90"
                                        title="Compartir"
                                    >
                                        <Share2 size={isDesktop ? 22 : 18} />
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shadow-lg active:scale-90"
                                        title="Guardar"
                                    >
                                        <Save size={isDesktop ? 22 : 18} className={isSaving ? 'animate-spin' : ''} />
                                    </button>
                                </>
                            )}
                            {!isReadOnly && (
                                <button
                                    onClick={() => { setShowAddForm(true); setSelectedPlayerId(null); }}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-xl transition-all shadow-xl shadow-emerald-900/20 flex items-center gap-1 active:scale-95"
                                >
                                    <Plus size={isDesktop ? 22 : 18} /> <span className="text-xs font-bold hidden md:inline ml-1 uppercase">Agregar</span>
                                </button>
                            )}
                            {!isDesktop && <div className="scale-90 origin-right"><AuthButton /></div>}
                        </div>
                    </div>

                    <div className={`flex-1 ${isDesktop ? 'overflow-y-auto space-y-6 pr-1' : 'overflow-x-auto flex gap-4 items-center pb-4 scrollbar-hide touch-pan-x'}`}>
                        {['ARQ', 'DEF', 'MED', 'DEL'].map(group => {
                            const groupPlayers = groupedPlayers[group];
                            if (groupPlayers.length === 0) return null;

                            return (
                                <div key={group} className={`${isDesktop ? 'animate-in slide-in-from-right-4 duration-300' : 'flex flex-row gap-3 items-center flex-shrink-0 border-r border-white/5 pr-4 last:border-0'}`}>
                                    {isDesktop && <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3 ml-1">{groupLabels[group]}</h4>}

                                    <div className={`${isDesktop ? 'grid grid-cols-1 gap-2.5' : 'flex gap-3'}`}>
                                        {groupPlayers.map(p => (
                                            <div
                                                key={p.id}
                                                onClick={() => !isReadOnly && setSelectedPlayerId(p.id)}
                                                className={`
                                                        flex items-center gap-3 rounded-2xl border transition-all duration-300
                                                        ${selectedPlayerId === p.id ? 'bg-blue-600/20 border-blue-500 scale-[1.02]' : 'bg-white/5 border-white/5 hover:bg-white/10'}
                                                        ${isReadOnly ? 'cursor-default' : 'cursor-pointer'}
                                                        ${isDesktop ? 'p-3' : 'flex-col p-3 w-16 justify-center text-center'}
                                                    `}
                                            >
                                                <div className={`
                                                        rounded-2xl flex items-center justify-center text-xs font-black text-white border border-white/10 shadow-lg overflow-hidden transition-transform
                                                        ${p.color} ${p.imageUrl ? 'bg-white' : ''}
                                                        ${isDesktop ? 'w-10 h-10' : 'w-12 h-12 shadow-xl'}
                                                    `}>
                                                    {p.imageUrl ? (
                                                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                                                    ) : p.number}
                                                </div>
                                                <div className="flex-1 min-w-0" >
                                                    <p className={`font-bold text-sm text-white truncate max-w-full ${!isDesktop && 'text-[10px]'}`}>{p.name || '...'}</p>
                                                    {!isDesktop && <p className="text-[8px] font-bold text-blue-400/80 uppercase tracking-widest">{group}</p>}
                                                </div>
                                                {isDesktop && !isReadOnly && <Pencil size={14} className="text-gray-500 opacity-0 group-hover:opacity-100" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
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
