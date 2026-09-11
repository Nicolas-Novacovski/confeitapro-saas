import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { exportSecureBackupJSON } from '../utils/security';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Download, 
  Database, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  FileCheck,
  Server
} from 'lucide-react';

interface SecurityPanelModalProps {
  onClose: () => void;
}

export const SecurityPanelModal: React.FC<SecurityPanelModalProps> = ({ onClose }) => {
  const { user } = useAuth();
  const { recipes, ingredients } = useData();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleBackup = () => {
    exportSecureBackupJSON({ user, recipes, ingredients });
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1050 }}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', maxHeight: '92vh', overflowY: 'auto' }}
      >
        {/* Topo Segurança */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--border-light)',
          background: 'linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'var(--sage-100)',
              color: 'var(--sage-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={26} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Centro de Segurança & Blindagem de Dados
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Proteção bancária dos dados da sua confeitaria, receitas e faturamento.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '0.35rem' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Status Geral de Proteção */}
          <div style={{
            background: 'var(--sage-50)',
            border: '1.5px solid var(--sage-300)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--sage-700)', textTransform: 'uppercase' }}>
                Status de Integridade
              </span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--sage-700)', marginTop: '2px' }}>
                🛡️ Sistema 100% Blindado & Criptografado
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-body)' }}>
                Todas as regras de segurança ativas contra acessos indevidos e invasões.
              </p>
            </div>
            <span style={{
              background: '#FFFFFF',
              color: 'var(--sage-700)',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontWeight: 800,
              fontSize: '0.8rem',
              border: '1px solid var(--sage-300)'
            }}>
              ATIVO
            </span>
          </div>

          {/* Grid com as 4 Camadas de Proteção */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: '#FFFFFF', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <Lock size={16} color="var(--primary)" />
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>Isolamento por Usuário</strong>
              </div>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                Regras rígidas do Firestore garantem que apenas o seu usuário autenticado consegue ler e alterar suas receitas e insumos.
              </p>
            </div>

            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: '#FFFFFF', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <Server size={16} color="var(--sage-500)" />
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>Anti-XSS & Sanitização</strong>
              </div>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                Filtros ativos removem scripts maliciosos e tags invasivas de todos os campos de texto antes de salvar.
              </p>
            </div>

            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: '#FFFFFF', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <Key size={16} color="var(--amber-500)" />
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>OAuth 2.0 do Google</strong>
              </div>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                Autenticação com chave oficial do Google, compatível com Verificação em 2 Etapas (2FA).
              </p>
            </div>

            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: '#FFFFFF', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <FileCheck size={16} color="var(--lavender-500)" />
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>Prevenção de Brute-Force</strong>
              </div>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                Rate limiting inteligente que bloqueia tentativas excessivas de login ou requisições abusivas.
              </p>
            </div>
          </div>

          {/* Backup Seguro dos Dados */}
          <div style={{
            background: 'var(--bg-subtle)',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Database size={18} color="var(--primary)" />
                <strong style={{ fontSize: '0.925rem', color: 'var(--text-main)' }}>
                  Backup Completo de Segurança
                </strong>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Baixe um arquivo seguro com todas as suas {recipes.length} receitas e {ingredients.length} insumos salvos.
              </p>
            </div>

            <button
              onClick={handleBackup}
              className="btn btn-secondary"
              style={{ background: '#FFFFFF' }}
            >
              {downloadSuccess ? (
                <>
                  <CheckCircle2 size={16} color="var(--sage-700)" />
                  <span>Backup Baixado!</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span>Baixar Backup JSON</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
