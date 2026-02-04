import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { LogIn, LogOut } from 'lucide-react';

const AuthButton = () => {
    const [user, loading, error] = useAuthState(auth);

    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err) {
            console.error("Login failed:", err);
            alert("Error al iniciar sesión: " + err.message);
        }
    };

    const handleLogout = () => {
        signOut(auth);
    };

    if (loading) {
        return <div className="text-white text-xs animate-pulse">Cargando...</div>;
    }

    if (user) {
        return (
            <div className="flex items-center gap-2 bg-white/10 px-2 py-1 rounded-full border border-white/20">
                {user.photoURL && (
                    <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-6 h-6 rounded-full border border-white/30"
                    />
                )}
                <button
                    onClick={handleLogout}
                    className="text-white text-xs hover:text-red-300 transition-colors font-medium"
                >
                    Salir
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={handleLogin}
            className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg transition-transform active:scale-95 flex items-center gap-1.5"
        >
            <LogIn size={14} />
            <span>Iniciar Sesión con Google</span>
        </button>
    );
};

export default AuthButton;
