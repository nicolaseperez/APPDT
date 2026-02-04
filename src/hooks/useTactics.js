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
        if (!user) {
            // If logged out, maybe reset to defaults or keep local changes?
            // keeping local changes is better for seamless exp.
            return;
        }

        setLoadingConfig(true);
        const docRef = doc(db, 'users', user.uid, 'tactics', 'current');

        // Realtime listener
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            setLoadingConfig(false);
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.players) {
                    setPlayers(data.players);
                }
            } else {
                // Create default if not exists
                // Don't overwrite local if we just logged in?
                // Let's safe init.
            }
        }, (err) => {
            console.error("Firestore Error:", err);
            setLoadingConfig(false);
        });

        return () => unsubscribe();
    }, [user]);

    const saveTactics = async (currentPlayers) => {
        if (!user) {
            alert("Please sign in to save.");
            return;
        }

        try {
            await setDoc(doc(db, 'users', user.uid, 'tactics', 'current'), {
                players: currentPlayers,
                updatedAt: new Date()
            });
            // Feedback handled by UI (maybe a toast later)
        } catch (e) {
            console.error("Error saving tactics: ", e);
            alert("Error saving: " + e.message);
        }
    };

    return { players, setPlayers, saveTactics, user };
}
