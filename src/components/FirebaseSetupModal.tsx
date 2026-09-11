import React, { useState } from 'react';
import { saveFirebaseCustomConfig, getActiveFirebaseConfig } from '../config/firebase';
import { X, Key, ShieldCheck, HelpCircle, Check, AlertTriangle, ExternalLink } from 'lucide-react';

interface FirebaseSetupModalProps {
  onClose: () => void;
  onConfigured?: () => void;
}

export const FirebaseSetupModal: React.FC<FirebaseSetupModalProps> = ({ onClose, onConfigured }) => {
  const current = getActiveFirebaseConfig();

  const [apiKey, setApiKey] = useState(current.apiKey || '');
  const [authDomain, setAuthDomain] = useState(current.authDomain || '');
  const [projectId, setProjectId] = useState(current.projectId || '');
  const [appId, setAppId] = useState(current.appId || '');
  const [rawSnippet, setRawSnippet] = useState('');
  const [activeTab, setActiveTab] = useState<'paste' | 'fields'>('paste');
  const [error, setError] = useState<string | null>(null);

  // Tenta extrair os campos automaticamente de qualquer texto/código colado do console do Firebase
  const handleParseSnippet = (text: string) => {
    setRawSnippet(text);
    setError(null);

    try {
      const extract = (key: string) => {
        const match = text.match(new RegExp(`${key}["']?\\s*:\\s*["']([^"']+)["']`));
        return match ? match[1] : '';
      };

      const foundApiKey = extract('apiKey');
      const foundAuthDomain = extract('authDomain');
      const foundProjectId = extract('projectId');
      const foundAppId = extract('appId');

      if (foundApiKey) setApiKey(foundApiKey);
      if (foundAuthDomain) setAuthDomain(foundAuthDomain);
      if (foundProjectId) setProjectId(foundProjectId);
      if (foundAppId) setAppId(foundAppId);
    } catch (e) {}
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey || !projectId) {
      setError('Por favor, informe pelo menos a apiKey e o projectId do seu Firebase!');
      return;
    }

    saveFirebaseCustomConfig({
      apiKey: apiKey.trim(),
      authDomain: (authDomain || `${projectId}.firebaseapp.com`).trim(),
      projectId: projectId.trim(),
      appId: appId.trim()
    });

    if (onConfigured) onConfigured();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '580px', maxHeight: '92vh', overflowY: 'auto' }}
      >
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-light)',
          background: 'linear-gradient(135deg, #FEF9EE 0%, #FFFDF9 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🔥</span>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Conectar seu Firebase para Login com Google Real
              </h2>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                Necessário para o Google abrir a janela oficial (@gmail.com) no seu navegador.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '0.35rem' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{
            background: 'var(--amber-50)',
            border: '1px solid var(--amber-300)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            fontSize: '0.8rem',
            color: 'var(--amber-700)',
            lineHeight: 1.5
          }}>
            <p style={{ fontWeight: 700, marginBottom: '0.25rem' }}>
              ℹ️ Por que isso é obrigatório para o Google funcionar de verdade?
            </p>
            O Google não permite autenticação em sites sem um projeto oficial cadastrado no Google Cloud / Firebase. 
            Você pode criar um projeto grátis em 1 minuto no{' '}
            <a 
              href="https://console.firebase.google.com/" 
              target="_blank" 
              rel="noreferrer"
              style={{ color: 'var(--amber-700)', fontWeight: 700, textDecoration: 'underline' }}
            >
              Firebase Console <ExternalLink size={12} style={{ display: 'inline' }} />
            </a>, ativar o provedor <strong>Google</strong> em <em>Authentication</em> e colar suas chaves abaixo.
          </div>

          {error && (
            <div style={{
              background: 'var(--primary-50)',
              color: 'var(--primary-dark)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.825rem',
              border: '1px solid var(--primary-200)'
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`btn btn-sm ${activeTab === 'paste' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Colar Código Completo do Firebase
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('fields')}
              className={`btn btn-sm ${activeTab === 'fields' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Preencher Campos Separados
            </button>
          </div>

          {activeTab === 'paste' ? (
            <div className="form-group">
              <label className="form-label">
                Cole aqui o trecho <code>const firebaseConfig = &#123; ... &#125;</code> do seu Firebase:
              </label>
              <textarea
                className="form-textarea"
                rows={5}
                placeholder={`const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "meu-projeto.firebaseapp.com",
  projectId: "meu-projeto",
  ...
};`}
                value={rawSnippet}
                onChange={(e) => handleParseSnippet(e.target.value)}
              />

              {apiKey && projectId && (
                <div style={{
                  background: 'var(--sage-50)',
                  border: '1px solid var(--sage-300)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.8rem',
                  color: 'var(--sage-700)',
                  marginTop: '0.5rem'
                }}>
                  ✓ Chaves identificadas com sucesso: <strong>{projectId}</strong>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="form-group">
                <label className="form-label">API Key (apiKey)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Auth Domain (authDomain)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="seu-projeto.firebaseapp.com"
                  value={authDomain}
                  onChange={(e) => setAuthDomain(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Project ID (projectId)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="seu-projeto"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="button" onClick={handleSave} className="btn btn-sage">
              <Check size={16} />
              <span>Salvar & Ativar Login Real do Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
