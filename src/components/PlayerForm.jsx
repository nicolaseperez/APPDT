import React, { useState, useEffect } from 'react';
import { X, Save, Trash2 } from 'lucide-react';

const PlayerForm = ({ selectedPlayer, onSave, onDelete, onCancel, onClose }) => {
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [color, setColor] = useState('bg-blue-600');

    useEffect(() => {
        if (selectedPlayer) {
            setName(selectedPlayer.name);
            setNumber(selectedPlayer.number);
            setColor(selectedPlayer.color);
        } else {
            // Defaults for new player
            setName('');
            setNumber('');
            setColor('bg-blue-600');
        }
    }, [selectedPlayer]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            id: selectedPlayer ? selectedPlayer.id : undefined,
            name,
            number: parseInt(number),
            color
        });
    };

    const colors = [
        'bg-blue-600', 'bg-red-600', 'bg-green-600', // Team colors
        'bg-yellow-500', 'bg-orange-500', 'bg-purple-600', // More team colors
        'bg-slate-900', 'bg-gray-400', 'bg-white text-black' // GK / Neutral
    ];

    return (
        <div className="bg-slate-800/80 p-4 rounded-lg border border-white/10 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">
                    {selectedPlayer ? 'Editar Jugador' : 'Crear Jugador'}
                </h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Número</label>
                    <input
                        type="number"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded p-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="10"
                        autoFocus
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nombre</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded p-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Messi"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Color</label>
                    <div className="flex flex-wrap gap-2">
                        {colors.map(c => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setColor(c)}
                                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center
                                    ${color === c ? 'border-white scale-110' : 'border-transparent opacity-70 hover:opacity-100'}
                                    ${c}
                                `}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-white/10 mt-4">
                    {selectedPlayer && (
                        <button
                            type="button"
                            onClick={() => {
                                if (window.confirm('¿Seguro que quieres eliminar a este jugador?')) {
                                    onDelete(selectedPlayer.id);
                                }
                            }}
                            className="bg-red-500/20 hover:bg-red-500/40 text-red-200 p-2 rounded flex-1 flex justify-center items-center gap-2 transition-colors"
                        >
                            <Trash2 size={16} /> Eliminar
                        </button>
                    )}
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded flex-1 flex justify-center items-center gap-2 transition-colors font-semibold shadow-lg shadow-blue-900/20"
                    >
                        <Save size={16} /> Guardar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PlayerForm;
