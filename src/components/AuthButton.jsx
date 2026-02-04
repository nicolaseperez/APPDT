import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { LogIn, LogOut } from 'lucide-react';

const AuthButton = () => {
    // Note: We need to install react-firebase-hooks for easier auth state management
    const [user, loading, error] = useAuthState(auth);

    const handleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err) {
            console.error("Login failed:", err);
            alert("Login failed. Check console for details.");
        }
    };

    const handleLogout = () => {
        signOut(auth);
    };

    if (loading) {
        return <div className="text-xs text-gray-400">Loading...</div>;
    }

    if (user) {
        return (
            <div className="flex items-center gap-3 bg-white/5 p-2 rounded-lg border border-white/10">
                <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full border border-white/20" />
                <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-semibold text-white truncate">{user.displayName}</p>
                    <button onClick={handleLogout} className="flex items-center gap-1 text-[10px] text-red-400 hover:text-red-300">
                        <LogOut size={10} /> Sign Out
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-blue-900/20"
        >
            <LogIn size={16} />
            Sign in with Google
        </button>
    );
};

export default AuthButton;
