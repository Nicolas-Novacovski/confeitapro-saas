import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { askChefAi } from '../utils/geminiApi';
import { AiChatMessage, Recipe } from '../types';
import { 
  Sparkles, 
  Send, 
  Lock, 
  Crown, 
  TrendingDown, 
  Share2, 
  ThermometerSnowflake, 
  Bot, 
  User,
  ArrowRight
} from 'lucide-react';

interface AiAdvisorPageProps {
  onOpenPricing: () => void;
  preselectedRecipe?: Recipe | null;
}

export const AiAdvisorPage: React.FC<AiAdvisorPageProps> = ({
  onOpenPricing,
  preselectedRecipe
}) => {
  // 1. ADICIONAMOS O 'user' AQUI PARA PEGAR O ID DA CONFEITEIRA
  const { isPro, user } = useAuth();
  const { recipes, ingredients, getFinancials } = useData();

  const [selectedRecipeId, setSelectedRecipeId] = useState<string>(
    preselectedRecipe?.id || (recipes.length > 0 ? recipes[0].id : '')
  );

  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Olá! Sou a **Chef IA DoceLucro**, sua consultora especialista em gestão gastronômica e marketing para confeitarias! 🧁✨\n\nSelecione uma de suas receitas acima ou me faça qualquer pergunta sobre:\n- **Redução inteligente de custos** sem perder a cremosidade e qualidade dos seus doces;\n- **Legendas de alto impacto** e apelo sensorial para seu Instagram e WhatsApp;\n- **Técnicas de conservação, validade e congelamento**;\n- **Como montar combos lucrativos** para datas sazonais (Páscoa, Dia das Mães, Natal).\n\nComo posso ajudar sua confeitaria a lucrar mais hoje?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const activeRecipe = recipes.find((r) => r.id === selectedRecipeId);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim() || loading) return;

    const userMessage: AiChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setLoading(true);

    try {
      const context = activeRecipe
        ? {
            recipe: activeRecipe,
            financials: getFinancials(activeRecipe),
            ingredients
          }
        : undefined;

      // 2. ENVIAMOS O ID DO USUÁRIO PARA ATIVAR A TRAVA DO FIREBASE
      const aiResponseText = await askChefAi(text, context, user?.uid);

      const aiMessage: AiChatMessage = {
        id: 'ai_' + Date.now(),
        sender: 'assistant',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'calc(100vh - 120px)' }}>
      
      {/* Topo da Página */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #A27BDB 0%, #7653B6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 14px rgba(142, 122, 196, 0.4)'
          }}>
            <Sparkles size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 className="font-serif" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Chef IA Confeiteira
              </h1>
              <span className="badge badge-pro">Plano PRO</span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Inteligência Artificial gastronômica treinada para otimizar lucros, reduzir custos e acelerar vendas.
            </p>
          </div>
        </div>

        {/* Seletor de Receita para Contexto */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-body)' }}>
            Receita Analisada:
          </span>
          <select
            className="form-select"
            style={{ minWidth: '220px', padding: '0.5rem 0.85rem' }}
            value={selectedRecipeId}
            onChange={(e) => setSelectedRecipeId(e.target.value)}
          >
            {recipes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Se o usuário NÃO for Pro: Bloqueio Elegante com Degustação */}
      {!isPro ? (
        <div style={{
          position: 'relative',
          flex: 1,
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          border: '1.5px solid var(--lavender-300)',
          background: 'linear-gradient(145deg, #FAF7FE 0%, #FFFFFF 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          {/* Fundo borrado que simula a interface da IA */}
          <div style={{
            position: 'absolute',
            inset: 0,
            filter: 'blur(8px)',
            opacity: 0.35,
            padding: '2rem',
            pointerEvents: 'none'
          }}>
            <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', marginBottom: '1rem' }}>
              <p><strong>Chef IA:</strong> Analisei sua receita de Bolo Vulcão. Você pode economizar R$ 6,20 por bolo...</p>
            </div>
            <div style={{ background: 'var(--lavender-50)', padding: '1.5rem', borderRadius: '16px' }}>
              <p><strong>Legenda Instagram:</strong> Aquele momento doce que você merece...</p>
            </div>
          </div>

          {/* Card Central com Apelo Visual de Upgrade */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            background: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem 2rem',
            maxWidth: '560px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-lg)',
            border: '2px solid var(--lavender-300)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #A27BDB 0%, #7653B6 100%)',
              color: '#FFFFFF',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(142, 122, 196, 0.45)',
              marginBottom: '1.25rem'
            }}>
              <Lock size={30} />
            </div>

            <h2 className="font-serif" style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Recurso Exclusivo do Plano Confeiteira Pro
            </h2>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-body)', lineHeight: 1.55, marginBottom: '1.5rem' }}>
              A <strong>Chef IA</strong> analisa os custos reais da sua receita e sugere substituições técnicas para economizar até <strong>20% nos insumos</strong>, além de escrever textos sedutores para vender no Instagram e WhatsApp.
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              textAlign: 'left',
              background: 'var(--lavender-50)',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.75rem'
            }}>
              <p style={{ fontSize: '0.825rem', color: 'var(--lavender-700)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ✨ <strong>Diagnóstico de Custos:</strong> barateie sem perder cremosidade
              </p>
              <p style={{ fontSize: '0.825rem', color: 'var(--lavender-700)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📱 <strong>Gerador de Legendas:</strong> copies irresistíveis que vendem
              </p>
              <p style={{ fontSize: '0.825rem', color: 'var(--lavender-700)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ♾️ <strong>Receitas Ilimitadas:</strong> cadastre todo o seu cardápio
              </p>
            </div>

            <button
              onClick={onOpenPricing}
              className="btn btn-pro btn-lg"
              style={{ width: '100%', fontSize: '1.05rem', fontWeight: 700 }}
            >
              <Crown size={20} />
              <span>Desbloquear Chef IA por R$ 29,90/mês</span>
            </button>
          </div>
        </div>
      ) : (
        /* Interface Interativa da IA para Usuários PRO */
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          background: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden'
        }}>
          {/* Ações Rápidas em Chips */}
          <div style={{
            padding: '0.85rem 1.25rem',
            borderBottom: '1px solid var(--border-light)',
            background: 'var(--bg-canvas)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            overflowX: 'auto'
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              Ações Rápidas:
            </span>

            <button
              onClick={() => handleSendMessage('Como posso baratear e otimizar os custos dessa receita em 15% sem perder qualidade?')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.8rem', gap: '0.4rem', whiteSpace: 'nowrap' }}
            >
              <TrendingDown size={14} color="var(--sage-500)" />
              <span>Reduzir Custos em 15%</span>
            </button>

            <button
              onClick={() => handleSendMessage('Crie uma legenda altamente persuasiva com apelo sensorial para eu postar essa receita no Instagram e atrair encomendas no WhatsApp.')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.8rem', gap: '0.4rem', whiteSpace: 'nowrap' }}
            >
              <Share2 size={14} color="var(--primary)" />
              <span>Criar Legenda p/ Instagram</span>
            </button>

            <button
              onClick={() => handleSendMessage('Quais as orientações de validade, embalagem e congelamento seguro para esse doce?')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.8rem', gap: '0.4rem', whiteSpace: 'nowrap' }}
            >
              <ThermometerSnowflake size={14} color="#5C89DC" />
              <span>Validade & Congelamento</span>
            </button>
          </div>

          {/* Área de Mensagens */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';

              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem',
                    maxWidth: '85%',
                    alignSelf: isAssistant ? 'flex-start' : 'flex-end',
                    flexDirection: isAssistant ? 'row' : 'row-reverse'
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '12px',
                    background: isAssistant ? 'linear-gradient(135deg, #A27BDB 0%, #7653B6 100%)' : 'var(--primary)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {isAssistant ? <Sparkles size={18} /> : <User size={18} />}
                  </div>

                  <div style={{
                    background: isAssistant ? 'var(--bg-canvas)' : 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
                    color: isAssistant ? 'var(--text-main)' : '#FFFFFF',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1rem 1.25rem',
                    border: isAssistant ? '1px solid var(--border-light)' : 'none',
                    boxShadow: 'var(--shadow-xs)',
                    fontSize: '0.925rem',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap'
                  }}>
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: 'var(--lavender-700)', fontSize: '0.85rem' }}>
                <Sparkles size={18} className="pulse-pro" />
                <span>Chef IA analisando receitas e redigindo resposta...</span>
              </div>
            )}
          </div>

          {/* Campo de Entrada de Mensagem */}
          <div style={{
            padding: '1rem 1.25rem',
            borderTop: '1px solid var(--border-light)',
            background: 'var(--bg-canvas)',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center'
          }}>
            <input
              type="text"
              className="form-input"
              placeholder={`Pergunte algo sobre "${activeRecipe?.title || 'suas receitas'}" (ex: como render mais, substituição de ingrediente...)`}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              disabled={loading}
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !inputPrompt.trim()}
              className="btn btn-pro"
              style={{ padding: '0.7rem 1.25rem' }}
            >
              <Send size={18} />
              <span>Enviar</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};