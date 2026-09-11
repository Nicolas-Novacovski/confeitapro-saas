import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserPlan } from '../types';
import { INITIAL_USER } from '../data/initialData';
import { auth, googleProvider, isFirebaseConfigured } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import confetti from 'canvas-confetti';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isPro: boolean;
  isMaster: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string, bakery: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  registerWithGoogle: (bakeryName?: string) => Promise<void>;
  loginDemo: () => void;
  logout: () => Promise<void>;
  upgradePlan: (plan: UserPlan) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'confeitapro_user_profile';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Falha ao restaurar usuário local:', e);
      }
    }
    return INITIAL_USER;
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser((prev) => ({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || prev?.displayName || 'Confeiteira',
            bakeryName: prev?.bakeryName || (firebaseUser.displayName ? `Ateliê de ${firebaseUser.displayName.split(' ')[0]}` : 'Meu Ateliê Doce'),
            hourlyLaborRate: prev?.hourlyLaborRate || 28,
            monthlyHoursTarget: prev?.monthlyHoursTarget || 140,
            plan: prev?.plan || 'free',
            isDemo: false
          }));
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const isPro = user?.plan === 'pro' || user?.plan === 'master';
  const isMaster = user?.plan === 'master';

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        await signInWithEmailAndPassword(auth, email, pass);
      } else {
        setUser({
          uid: 'user_' + Date.now(),
          email,
          displayName: email.split('@')[0],
          bakeryName: 'Ateliê ' + email.split('@')[0],
          hourlyLaborRate: 28,
          monthlyHoursTarget: 140,
          plan: 'free',
          isDemo: false
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, pass: string, name: string, bakery: string) => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        setUser({
          uid: cred.user.uid,
          email,
          displayName: name,
          bakeryName: bakery,
          hourlyLaborRate: 28,
          monthlyHoursTarget: 140,
          plan: 'free',
          isDemo: false
        });
      } else {
        setUser({
          uid: 'user_' + Date.now(),
          email,
          displayName: name,
          bakeryName: bakery,
          hourlyLaborRate: 28,
          monthlyHoursTarget: 140,
          plan: 'free',
          isDemo: false
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth && googleProvider) {
        const cred = await signInWithPopup(auth, googleProvider);
        if (cred.user) {
          const gName = cred.user.displayName || 'Confeiteira Google';
          setUser((prev) => ({
            uid: cred.user.uid,
            email: cred.user.email || '',
            displayName: gName,
            bakeryName: prev?.bakeryName || `Ateliê de ${gName.split(' ')[0]}`,
            hourlyLaborRate: prev?.hourlyLaborRate || 28,
            monthlyHoursTarget: 140,
            plan: prev?.plan || 'free',
            isDemo: false
          }));
        }
      } else {
        // Fallback local Google
        setUser({
          uid: 'google_user_' + Date.now(),
          email: 'confeiteira.google@gmail.com',
          displayName: 'Camila Doces',
          bakeryName: 'Ateliê Gourmet da Camila',
          hourlyLaborRate: 28,
          monthlyHoursTarget: 140,
          plan: 'free',
          isDemo: false
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const registerWithGoogle = async (bakeryName?: string) => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth && googleProvider) {
        const cred = await signInWithPopup(auth, googleProvider);
        if (cred.user) {
          const gName = cred.user.displayName || 'Confeiteira';
          setUser({
            uid: cred.user.uid,
            email: cred.user.email || '',
            displayName: gName,
            bakeryName: bakeryName || `Ateliê de ${gName.split(' ')[0]}`,
            hourlyLaborRate: 28,
            monthlyHoursTarget: 140,
            plan: 'free',
            isDemo: false
          });
        }
      } else {
        setUser({
          uid: 'google_user_' + Date.now(),
          email: 'confeiteira.google@gmail.com',
          displayName: 'Camila Doces',
          bakeryName: bakeryName || 'Ateliê Gourmet da Camila',
          hourlyLaborRate: 28,
          monthlyHoursTarget: 140,
          plan: 'free',
          isDemo: false
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const loginDemo = () => {
    setUser(INITIAL_USER);
  };

  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    setUser(null);
  };

  const upgradePlan = (plan: UserPlan) => {
    if (!user) return;
    setUser({ ...user, plan });

    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#E88B9A', '#9ECDA8', '#F3CA77', '#C2B3E4']
      });
    } catch (e) {}
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...data });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isPro,
        isMaster,
        login,
        register,
        loginWithGoogle,
        registerWithGoogle,
        loginDemo,
        logout,
        upgradePlan,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
