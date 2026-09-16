import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

export interface FirebaseCustomConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

const LOCAL_FIREBASE_CONFIG_KEY = 'confeitapro_firebase_config';

export function getActiveFirebaseConfig(): FirebaseCustomConfig {
  // 1. Tenta carregar do localStorage (se configurado pelo Modal)
  try {
    const saved = localStorage.getItem(LOCAL_FIREBASE_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch (e) {}

  // 2. Carrega direto com as suas chaves oficiais (Ignora o erro do .env no Codespaces)
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDSyaup1TmESVHDIzKpYyI0xPCCnk0nfEs',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'projeto-saas-3ef84.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'projeto-saas-3ef84',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'projeto-saas-3ef84.firebasestorage.app',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '747807614112',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:747807614112:web:49ca8b0b18d03659d315c5'
  };
}

export function saveFirebaseCustomConfig(config: FirebaseCustomConfig) {
  localStorage.setItem(LOCAL_FIREBASE_CONFIG_KEY, JSON.stringify(config));
  window.location.reload();
}

const firebaseConfig = getActiveFirebaseConfig();

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.apiKey !== 'YOUR_FIREBASE_API_KEY' &&
  firebaseConfig.apiKey.length > 10
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    console.info('🔥 ConfeitaPro: Firebase inicializado com sucesso.');
  } catch (error) {
    console.warn('⚠️ Erro ao inicializar Firebase real:', error);
  }
} else {
  console.info('ℹ️ ConfeitaPro: Firebase aguardando credenciais para abrir popup real do Google.');
}

export { app, auth, db, googleProvider, firebaseConfig };