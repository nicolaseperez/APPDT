import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Upload, User, Hash, MapPin } from 'lucide-react';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const PlayerForm = ({ selectedPlayer, onSave, onDelete, onCancel, onClose }) => {
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [positionType, setPositionType] = useState('MED');
    const [color, setColor] = useState('bg-blue-600');
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (selectedPlayer) {
            setName(selectedPlayer.name);
            setNumber(selectedPlayer.number || '');
            setColor(selectedPlayer.color || 'bg-blue-600');
            setPositionType(selectedPlayer.positionType || 'MED');
            setPreviewUrl(selectedPlayer.imageUrl || null);
        } else {
            setName('');
            setNumber('');
            setPositionType('MED');
            setColor('bg-blue-600');
            setPreviewUrl(null);
        }
    }, [selectedPlayer]);

    const handlePositionChange = (type) => {
        setPositionType(type);
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
    };

    const handleNameChange = (val) => {
        setName(val.toUpperCase()); // Forzar mayúsculas
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImageFile(e.target.files[0]);
            setPreviewUrl(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        let imageUrl = selectedPlayer?.imageUrl || null;

        if (imageFile) {
            try {
                const storageRef = ref(storage, `player_images/${Date.now()}_${imageFile.name}`);
                await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(storageRef);
            } catch (err) {
                console.error("Upload failed", err);
                alert("Error al subir imagen.");
            }
        }

        onSave({
            id: selectedPlayer ? selectedPlayer.id : undefined,
            name: name.trim(),
            number: number ? parseInt(number) : 0,
            color,
            positionType,
            imageUrl
        });
        setUploading(false);
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
                <div className="flex flex-col items-center gap-2">
                    <div className="relative group w-28 h-28">
                        <input
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        />
                        <div className={`
                            w-full h-full rounded-3xl border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden transition-all
                            ${previewUrl ? 'border-solid border-blue-500' : 'bg-white/5 group-hover:bg-white/10'}
                        `}>
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center text-gray-500">
                                    <Upload size={32} className="mx-auto mb-1 opacity-50" />
                                    <span className="text-[10px] uppercase font-bold">Subir Foto</span>
                                </div>
                            )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-blue-600 p-1.5 rounded-xl shadow-lg border border-white/20 z-10">
                            <Upload size={14} className="text-white" />
                        </div>
                    </div>
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
                        disabled={uploading}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl flex justify-center items-center gap-2 transition-all font-bold shadow-xl shadow-blue-600/20 disabled:opacity-50 active:scale-95"
                    >
                        {uploading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>SUBIENDO...</span>
                            </div>
                        ) : (
                            <>
                                <Save size={20} />
                                <span className="uppercase">Guardar Jugador</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PlayerForm;
