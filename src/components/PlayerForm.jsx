import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Upload } from 'lucide-react';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const PlayerForm = ({ selectedPlayer, onSave, onDelete, onCancel, onClose }) => {
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [positionType, setPositionType] = useState('MED'); // ARQ, DEF, MED, DEL
    const [color, setColor] = useState('bg-blue-600');
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (selectedPlayer) {
            setName(selectedPlayer.name);
            setNumber(selectedPlayer.number);
            setColor(selectedPlayer.color);
            setPositionType(selectedPlayer.positionType || 'MED');
            setPreviewUrl(selectedPlayer.imageUrl || null);
        } else {
            // Defaults
            setName('');
            setNumber('');
            setPositionType('MED');
            setColor('bg-blue-600');
            setPreviewUrl(null);
        }
    }, [selectedPlayer]);

    const handlePositionChange = (type) => {
        setPositionType(type);
        // Auto-set color based on position (can be overridden)
        switch (type) {
            case 'ARQ': setColor('bg-yellow-500'); break;
            case 'DEF': setColor('bg-blue-600'); break;
            case 'MED': setColor('bg-blue-600'); break;
            case 'DEL': setColor('bg-red-600'); break;
            default: setColor('bg-blue-600');
        }
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
                // Upload to Firebase Storage
                // Path: player_images/{timestamp}_{filename}
                const storageRef = ref(storage, `player_images/${Date.now()}_${imageFile.name}`);
                await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(storageRef);
            } catch (err) {
                console.error("Upload failed", err);
                alert("Error al subir imagen. (¿Habilitaste Storage en Firebase Console?)");
            }
        }

        onSave({
            id: selectedPlayer ? selectedPlayer.id : undefined,
            name,
            number: parseInt(number),
            color,
            positionType,
            imageUrl
        });
        setUploading(false);
    };

    const colors = [
        'bg-blue-600', 'bg-red-600', 'bg-green-600',
        'bg-yellow-500', 'bg-orange-500', 'bg-purple-600',
        'bg-slate-900', 'bg-gray-400', 'bg-white text-black'
    ];

    const positionOptions = [
        { id: 'ARQ', label: 'Arquero' },
        { id: 'DEF', label: 'Defensor' },
        { id: 'MED', label: 'Mediocampista' },
        { id: 'DEL', label: 'Delantero' },
    ];

    return (
        <div className="bg-slate-800/80 p-4 rounded-lg border border-white/10 animate-fade-in backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">
                    {selectedPlayer ? 'Editar Jugador' : 'Crear Jugador'}
                </h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div className="flex justify-center mb-4">
                    <div className="relative group cursor-pointer w-24 h-24">
                        <input
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={`w-full h-full rounded-full border-2 border-dashed border-white/30 flex items-center justify-center overflow-hidden bg-slate-900 ${color}`}>
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center">
                                    <Upload size={24} className="mx-auto text-gray-400 mb-1" />
                                    <span className="text-[10px] text-gray-400">Subir Foto</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <div className="w-20">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Dorsal</label>
                        <input
                            type="number"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 rounded p-2 text-white focus:outline-none focus:border-blue-500 text-center"
                            placeholder="#"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Posición</label>
                        <select
                            value={positionType}
                            onChange={(e) => handlePositionChange(e.target.value)}
                            className="w-full bg-slate-900 border border-white/10 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                        >
                            {positionOptions.map(opt => (
                                <option key={opt.id} value={opt.id}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Nombre</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded p-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Nombre / Apodo"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Color de Camiseta</label>
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
                        disabled={uploading}
                        className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded flex-1 flex justify-center items-center gap-2 transition-colors font-semibold shadow-lg shadow-blue-900/20 disabled:opacity-50"
                    >
                        {uploading ? 'Subiendo...' : (
                            <>
                                <Save size={16} /> Guardar
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PlayerForm;
