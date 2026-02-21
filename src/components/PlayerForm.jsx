import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, User, Hash, MapPin, Palette } from 'lucide-react';

const PlayerForm = ({ selectedPlayer, onSave, onDelete, onCancel, onClose }) => {
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [positionType, setPositionType] = useState('MED');
    const [color, setColor] = useState('bg-blue-600');

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

    useEffect(() => {
        if (selectedPlayer) {
            setName(selectedPlayer.name);
            setNumber(selectedPlayer.number || '');
            setColor(selectedPlayer.color || 'bg-blue-600');
            setPositionType(selectedPlayer.positionType || 'MED');
        } else {
            setName('');
            setNumber('');
            setPositionType('MED');
            setColor('bg-blue-600');
        }
    }, [selectedPlayer]);

    const handlePositionChange = (type) => {
        setPositionType(type);
        // Sugerir color por defecto según posición si es un jugador nuevo
        if (!selectedPlayer) {
            switch (type) {
                case 'ARQ': setColor('bg-yellow-500'); break;
                case 'DEF':
                case 'LAT_IZQ':
                case 'LAT_DER': setColor('bg-blue-600'); break;
                case 'MED':
                case 'VOL_IZQ':
                case 'VOL_DER': setColor('bg-emerald-600'); break;
                case 'DEL': setColor('bg-red-600'); break;
                default: setColor('bg-blue-600');
            }
        }
    };

    const handleNameChange = (val) => {
        setName(val.toUpperCase()); // Forzar mayúsculas
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        onSave({
            id: selectedPlayer ? selectedPlayer.id : undefined,
            name: name.trim(),
            number: number ? parseInt(number) : 0,
            color,
            positionType,
            imageUrl: null // Eliminamos imágenes
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
                {/* Preview Jersey */}
                <div className="flex flex-col items-center gap-4 py-4 bg-white/5 rounded-3xl border border-white/5 shadow-inner">
                    <div className="relative group">
                        <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-2xl">
                            <path
                                d="M25 20 L40 10 L60 10 L75 20 L85 35 L75 45 L75 90 L25 90 L25 45 L15 35 Z"
                                className={`${color.replace('bg-', 'fill-')} transition-colors duration-500`}
                                stroke="rgba(255,255,255,0.4)"
                                strokeWidth="1"
                            />
                            <path
                                d="M40 10 C45 15 55 15 60 10"
                                fill="none"
                                stroke="rgba(255,255,255,0.8)"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center pt-2">
                            <span className="text-white font-black text-2xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                {number || '?'}
                            </span>
                        </div>
                    </div>
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Vista Previa</span>
                </div>

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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1 mb-1 block">Dorsal</label>
                            <div className="relative">
                                <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="number"
                                    value={number}
                                    onChange={(e) => setNumber(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                                    placeholder="10"
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

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1 block flex items-center gap-2">
                            <Palette size={12} /> Color de Remera
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {jerseyColors.map((c) => (
                                <button
                                    key={c.class}
                                    type="button"
                                    onClick={() => setColor(c.class)}
                                    className={`
                                        h-10 rounded-xl border-2 transition-all 
                                        ${c.class} 
                                        ${color === c.class ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105 opacity-60 hover:opacity-100'}
                                    `}
                                    title={c.name}
                                />
                            ))}
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

