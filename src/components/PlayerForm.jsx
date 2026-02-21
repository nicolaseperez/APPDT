import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, User, Hash, MapPin, Palette } from 'lucide-react';

const PlayerForm = ({ selectedPlayer, onSave, onDelete, onCancel, onClose }) => {
    const [name, setName] = useState('');
    const [positionType, setPositionType] = useState('MED');

    useEffect(() => {
        if (selectedPlayer) {
            setName(selectedPlayer.name);
            setPositionType(selectedPlayer.positionType || 'MED');
        } else {
            setName('');
            setPositionType('MED');
        }
    }, [selectedPlayer]);

    const handlePositionChange = (type) => {
        setPositionType(type);
    };

    const handleNameChange = (val) => {
        setName(val.toUpperCase()); // Forzar mayúsculas
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        onSave({
            id: selectedPlayer ? selectedPlayer.id : undefined,
            name: name.trim(),
            number: 0, // No longer used
            positionType,
        });
    };

    const positionOptions = [
        { id: 'ARQ', label: 'Arquero' },
        { id: 'DEF', label: 'Defensor' },
        { id: 'LAT_IZQ', label: 'Lateral Izquierdo' },
        { id: 'LAT_DER', label: 'Lateral Derecho' },
        { id: 'MED', label: 'Mediocampista' },
        { id: 'VOL_IZQ', label: 'Volante Izquierdo' },
        { id: 'VOL_DER', label: 'Volante Derecho' },
        { id: 'DEL', label: 'Delantero' },
    ];

    return (
        <div className="w-full max-w-md bg-slate-900/95 backdrop-blur-2xl p-6 rounded-3xl border border-white/20 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-white flex items-center gap-2 uppercase tracking-tighter">
                    {selectedPlayer ? 'Editar Jugador' : 'Nuevo Jugador'}
                </h3>
                <button type="button" onClick={onClose} className="bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors">
                    <X size={20} className="text-white" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div className="relative">
                        <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1 mb-1 block">Nombre Completo</label>
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium uppercase"
                                placeholder="EJ: LIONEL MESSI"
                                required
                            />
                        </div>
                    </div>

                    <div className="relative">
                        <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1 mb-1 block">Posición</label>
                        <div className="relative">
                            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select
                                value={positionType}
                                onChange={(e) => handlePositionChange(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium appearance-none cursor-pointer"
                            >
                                {positionOptions.map(opt => (
                                    <option key={opt.id} value={opt.id} className="bg-slate-900">{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    {selectedPlayer && (
                        <button
                            type="button"
                            onClick={() => {
                                if (window.confirm('¿Seguro que quieres eliminar a este jugador?')) {
                                    onDelete(selectedPlayer.id);
                                }
                            }}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-4 rounded-2xl flex-shrink-0 transition-colors border border-red-500/20"
                        >
                            <Trash2 size={20} />
                        </button>
                    )}
                    <button
                        type="submit"
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl flex justify-center items-center gap-2 transition-all font-bold shadow-xl shadow-blue-600/20 active:scale-95"
                    >
                        <Save size={20} />
                        <span className="uppercase">Guardar Jugador</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PlayerForm;

