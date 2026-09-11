import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { isFirebaseConfigured } from '../config/firebase';
import { FirebaseSetupModal } from '../components/FirebaseSetupModal';
import { 
  Sparkles, 
  ShieldCheck, 
  Star, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  ChefHat, 
  TrendingUp, 
  Heart,
  Eye,
  EyeOff
} from 'lucide-react';

interface LoginPageProps {
  onSuccessLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccessLogin }) => {
  const { login, register, loginWithGoogle, registerWithGoogle, loginDemo } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [bakeryName, setBakeryName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFirebaseSetup, setShowFirebaseSetup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password, name || 'Confeiteira', bakeryName || 'Meu Ateliê Doce');
      }
      onSuccessLogin();
    } catch (err: any) {
      setError(err?.message || 'Erro ao realizar login. Verifique seus dados.');
    } finally {
      setLoading(false);
    }
  };

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
      onSuccessLogin();
    } catch (err: any) {
      setError(err?.message || 'Falha ao conectar com o Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    loginDemo();
    onSuccessLogin();
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'radial-gradient(circle at top left, #FFF2F4 0%, #FAF7F2 60%, #F0F7F2 100%)'
    }}>
      {/* Coluna Esquerda: Prova Social, Branding e Motivação */}
      <div style={{
        flex: '1.1',
        padding: '3.5rem 4rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRight: '1px solid var(--border-light)',
        background: 'rgba(255, 255, 255, 0.45)',
        backdropFilter: 'blur(10px)'
      }}>
        <div>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #FCD0D7 0%, #E88B9A 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              boxShadow: '0 6px 16px rgba(232, 139, 154, 0.35)'
            }}>
              🧁
            </div>
            <div>
              <span className="font-serif" style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Confeita<span style={{ color: 'var(--primary)' }}>Pro</span>
              </span>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                Precificação Inteligente & Gestão Gastronômica
              </p>
            </div>
          </div>

          {/* Chamada Principal de Conversão */}
          <div style={{ maxWidth: '520px', marginBottom: '2.5rem' }}>
            <span className="badge badge-rose" style={{ marginBottom: '0.75rem' }}>
              ✨ CHEGA DE PAGAR PARA TRABALHAR
            </span>
            <h1 className="font-serif" style={{ fontSize: '2.35rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.25, marginBottom: '1rem' }}>
              Descubra o lucro real de cada receita em menos de 2 minutos.
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
              O ConfeitaPro calcula automaticamente cada grama de leite condensado, a embalagem, a fita, o gás do forno e até a sua mão de obra, para que você nunca mais tenha prejuízo.
            </p>
          </div>

          {/* Métricas de Impacto */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
            <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-dark)' }}>+2.800</p>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Confeiteiras Lucrando</span>
            </div>
            <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--sage-700)' }}>R$ 1.4M</p>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Precificados sem Erro</span>
            </div>
            <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--amber-700)' }}>99.4%</p>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Aprovação e Suporte</span>
            </div>
          </div>

          {/* Depoimento Real de Confeiteira */}
          <div style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF6FF 100%)',
            padding: '1.25rem 1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--lavender-300)',
            maxWidth: '520px'
          }}>
            <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.5rem' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} color="#FBBF24" fill="#FBBF24" />
              ))}
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-body)', fontStyle: 'italic', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              "Eu achava que lucrava cobrando R$ 60 no meu bolo vulcão. Quando o ConfeitaPro somou o gás, a forma alta e 1h de batedeira, descobri que meu custo real era R$ 49! Ajustei para R$ 90 e vendi ainda mais com a legenda da Chef IA!"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>👩‍🍳</span>
              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'block' }}>Fernanda Dias</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ateliê Açúcar & Afeto • São Paulo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé de Segurança */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={16} color="var(--sage-700)" /> Dados 100% Criptografados
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} color="var(--primary)" /> Garantia de 7 Dias
          </span>
        </div>
      </div>

      {/* Coluna Direita: Caixa de Login e Cadastro */}
      <div style={{
        flex: '0.9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          maxWidth: '460px',
          width: '100%',
          background: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          padding: '2.25rem',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-light)'
        }}>
          {/* Seletor de Modo */}
          <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-subtle)', padding: '0.35rem', borderRadius: 'var(--radius-md)', marginBottom: '1.75rem' }}>
            <button
              type="button"
              onClick={() => setMode('login')}
              style={{
                flex: 1,
                padding: '0.6rem',
                fontSize: '0.875rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: mode === 'login' ? '#FFFFFF' : 'transparent',
                color: mode === 'login' ? 'var(--primary-dark)' : 'var(--text-muted)',
                boxShadow: mode === 'login' ? 'var(--shadow-xs)' : 'none',
                cursor: 'pointer'
              }}
            >
              Acessar Minha Conta
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              style={{
                flex: 1,
                padding: '0.6rem',
                fontSize: '0.875rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: mode === 'register' ? '#FFFFFF' : 'transparent',
                color: mode === 'register' ? 'var(--primary-dark)' : 'var(--text-muted)',
                boxShadow: mode === 'register' ? 'var(--shadow-xs)' : 'none',
                cursor: 'pointer'
              }}
            >
              Criar Conta Grátis
            </button>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
              {mode === 'login' ? 'Bem-vinda de volta! 🧁' : 'Comece a lucrar hoje! 🍰'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {mode === 'login' ? 'Entre no seu ateliê para gerenciar receitas e pedidos.' : 'Crie sua conta em 30 segundos e precifique sua primeira receita.'}
            </p>
          </div>

          {error && (
            <div style={{
              background: 'var(--primary-50)',
              color: 'var(--primary-dark)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.825rem',
              border: '1px solid var(--primary-200)',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          {/* Botão Oficial do Google */}
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
              fontWeight: 700,
              marginBottom: '1.25rem'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continuar com o Google</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>ou com e-mail</span>
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
                  <label className="form-label">Nome do Ateliê / Confeitaria</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: Doce Arte Confeitaria"
                    value={bakeryName}
                    onChange={(e) => setBakeryName(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">E-mail</label>
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
              <label className="form-label">Senha</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingRight: '2.5rem' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontWeight: 700 }}
            >
              {loading ? 'Entrando...' : mode === 'login' ? 'Entrar no Sistema' : 'Concluir Cadastro & Começar'}
            </button>
          </form>

          {/* Acesso Modo Demonstração */}
          <div style={{
            background: 'var(--amber-50)',
            padding: '0.85rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--amber-300)',
            textAlign: 'center',
            marginTop: '1.25rem'
          }}>
            <p style={{ fontSize: '0.775rem', color: 'var(--amber-700)', marginBottom: '0.4rem' }}>
              Quer apenas conhecer a plataforma antes de se cadastrar?
            </p>
            <button
              type="button"
              onClick={handleDemo}
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', borderColor: 'var(--amber-300)', color: 'var(--amber-700)', background: '#FFF' }}
            >
              <Sparkles size={14} color="var(--amber-500)" />
              <span>Entrar como Visitante no Modo Demo</span>
            </button>
          </div>
        </div>
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
