import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { isFirebaseConfigured } from '../config/firebase';
import { STRIPE_PLANS, getSavedStripeLinks, saveStripeLinks } from '../config/stripe';
import { formatCurrencyBRL } from '../utils/formatters';
import { 
  Save, 
  Crown, 
  Database, 
  CreditCard, 
  Copy, 
  Check, 
  User, 
  ExternalLink,
  Link2
} from 'lucide-react';

interface SettingsPageProps {
  onOpenPricing: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onOpenPricing }) => {
  const { user, updateProfile, isPro, cancelSubscription } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bakeryName, setBakeryName] = useState(user?.bakeryName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [pixKey, setPixKey] = useState(user?.pixKey || '');
  const [hourlyRate, setHourlyRate] = useState<number>(user?.hourlyLaborRate || 25);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  // Links do Stripe
  const [stripeLinks, setStripeLinks] = useState(getSavedStripeLinks());
  const [stripeSavedSuccess, setStripeSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName,
      bakeryName,
      phone,
      pixKey,
      hourlyLaborRate: Number(hourlyRate)
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveStripeLinks = (e: React.FormEvent) => {
    e.preventDefault();
    saveStripeLinks(stripeLinks);
    setStripeSavedSuccess(true);
    setTimeout(() => setStripeSavedSuccess(false), 3000);
  };

  const envSample = `# Arquivo .env para o ConfeitaPro SaaS
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# Stripe Checkout
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_suachavepublica
VITE_STRIPE_PAYMENT_LINK_PRO=https://buy.stripe.com/test_confeitapro_pro
VITE_STRIPE_PAYMENT_LINK_MASTER=https://buy.stripe.com/test_confeitapro_master

# Google Gemini IA
VITE_GEMINI_API_KEY=sua_chave_gemini_aqui`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(envSample);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '900px' }}>
      
      <div>
        <h1 className="font-serif" style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
          Configurações do Ateliê & SaaS
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Personalize os dados da sua confeitaria, acompanhe sua assinatura e configure links de checkout do Stripe.
        </p>
      </div>

      {/* Cartão de Dados do Perfil */}
      <form onSubmit={handleSave} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} color="var(--primary)" />
            <span>Dados da Confeitaria & Orçamentos</span>
          </h2>
          {savedSuccess && (
            <span style={{ fontSize: '0.85rem', color: 'var(--sage-700)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Check size={16} /> Salvo com sucesso!
            </span>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Nome da Confeiteira / Chef</label>
            <input
              type="text"
              className="form-input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Ex: Mariana Silva"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nome Comercial do Ateliê / Doceira</label>
            <input
              type="text"
              className="form-input"
              value={bakeryName}
              onChange={(e) => setBakeryName(e.target.value)}
              placeholder="Ex: Doce Arte Confeitaria"
            />
          </div>

          <div className="form-group">
            <label className="form-label">WhatsApp de Contato para Clientes</label>
            <input
              type="text"
              className="form-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 98765-4321"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Chave Pix para Recebimento de Sinal</label>
            <input
              type="text"
              className="form-input"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              placeholder="email, cpf ou telefone pix"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Valor Padrão da Hora Trabalhada (R$/h)</label>
            <input
              type="number"
              step="0.50"
              min="5"
              className="form-input"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button type="submit" className="btn btn-primary">
            <Save size={16} />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </form>

      {/* Gestão da Assinatura Stripe */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={18} color="var(--lavender-500)" />
            <span>Assinatura Mensal & Checkout Stripe</span>
          </h2>
          <span className={`badge ${isPro ? 'badge-pro' : 'badge-rose'}`}>
            Plano {user?.plan.toUpperCase()}
          </span>
        </div>

        <div style={{
          background: 'var(--bg-canvas)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {STRIPE_PLANS[user?.plan || 'free'].name}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {STRIPE_PLANS[user?.plan || 'free'].tagline}
            </p>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.25rem' }}>
              Mensalidade: {formatCurrencyBRL(STRIPE_PLANS[user?.plan || 'free'].priceMonthly)}/mês
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={onOpenPricing} className="btn btn-pro">
              <Crown size={16} />
              <span>{isPro ? 'Alterar Plano' : 'Fazer Upgrade para o Pro'}</span>
            </button>
            {isPro && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Deseja realmente cancelar sua assinatura do ConfeitaPro e cortar qualquer cobrança futura do Stripe? Você voltará ao plano Grátis.')) {
                    cancelSubscription();
                    alert('Sua assinatura foi cancelada. Cobrança interrompida.');
                  }
                }}
                className="btn btn-secondary btn-sm"
                style={{ color: '#E11D48', borderColor: '#FECDD3', background: '#FFF1F2' }}
              >
                Cancelar Assinatura & Cortar Cobrança
              </button>
            )}
          </div>
        </div>

        {/* Configuração dos Links Diretos do Stripe Checkout */}
        <form onSubmit={handleSaveStripeLinks} style={{
          background: 'var(--bg-subtle)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Link2 size={18} color="var(--lavender-500)" />
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                Links Diretos de Checkout do Stripe (Payment Links)
              </strong>
            </div>
            {stripeSavedSuccess && (
              <span style={{ fontSize: '0.8rem', color: 'var(--sage-700)', fontWeight: 600 }}>
                ✓ Links salvos com sucesso!
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.8rem' }}>
              Link de Checkout Plano Confeiteira Pro (R$ 29,90/mês)
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="https://buy.stripe.com/..."
                value={stripeLinks.pro}
                onChange={(e) => setStripeLinks({ ...stripeLinks, pro: e.target.value })}
              />
              <button
                type="button"
                onClick={() => window.open(stripeLinks.pro, '_blank')}
                className="btn btn-secondary btn-sm"
                title="Testar link no Stripe"
              >
                <ExternalLink size={15} />
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '0.8rem' }}>
              Link de Checkout Plano Ateliê Master (R$ 49,90/mês)
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="https://buy.stripe.com/..."
                value={stripeLinks.master}
                onChange={(e) => setStripeLinks({ ...stripeLinks, master: e.target.value })}
              />
              <button
                type="button"
                onClick={() => window.open(stripeLinks.master, '_blank')}
                className="btn btn-secondary btn-sm"
                title="Testar link no Stripe"
              >
                <ExternalLink size={15} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-secondary btn-sm">
              <Save size={14} />
              <span>Salvar Links do Stripe</span>
            </button>
          </div>
        </form>
      </div>

      {/* Status das Integrações Técnicas */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Database size={18} color="var(--sage-700)" />
          <span>Status das Integrações (Firebase, Stripe & Gemini IA)</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {/* Firebase */}
          <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: isFirebaseConfigured ? 'var(--sage-50)' : 'var(--amber-50)', border: `1px solid ${isFirebaseConfigured ? 'var(--sage-300)' : 'var(--amber-300)'}` }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isFirebaseConfigured ? 'var(--sage-700)' : 'var(--amber-700)' }}>
              FIREBASE
            </span>
            <p style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: '4px' }}>
              {isFirebaseConfigured ? '🔥 Conectado em Nuvem' : '💾 Modo Local / Demo'}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-body)', marginTop: '4px' }}>
              {isFirebaseConfigured ? 'Auth Google & Firestore ativos' : 'Persistência segura em LocalStorage'}
            </p>
          </div>

          {/* Stripe */}
          <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--lavender-50)', border: '1px solid var(--lavender-300)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--lavender-700)' }}>
              STRIPE
            </span>
            <p style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: '4px' }}>
              💳 Checkout Configurado
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-body)', marginTop: '4px' }}>
              Página de pagamento e simulação ativa
            </p>
          </div>

          {/* Gemini IA */}
          <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'var(--primary-50)', border: '1px solid var(--primary-200)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
              CHEF IA
            </span>
            <p style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: '4px' }}>
              ✨ Motor Ativo
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-body)', marginTop: '4px' }}>
              Diagnóstico de custos e copies de confeitaria
            </p>
          </div>
        </div>

        {/* Bloco de ajuda para .env */}
        <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Exemplo de variáveis para produção (.env)
            </span>
            <button onClick={handleCopyEnv} className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
              {copiedEnv ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedEnv ? 'Copiado!' : 'Copiar .env'}</span>
            </button>
          </div>
          <pre style={{ fontSize: '0.75rem', color: 'var(--text-body)', overflowX: 'auto', background: '#FFFFFF', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
            {envSample}
          </pre>
        </div>
      </div>
    </div>
  );
};
