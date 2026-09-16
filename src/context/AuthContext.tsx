import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserPlan } from '../types';
import { INITIAL_USER } from '../data/initialData';
import { auth, db, googleProvider, isFirebaseConfigured } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import confetti from 'canvas-confetti';
import { hashPasswordSecurely, validatePasswordPolicy } from '../utils/security';

export const ADMIN_EMAIL = 'nicolas.vendrami@gmail.com';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isPro: boolean;
  isMaster: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string, bakery: string) => Promise<void>;
  resendVerificationEmail: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  registerWithGoogle: (bakeryName?: string) => Promise<void>;
  loginDemo: () => void;
  logout: () => Promise<void>;
  upgradePlan: (plan: UserPlan) => void;
  cancelSubscription: () => void;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'confeitapro_user_profile';
const LOCAL_STORAGE_AUTH_DB_KEY = 'docelucro_secure_users_vault';

function getLocalUsersVault(): Record<string, { email: string; name: string; bakery: string; passwordHash: string; isVerified: boolean }> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_AUTH_DB_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalUsersVault(vault: Record<string, any>) {
  localStorage.setItem(LOCAL_STORAGE_AUTH_DB_KEY, JSON.stringify(vault));
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return null;
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
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          if (!firebaseUser.emailVerified && firebaseUser.providerData.some(p => p.providerId === 'password')) {
            setUser(null);
            return; 
          }

          // 🚀 BUSCA OS DADOS REAIS DO FIRESTORE
          let firestoreData: any = null;
          if (db) {
            try {
              const docRef = doc(db, 'users', firebaseUser.uid);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                firestoreData = docSnap.data();
              }
            } catch (err) {
              console.warn("Erro ao buscar dados do Firestore, usando fallback local:", err);
            }
          }

          setUser((prev) => {
            const finalName = firestoreData?.name || firebaseUser.displayName || prev?.displayName || 'Confeiteira';
            const defaultBakery = finalName !== 'Confeiteira' ? `Ateliê de ${finalName.split(' ')[0]}` : 'Meu Ateliê Doce';

            return {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: finalName,
              bakeryName: firestoreData?.bakeryName || prev?.bakeryName || defaultBakery,
              hourlyLaborRate: firestoreData?.hourlyLaborRate || prev?.hourlyLaborRate || 28,
              monthlyHoursTarget: firestoreData?.monthlyHoursTarget || prev?.monthlyHoursTarget || 140,
              plan: firestoreData?.plan || prev?.plan || 'free',
              isDemo: false,
              isEmailVerified: firebaseUser.emailVerified
            };
          });
        } else {
          setUser(null);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const isPro = user?.plan === 'pro' || user?.plan === 'master';
  const isMaster = user?.plan === 'master';
  const isAdmin = Boolean(user?.email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase());

  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const normalizedEmail = email.toLowerCase().trim();
      const now = new Date().toISOString();

      if (isFirebaseConfigured && auth) {
        const cred = await signInWithEmailAndPassword(auth, normalizedEmail, pass);
        if (!cred.user.emailVerified) {
          await signOut(auth);
          throw new Error('Sua conta ainda não foi ativada. Verifique o link de confirmação que enviamos para o seu e-mail.');
        }
      } else {
        const vault = getLocalUsersVault();
        const existing = vault[normalizedEmail];
        const inputHash = await hashPasswordSecurely(pass);

        if (existing) {
          if (existing.passwordHash !== inputHash) {
            throw new Error('Senha incorreta.');
          }
        }

        setUser({
          uid: 'user_' + (existing ? btoa(normalizedEmail).slice(0, 10) : Date.now()),
          email: normalizedEmail,
          displayName: existing ? existing.name : normalizedEmail.split('@')[0],
          bakeryName: existing ? existing.bakery : 'Ateliê ' + normalizedEmail.split('@')[0],
          hourlyLaborRate: 28,
          monthlyHoursTarget: 140,
          plan: 'free',
          isDemo: false,
          sessionStartedAt: now,
          isEmailVerified: true
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, pass: string, name: string, bakery: string) => {
    setLoading(true);
    try {
      const policy = validatePasswordPolicy(pass);
      if (!policy.isValid) {
        throw new Error(policy.message || 'A senha não atende aos requisitos.');
      }

      const normalizedEmail = email.toLowerCase().trim();

      if (isFirebaseConfigured && auth) {
        try {
          const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, pass);
          
          await updateFirebaseProfile(cred.user, { displayName: name });

          // 🚀 SALVA OS DADOS NO FIRESTORE ASSIM QUE A CONTA É CRIADA
          if (db) {
            await setDoc(doc(db, 'users', cred.user.uid), {
              email: normalizedEmail,
              name: name,
              bakeryName: bakery,
              hourlyLaborRate: 28,
              monthlyHoursTarget: 140,
              plan: 'free',
              createdAt: new Date().toISOString()
            });
          }

          auth.languageCode = 'pt-BR';
          await sendEmailVerification(cred.user);
          await signOut(auth);
        } catch (e: any) {
          if (e?.code === 'auth/email-already-in-use') {
            throw new Error('Este e-mail já está cadastrado. Tente fazer login ou use recuperar senha.');
          }
          throw e;
        }
      } else {
        const passwordHash = await hashPasswordSecurely(pass);
        const vault = getLocalUsersVault();
        vault[normalizedEmail] = { email: normalizedEmail, name, bakery, passwordHash, isVerified: true };
        saveLocalUsersVault(vault);
      }
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const normalizedEmail = email.toLowerCase().trim();
        auth.languageCode = 'pt-BR';
        const cred = await signInWithEmailAndPassword(auth, normalizedEmail, pass);
        await sendEmailVerification(cred.user);
        await signOut(auth);
      } else {
        throw new Error('Modo local: não é possível reenviar e-mails sem Firebase.');
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const now = new Date().toISOString();
      if (isFirebaseConfigured && auth && googleProvider) {
        const cred = await signInWithPopup(auth, googleProvider);
        if (cred.user) {
          // Checa se o usuário já existe no Firestore, se não, cria.
          let bakeryName = `Ateliê de ${cred.user.displayName?.split(' ')[0] || 'Confeiteira'}`;
          if (db) {
            const docRef = doc(db, 'users', cred.user.uid);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
              await setDoc(docRef, {
                email: cred.user.email,
                name: cred.user.displayName,
                bakeryName: bakeryName,
                hourlyLaborRate: 28,
                monthlyHoursTarget: 140,
                plan: 'free',
                createdAt: now
              });
            } else {
              bakeryName = docSnap.data().bakeryName;
            }
          }

          setUser((prev) => ({
            uid: cred.user.uid,
            email: cred.user.email || '',
            displayName: cred.user.displayName || 'Confeiteira Google',
            bakeryName: bakeryName,
            hourlyLaborRate: prev?.hourlyLaborRate || 28,
            monthlyHoursTarget: 140,
            plan: prev?.plan || 'free',
            isDemo: false,
            sessionStartedAt: now
          }));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const registerWithGoogle = async (bakeryName?: string) => {
    setLoading(true);
    try {
      const now = new Date().toISOString();
      if (isFirebaseConfigured && auth && googleProvider) {
        const cred = await signInWithPopup(auth, googleProvider);
        if (cred.user) {
          const finalBakery = bakeryName || `Ateliê de ${cred.user.displayName?.split(' ')[0] || 'Confeiteira'}`;
          
          if (db) {
            await setDoc(doc(db, 'users', cred.user.uid), {
              email: cred.user.email,
              name: cred.user.displayName,
              bakeryName: finalBakery,
              hourlyLaborRate: 28,
              monthlyHoursTarget: 140,
              plan: 'free',
              createdAt: now
            }, { merge: true });
          }

          setUser({
            uid: cred.user.uid,
            email: cred.user.email || '',
            displayName: cred.user.displayName || 'Confeiteira',
            bakeryName: finalBakery,
            hourlyLaborRate: 28,
            monthlyHoursTarget: 140,
            plan: 'free',
            isDemo: false,
            sessionStartedAt: now
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const loginDemo = () => {
    setUser({ ...INITIAL_USER, sessionStartedAt: new Date().toISOString() });
  };

  const logout = async () => {
    try { if (isFirebaseConfigured && auth) await signOut(auth); } catch (e) { console.error(e); }
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    localStorage.removeItem('confeitapro_pending_checkout_plan');
    setUser(null);
  };

  const cancelSubscription = () => {
    if (!user) return;
    setUser({ ...user, plan: 'free' });
    localStorage.removeItem('confeitapro_pending_checkout_plan');
  };

  const upgradePlan = (plan: UserPlan) => {
    if (!user) return;
    setUser({ ...user, plan });
    try { confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#E88B9A', '#9ECDA8', '#F3CA77'] }); } catch (e) {}
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...data });

    // Salva as alterações de perfil direto na nuvem
    if (isFirebaseConfigured && db && !user.isDemo) {
      try {
        const docRef = doc(db, 'users', user.uid);
        await setDoc(docRef, data, { merge: true });
      } catch (error) {
        console.error("Erro ao atualizar perfil no Firestore:", error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user, loading, isPro, isMaster, isAdmin,
        login, register, resendVerificationEmail, loginWithGoogle, registerWithGoogle,
        loginDemo, logout, upgradePlan, cancelSubscription, updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
};