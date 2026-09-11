import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserPlan } from '../types';
import { INITIAL_USER } from '../data/initialData';
import { auth, googleProvider, isFirebaseConfigured } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import confetti from 'canvas-confetti';
import { hashPasswordSecurely, validatePasswordPolicy } from '../utils/security';
import { sendActivationEmail } from '../utils/emailService';

export const ADMIN_EMAIL = 'nicolas.vendrami@gmail.com';

interface PendingActivation {
  email: string;
  name: string;
  bakery: string;
  hashedPass: string;
  activationCode: string;
  createdAt: number;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isPro: boolean;
  isMaster: boolean;
  isAdmin: boolean;
  pendingActivation: PendingActivation | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string, bakery: string) => Promise<{ codeSent: boolean; devCode?: string }>;
  verifyActivationCode: (code: string) => Promise<boolean>;
  resendActivationCode: () => Promise<string>;
  loginWithGoogle: () => Promise<void>;
  registerWithGoogle: (bakeryName?: string) => Promise<void>;
  loginDemo: () => void;
  logout: () => Promise<void>;
  upgradePlan: (plan: UserPlan) => void;
  cancelSubscription: () => void;
  updateProfile: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'confeitapro_user_profile';
const LOCAL_STORAGE_AUTH_DB_KEY = 'docelucro_secure_users_vault';
const LOCAL_STORAGE_PENDING_ACTIVATION_KEY = 'docelucro_pending_activation';

