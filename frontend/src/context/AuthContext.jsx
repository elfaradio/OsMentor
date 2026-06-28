import { createContext, useContext, useEffect, useState } from 'react';
import {
    GoogleAuthProvider,
    RecaptchaVerifier,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPhoneNumber,
    signInWithPopup,
    signOut as firebaseSignOut,
    updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsub;
    }, []);

    // ── Google ──────────────────────────────────────────────────────────────
    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        return signInWithPopup(auth, provider);
    }

    // ── Email / Password ────────────────────────────────────────────────────
    async function signUpWithEmail(email, password, displayName) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) {
            await updateProfile(cred.user, { displayName });
        }
        return cred;
    }

    async function signInWithEmail(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    // ── Phone OTP ───────────────────────────────────────────────────────────
    function setupRecaptcha(containerId) {
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
        }
        window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
            size: 'invisible',
            callback: () => {},
        });
        return window.recaptchaVerifier;
    }

    async function sendPhoneOTP(phoneNumber, containerId) {
        const verifier = setupRecaptcha(containerId);
        const confirmation = await signInWithPhoneNumber(auth, phoneNumber, verifier);
        return confirmation;
    }

    // ── Sign out ────────────────────────────────────────────────────────────
    async function signOut() {
        if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = null;
        }
        return firebaseSignOut(auth);
    }

    const value = {
        currentUser,
        loading,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        sendPhoneOTP,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
