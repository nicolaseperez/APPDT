import React, { useState } from 'react';
import { DndContext, useSensor, useSensors, PointerSensor, DragOverlay } from '@dnd-kit/core';
import Field from './Field';
import Player from './Player';
import { useMediaQuery } from '../hooks/useMediaQuery';

const Board = () => {
    // Logic coordinates are always Vertical (0-100 X, 0-100 Y)
    // X: 0 (Left Sideline) -> 100 (Right Sideline)
    // Y: 0 (Top Goal) -> 100 (Bottom Goal)
    const [players, setPlayers] = useState([
        { id: 'p1', number: 1, name: 'GK', x: 50, y: 90, color: 'bg-yellow-500' },
        { id: 'p2', number: 2, name: 'DEF', x: 20, y: 70, color: 'bg-blue-600' },
        { id: 'p3', number: 3, name: 'DEF', x: 50, y: 70, color: 'bg-blue-600' },
        { id: 'p4', number: 4, name: 'DEF', x: 80, y: 70, color: 'bg-blue-600' },
        { id: 'p5', number: 5, name: 'MID', x: 35, y: 50, color: 'bg-blue-600' },
        { id: 'p6', number: 6, name: 'MID', x: 65, y: 50, color: 'bg-blue-600' },
        { id: 'p7', number: 7, name: 'FWD', x: 50, y: 20, color: 'bg-red-600' },
    ]);

    const [activeId, setActiveId] = useState(null);
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
                    // Visual X (Left->Right) maps to Logical Y (Top->Bottom) ? No.
                    // TV View:
                    // Left Goal (Logical Bottom, Y=100) is at Visual Left (X=0).  -> Wait.
                    // Let's decide standard TV View:
                    // Left Side of Screen = Home Goal? 
                    // Let's assume standard: Left Side = Top Logical Goal (Y=0). Right Side = Bottom Logical Goal (Y=100).
                    // Top Side of Screen = Right Logical Sideline (X=100).
                    // Bottom Side of Screen = Left Logical Sideline (X=0).

                    // Let's check Field.jsx markings.
                    // Horizontal: 
                    // goal left (left: 4) -> This implies Logical Top Goal (Y=0) is on Left?
                    // goal right (right: 4) -> This implies Logical Bottom Goal (Y=100) is on Right?
                    // If so:
                    // Visual X (0->100) maps to Logical Y (0->100).
                    // Visual Y (0->100) maps to Logical X (100 -> 0) (Top visual is Right logical).

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

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col md:flex-row h-screen p-4 gap-4">
                {/* Field Area */}
                <div className="flex-1 flex justify-center items-center">
                    <div id="field-container" className={`w-full relative transition-all duration-500 ${isDesktop ? 'max-w-5xl' : 'max-w-md'}`}>
                        <Field orientation={orientation}>
                            {players.map((p) => {
                                const visualPos = getVisualPosition(p.x, p.y);
                                return (
                                    <Player
                                        key={p.id}
                                        id={p.id}
                                        number={p.number}
                                        name={p.name}
                                        color={p.color}
                                        position={visualPos}
                                    />
                                );
                            })}
                        </Field>
                    </div>
                </div>

                {/* Sidebar / Tools */}
                <div className="w-full md:w-80 bg-slate-800/80 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/10 flex flex-col">
                    <h2 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-2">Squad</h2>

                    <div className="flex-1 overflow-y-auto">
                        {/* List of players could go here if we had a bench */}
                        <div className="bg-white/5 p-4 rounded-lg border border-white/5 mb-4">
                            <p className="text-sm text-gray-300">
                                <span className="font-semibold text-white">Hint:</span> Drag players to position them.
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                Current View: <span className="text-green-400 font-mono">{orientation.toUpperCase()}</span>
                            </p>
                        </div>
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