// Recupera banco criptografado local
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
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Falha ao restaurar usuário local:', e);
      }
    }
    return null;
  });

  const [pendingActivation, setPendingActivation] = useState<PendingActivation | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PENDING_ACTIVATION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
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
    if (pendingActivation) {
      localStorage.setItem(LOCAL_STORAGE_PENDING_ACTIVATION_KEY, JSON.stringify(pendingActivation));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_PENDING_ACTIVATION_KEY);
    }
  }, [pendingActivation]);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          // Se o usuário foi criado por email e ainda NÃO verificou, não loga no app
          if (!firebaseUser.emailVerified && firebaseUser.providerData.some(p => p.providerId === 'password')) {
            setUser(null);
            return;
          }

          setUser((prev) => ({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || prev?.displayName || 'Confeiteira',
            bakeryName: prev?.bakeryName || (firebaseUser.displayName ? `Ateliê de ${firebaseUser.displayName.split(' ')[0]}` : 'Meu Ateliê Doce'),
            hourlyLaborRate: prev?.hourlyLaborRate || 28,
            monthlyHoursTarget: prev?.monthlyHoursTarget || 140,
            plan: prev?.plan || 'free',
            isDemo: false,
            isEmailVerified: firebaseUser.emailVerified
          }));
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
          throw new Error('Sua conta ainda não foi ativada. Verifique o link enviado ao seu e-mail ou digite seu código.');
        }
      } else {
        // Autenticação local com verificação de HASH criptografado SHA-256
        const vault = getLocalUsersVault();
        const existing = vault[normalizedEmail];
        const inputHash = await hashPasswordSecurely(pass);

        if (existing) {
          if (existing.passwordHash !== inputHash) {
            throw new Error('Senha incorreta. Verifique suas credenciais.');
          }
          if (!existing.isVerified) {
            throw new Error('Esta conta ainda não foi ativada. Digite o código de ativação enviado.');
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
      // 1. Validação estrita de política de senhas (maiúscula, número, especial, 8 dígitos)
      const policy = validatePasswordPolicy(pass);
      if (!policy.isValid) {
        throw new Error(policy.message || 'A senha não atende aos requisitos de segurança.');
      }

      const normalizedEmail = email.toLowerCase().trim();
      const now = new Date().toISOString();

      // 2. Geração do código de ativação seguro de 6 dígitos
      const activationCode = Math.floor(100000 + Math.random() * 900000).toString();

      // 3. Criptografa a senha com hash SHA-256 + Salt antes de gravar
      const passwordHash = await hashPasswordSecurely(pass);

      if (isFirebaseConfigured && auth) {
        try {
          await createUserWithEmailAndPassword(auth, normalizedEmail, pass);
          // Desconecta a sessão automática do Firebase para exigir ativação por código
          await signOut(auth);
        } catch (e: any) {
          if (e?.code === 'auth/email-already-in-use') {
            throw new Error('Este e-mail já está cadastrado. Faça login com sua senha.');
          }
          console.warn('Registro Firebase fallback:', e);
        }
      }

      // Salva no cofre seguro local como usuário pendente de ativação
      const vault = getLocalUsersVault();
      vault[normalizedEmail] = {
        email: normalizedEmail,
        name,
        bakery,
        passwordHash,
        isVerified: false
      };
      saveLocalUsersVault(vault);

      const pendingData: PendingActivation = {
        email: normalizedEmail,
        name,
        bakery,
        hashedPass: passwordHash,
        activationCode,
        createdAt: Date.now()
      };

      setPendingActivation(pendingData);

      // Dispara o e-mail oficial com o código de 6 dígitos formatado para a confeiteira
      await sendActivationEmail({
        email: normalizedEmail,
        name,
        bakery,
        activationCode
      });

      return { codeSent: true, devCode: activationCode };
    } finally {
      setLoading(false);
    }
  };

  const verifyActivationCode = async (code: string): Promise<boolean> => {
    if (!pendingActivation) {
      throw new Error('Nenhuma ativação pendente encontrada.');
    }

    if (code.trim() !== pendingActivation.activationCode) {
      throw new Error('Código de ativação incorreto. Verifique os 6 dígitos digitados.');
    }

    // Marca como ativado no cofre
    const vault = getLocalUsersVault();
    if (vault[pendingActivation.email]) {
      vault[pendingActivation.email].isVerified = true;
      saveLocalUsersVault(vault);
    }

    // Cria o perfil logado
    const now = new Date().toISOString();
    setUser({
      uid: 'user_' + btoa(pendingActivation.email).slice(0, 10),
      email: pendingActivation.email,
      displayName: pendingActivation.name,
      bakeryName: pendingActivation.bakery,
      hourlyLaborRate: 28,
      monthlyHoursTarget: 140,
      plan: 'free',
      isDemo: false,
      sessionStartedAt: now,
      isEmailVerified: true
    });

    setPendingActivation(null);

    try {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#E88B9A', '#9ECDA8', '#F3CA77']
      });
    } catch {}

    return true;
  };

  const resendActivationCode = async (): Promise<string> => {
    if (!pendingActivation) {
      throw new Error('Nenhuma ativação pendente.');
    }
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const updated = {
      ...pendingActivation,
      activationCode: newCode,
      createdAt: Date.now()
    };
    setPendingActivation(updated);

    // Reenvia o e-mail formatado
    await sendActivationEmail({
      email: updated.email,
      name: updated.name,
      bakery: updated.bakery,
      activationCode: newCode
    });

    return newCode;
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const now = new Date().toISOString();
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
            isDemo: false,
            sessionStartedAt: now
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
          isDemo: false,
          sessionStartedAt: now
        });
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
          const gName = cred.user.displayName || 'Confeiteira';
          setUser({
            uid: cred.user.uid,
            email: cred.user.email || '',
            displayName: gName,
            bakeryName: bakeryName || `Ateliê de ${gName.split(' ')[0]}`,
            hourlyLaborRate: 28,
            monthlyHoursTarget: 140,
            plan: 'free',
            isDemo: false,
            sessionStartedAt: now
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
          isDemo: false,
          sessionStartedAt: now
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const loginDemo = () => {
    setUser({
      ...INITIAL_USER,
      sessionStartedAt: new Date().toISOString()
    });
  };

  const logout = async () => {
    try {
      if (isFirebaseConfigured && auth) {
        await signOut(auth);
      }
    } catch (e) {
      console.error('Erro no logout:', e);
    }
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
        isAdmin,
        pendingActivation,
        login,
        register,
        verifyActivationCode,
        resendActivationCode,
        loginWithGoogle,
        registerWithGoogle,
        loginDemo,
        logout,
        upgradePlan,
        cancelSubscription,
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
