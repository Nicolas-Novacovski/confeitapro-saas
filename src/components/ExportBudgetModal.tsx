import React, { useState } from 'react';
import { Recipe, RecipeFinancials } from '../types';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrencyBRL } from '../utils/formatters';
import { X, Copy, Check, Printer, MessageCircle, FileText, Sparkles } from 'lucide-react';

interface ExportBudgetModalProps {
  recipe: Recipe;
  financials: RecipeFinancials;
  onClose: () => void;
}

export const ExportBudgetModal: React.FC<ExportBudgetModalProps> = ({
  recipe,
  financials,
  onClose
}) => {
  const { ingredientsMap } = useData();
  const { user } = useAuth();

  const [clientName, setClientName] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'ficha'>('whatsapp');

  // Mensagem pronta para o WhatsApp
  const whatsappMessage = `🧁 *ORÇAMENTO ARTESANAL - ${user?.bakeryName?.toUpperCase() || 'CONFEITARIA'}* 🧁
---------------------------------------
Olá${clientName ? ` *${clientName}*` : ''}! Tudo bem? É um prazer atender você! Segue a proposta detalhada do seu pedido:

🎂 *Produto:* ${recipe.title}
📦 *Quantidade / Rendimento:* ${recipe.yieldAmount} ${recipe.yieldUnit}
✨ *Categoria:* ${recipe.category}

${recipe.notes ? `📝 *Detalhes & Cuidados:* ${recipe.notes}\n` : ''}
💰 *Valor Total do Pedido:* ${formatCurrencyBRL(financials.suggestedSalePrice)}
${recipe.yieldAmount > 1 ? `(Valor unitário: ${formatCurrencyBRL(financials.suggestedPricePerUnit)} cada)\n` : ''}
💳 *Formas de Pagamento:*
- Chave Pix: *${user?.pixKey || 'Informe sua chave Pix'}*
- Confirmação mediante sinal de 50% para reserva de data.

⏰ *Prazo de Validade deste Orçamento:* 48 horas.
Qualquer dúvida ou personalização especial, estou totalmente à sua disposição! 🥰`;

  const handleCopy = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content modal-content-lg" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px' }}
      >
        {/* Cabeçalho */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-canvas)'
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Compartilhar & Ficha Técnica: {recipe.title}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Gere orçamentos para enviar aos clientes ou imprima a ficha de produção.
            </p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '0.35rem' }}>
            <X size={18} />
          </button>
        </div>

        {/* Abas */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          padding: '0.75rem 1.75rem',
          borderBottom: '1px solid var(--border-light)',
          background: '#FFFFFF'
        }}>
          <button
            onClick={() => setActiveTab('whatsapp')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: activeTab === 'whatsapp' ? 'var(--sage-50)' : 'transparent',
              color: activeTab === 'whatsapp' ? 'var(--sage-700)' : 'var(--text-muted)',
              fontWeight: activeTab === 'whatsapp' ? 700 : 500,
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            <MessageCircle size={16} />
            <span>Orçamento WhatsApp</span>
          </button>

          <button
            onClick={() => setActiveTab('ficha')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: activeTab === 'ficha' ? 'var(--primary-50)' : 'transparent',
              color: activeTab === 'ficha' ? 'var(--primary-dark)' : 'var(--text-muted)',
              fontWeight: activeTab === 'ficha' ? 700 : 500,
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            <FileText size={16} />
            <span>Ficha Técnica para Produção</span>
          </button>
        </div>

        <div style={{ padding: '1.5rem 1.75rem', maxHeight: '65vh', overflowY: 'auto' }}>
          {activeTab === 'whatsapp' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Nome da Cliente (Opcional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Ana Paula, Dra. Juliana..."
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>

              {/* Caixa de Visualização do WhatsApp */}
              <div style={{
                background: '#EFEAE2',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                border: '1px solid #D8D2C6',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                lineHeight: 1.5,
                color: '#111B21',
                whiteSpace: 'pre-wrap'
              }}>
                {whatsappMessage}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  onClick={handleCopy}
                  className="btn btn-sage btn-lg"
                  style={{ width: '100%' }}
                >
                  {copied ? (
                    <>
                      <Check size={18} />
                      <span>Copiado com Sucesso! Cole no WhatsApp</span>
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      <span>Copiar Mensagem Formatada</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Ficha Técnica */
            <div id="printable-ficha" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                background: '#FFFFFF',
                padding: '1.5rem',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--text-main)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{recipe.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Categoria: {recipe.category} • Rendimento: {recipe.yieldAmount} {recipe.yieldUnit}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ateliê</span>
                    <p style={{ fontWeight: 700 }}>{user?.bakeryName || 'Confeitaria Artesanal'}</p>
                  </div>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Ingredientes e Proporções</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left' }}>
                      <th style={{ padding: '0.5rem' }}>Item</th>
                      <th style={{ padding: '0.5rem' }}>Marca</th>
                      <th style={{ padding: '0.5rem' }}>Quantidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipe.ingredients.map((ing) => {
                      const item = ingredientsMap.get(ing.ingredientId);
                      return (
                        <tr key={ing.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                          <td style={{ padding: '0.5rem' }}>{item?.name || 'Insumo'}</td>
                          <td style={{ padding: '0.5rem', color: 'var(--text-muted)' }}>{item?.brand || '-'}</td>
                          <td style={{ padding: '0.5rem', fontWeight: 600 }}>{ing.quantity} {ing.unit}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {recipe.notes && (
                  <div style={{ background: 'var(--bg-subtle)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                    <strong style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>Modo de Preparo & Dicas:</strong>
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-body)' }}>{recipe.notes}</p>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={handlePrint} className="btn btn-secondary">
                  <Printer size={16} />
                  <span>Imprimir Ficha Técnica</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
