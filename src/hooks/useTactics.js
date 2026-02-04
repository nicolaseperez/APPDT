import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

export function useTactics(initialPlayers) {
    const [user] = useAuthState(auth);
    const [players, setPlayers] = useState(initialPlayers);
    const [loadingConfig, setLoadingConfig] = useState(false);

    useEffect(() => {
        if (!user) return;

        setLoadingConfig(true);
        const docRef = doc(db, 'users', user.uid, 'tactics', 'current');

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            setLoadingConfig(false);
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.players) {
                    // Sanar los datos al traerlos (asegurar campos por defecto)
                    const sanitized = data.players.map(p => ({
                        ...p,
                        locked: p.locked || false,
                        imageUrl: p.imageUrl || null,
                        number: p.number || 0,
                        name: p.name || 'JUGADOR',
                        positionType: p.positionType || 'MED',
                        color: p.color || 'bg-blue-600'
                    }));
                    setPlayers(sanitized);
                }
            }
        }, (err) => {
            console.error("Firestore Error:", err);
            setLoadingConfig(false);
        });

        return () => unsubscribe();
    }, [user]);

    const saveTactics = async (currentPlayers) => {
        if (!user) {
            alert("Inicia sesión para guardar tus cambios.");
            return;
        }

        try {
            // Limpiar datos antes de enviar a Firestore (reemplazar undefined por null)
            const cleanPlayers = currentPlayers.map(p => ({
                id: p.id || `p${Date.now()}`,
                name: p.name || '',
                number: p.number || 0,
                x: p.x || 50,
                y: p.y || 50,
                color: p.color || 'bg-blue-600',
                positionType: p.positionType || 'MED',
                imageUrl: p.imageUrl || null,
                locked: p.locked || false
            }));

            await setDoc(doc(db, 'users', user.uid, 'tactics', 'current'), {
                players: cleanPlayers,
                updatedAt: new Date()
            });
        } catch (e) {
            console.error("Error saving tactics: ", e);
            alert("Error al guardar: " + e.message);
        }
    };

    return { players, setPlayers, saveTactics, user };
}
