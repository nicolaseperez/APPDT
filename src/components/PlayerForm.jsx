import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Save, X } from 'lucide-react';

const PlayerForm = ({ selectedPlayer, onSave, onCancel, onDelete, onClose }) => {
    const [formData, setFormData] = useState({
        number: '',
        name: '',
        color: 'bg-blue-600'
    });

    useEffect(() => {
        if (selectedPlayer) {
            setFormData({
                number: selectedPlayer.number,
                name: selectedPlayer.name,
                color: selectedPlayer.color
            });
        } else {
            setFormData({
                number: '',
                name: '',
                color: 'bg-blue-600'
            });
        }
    }, [selectedPlayer]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, id: selectedPlayer?.id });
        if (!selectedPlayer) {
            setFormData({ number: '', name: '', color: 'bg-blue-600' }); // Reset on add
        }
    };

    const colors = [
        { name: 'Blue', value: 'bg-blue-600' },
        { name: 'Red', value: 'bg-red-600' },
        { name: 'Green', value: 'bg-green-600' },
        { name: 'Yellow', value: 'bg-yellow-500' },
        { name: 'Black', value: 'bg-gray-900' },
        { name: 'White', value: 'bg-slate-200 text-black border-2 border-gray-400' },
    ];

    return (
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">
                    {selectedPlayer ? 'Edit Player' : 'Add Player'}
                </h3>
                {onClose && (
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Number</label>
                    <input
                        type="number"
                        name="number"
                        value={formData.number}
                        onChange={handleChange}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-mono"
                        placeholder="10"
                        required
                        autoFocus
                    />
                </div>

                <div>
                    <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                        placeholder="Messi"
                        maxLength={12}
                    />
                </div>

                <div>
                    <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Color</label>
                    <div className="flex gap-2 flex-wrap">
                        {colors.map((c) => (
                            <button
                                key={c.value}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, color: c.value }))}
                                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${c.value} ${formData.color === c.value ? 'border-white scale-110 ring-2 ring-white/50' : 'border-transparent'}`}
                                title={c.name}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex gap-2 pt-2">
                    <button
                        type="submit"
                        className="flex-1 bg-green-600 hover:bg-green-500 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-900/20"
                    >
                        <Save size={18} />
                        {selectedPlayer ? 'Update' : 'Add'}
                    </button>

                    {selectedPlayer && (
                        <button
                            type="button"
                            onClick={() => onDelete(selectedPlayer.id)}
                            className="flex-none bg-red-600/20 hover:bg-red-600 border border-red-500/50 text-red-100 hover:text-white p-2 rounded-lg transition-all"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}

                    {selectedPlayer && onCancel && (
                        <button type="button" onClick={onCancel} className="flex-none bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-all">
                            <X size={18} />
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default PlayerForm;
