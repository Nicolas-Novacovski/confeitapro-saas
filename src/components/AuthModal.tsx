import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { isFirebaseConfigured } from '../config/firebase';
import { FirebaseSetupModal } from './FirebaseSetupModal';
import { X, LogIn, UserPlus, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { user, login, register, loginWithGoogle, registerWithGoogle, loginDemo, logout } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [bakeryName, setBakeryName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, name || 'Confeiteira', bakeryName || 'Meu Doce Ateliê');
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Falha ao autenticar. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const [showFirebaseSetup, setShowFirebaseSetup] = useState(false);

  const handleGoogleAuth = async () => {
    setError(null);

    if (!isFirebaseConfigured) {
      setShowFirebaseSetup(true);
      return;
    }

    setLoading(true);
    try {
      if (mode === 'register') {
        await registerWithGoogle(bakeryName || undefined);
      } else {
        await loginWithGoogle();
      }
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Falha na autenticação com o Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    loginDemo();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px', maxHeight: '92vh', overflowY: 'auto' }}
      >
        {/* Topo com abas */}
        <div style={{
          background: 'var(--bg-canvas)',
          padding: '1.5rem 1.75rem 1rem',
          borderBottom: '1px solid var(--border-light)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backdropFilter: 'blur(8px)'
        }}>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.4rem' }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.75rem' }}>🧁</span>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {user ? 'Sua Conta no DoceLucro' : (mode === 'login' ? 'Entrar no Seu Ateliê' : 'Cadastre seu Ateliê Grátis')}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {user ? 'Gerencie seu perfil e dados' : 'Acesse suas receitas e relatórios de onde estiver.'}
              </p>
            </div>
          </div>

          {!user && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setMode('login')}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: mode === 'login' ? '#FFFFFF' : 'transparent',
                  color: mode === 'login' ? 'var(--primary-dark)' : 'var(--text-muted)',
                  boxShadow: mode === 'login' ? 'var(--shadow-xs)' : 'none',
                  cursor: 'pointer'
                }}
              >
                Entrar com Conta Existente
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: mode === 'register' ? '#FFFFFF' : 'transparent',
                  color: mode === 'register' ? 'var(--primary-dark)' : 'var(--text-muted)',
                  boxShadow: mode === 'register' ? 'var(--shadow-xs)' : 'none',
                  cursor: 'pointer'
                }}
              >
                Cadastrar Nova Conta
              </button>
            </div>
          )}
        </div>

        {user ? (
          <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{
              background: 'var(--bg-subtle)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Conectado como:</p>
              <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {user.displayName}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-body)' }}>{user.email}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ateliê: <strong>{user.bakeryName}</strong></p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <span className={`badge ${user.plan === 'pro' || user.plan === 'master' ? 'badge-pro' : 'badge-rose'}`}>
                  Plano {user.plan.toUpperCase()}
                </span>
                {user.isDemo && (
                  <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                    Modo Demonstração
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={async () => {
                await logout();
                onClose();
              }}
              className="btn btn-secondary"
              style={{ width: '100%', color: '#CA5F71' }}
            >
              Sair da Conta
            </button>
          </div>
        ) : (
          <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (
              <div style={{
                background: 'var(--primary-50)',
                color: 'var(--primary-dark)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.825rem',
                border: '1px solid var(--primary-200)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* BOTÃO GOOGLE DESTACADO */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="btn btn-secondary"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  gap: '0.75rem',
                  border: '1.5px solid #CBD5E1',
                  boxShadow: 'var(--shadow-xs)',
                  fontSize: '0.925rem',
                  fontWeight: 700
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>
                  {mode === 'login' ? 'Entrar com Conta do Google' : 'Cadastrar com Conta do Google'}
                </span>
              </button>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                Acesso rápido em 1 clique com sua conta Gmail / Google
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.25rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>ou com e-mail e senha</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {mode === 'register' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Seu Nome Completo</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ex: Mariana Silva"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nome do seu Ateliê / Doceira</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ex: Doce Afeto Confeitaria"
                      value={bakeryName}
                      onChange={(e) => setBakeryName(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label className="form-label">Seu E-mail</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="confeiteira@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sua Senha</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}
              >
                {loading ? 'Processando...' : mode === 'login' ? 'Entrar no Sistema' : 'Concluir Cadastro Gratuito'}
              </button>
            </form>

            {/* Acesso Imediato Modo Demo */}
            <div style={{
              background: 'var(--amber-50)',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--amber-300)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '0.775rem', color: 'var(--amber-700)' }}>
                Quer apenas testar a ferramenta sem preencher senha?
              </span>
              <button
                type="button"
                onClick={handleDemo}
                className="btn btn-secondary btn-sm"
                style={{ background: '#FFFFFF', borderColor: 'var(--amber-300)', color: 'var(--amber-700)' }}
              >
                <Sparkles size={14} color="var(--amber-500)" />
                <span>Explorar em Modo Demonstração</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {showFirebaseSetup && (
        <FirebaseSetupModal
          onClose={() => setShowFirebaseSetup(false)}
          onConfigured={() => {
            setShowFirebaseSetup(false);
            loginWithGoogle();
          }}
        />
      )}
    </div>
  );
};
