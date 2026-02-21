import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

export function useTactics(initialPlayers) {
    const [user] = useAuthState(auth);
    const searchParams = new URLSearchParams(window.location.search);
    const sharedUid = searchParams.get('uid');

    // Si hay un sharedUid en la URL, usamos ese. Si no, usamos el del usuario logueado.
    const targetUid = sharedUid || user?.uid;
    const isReadOnly = !!sharedUid && sharedUid !== user?.uid;

    const [players, setPlayers] = useState(initialPlayers);
    const [teamColor, setTeamColor] = useState('bg-blue-600');
    const [gkColor, setGkColor] = useState('bg-yellow-500');
    const [loadingConfig, setLoadingConfig] = useState(false);

    useEffect(() => {
        if (!targetUid) return;

        setLoadingConfig(true);
        const docRef = doc(db, 'users', targetUid, 'tactics', 'current');

        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            setLoadingConfig(false);
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.players) {
                    const sanitized = data.players.map(p => ({
                        ...p,
                        locked: p.locked || false,
                        imageUrl: p.imageUrl || null,
                        number: p.number || 0,
                        name: p.name || 'JUGADOR',
                        positionType: p.positionType || (p.name?.toUpperCase() === 'GK' ? 'ARQ' : 'MED'),
                        color: p.color || 'bg-blue-600',
                        onField: p.onField ?? true,
                        isConfirmed: p.isConfirmed ?? (p.onField ?? true)
                    }));
                    setPlayers(sanitized);
                }
                if (data.teamColor) setTeamColor(data.teamColor);
                if (data.gkColor) setGkColor(data.gkColor);
            }
        }, (err) => {
            console.error("Firestore Error:", err);
            setLoadingConfig(false);
        });

        return () => unsubscribe();
    }, [targetUid, user]); // Added user to dependencies to re-run if user changes and targetUid might change

    const saveTactics = async (currentPlayers) => {
        if (isReadOnly) return;
        if (!user) {
            alert("Inicia sesión para guardar tus cambios.");
            return;
        }

        try {
            const cleanPlayers = currentPlayers.map(p => ({
                id: p.id || `p${Date.now()}`,
                name: p.name || '',
                number: p.number || 0,
                x: p.x ?? 50,
                y: p.y ?? 50,
                color: p.color || 'bg-blue-600',
                positionType: p.positionType || 'MED',
                imageUrl: p.imageUrl || null,
                locked: p.locked || false,
                onField: p.onField ?? false,
                isConfirmed: p.isConfirmed ?? p.onField ?? false
            }));

            await setDoc(doc(db, 'users', user.uid, 'tactics', 'current'), {
                players: cleanPlayers,
                teamColor,
                gkColor,
                updatedAt: new Date()
            });
        } catch (e) {
            console.error("Error saving tactics: ", e);
            alert("Error al guardar: " + e.message);
        }
    };

    return { players, setPlayers, teamColor, setTeamColor, gkColor, setGkColor, saveTactics, user, isReadOnly: false, error: null };
}
