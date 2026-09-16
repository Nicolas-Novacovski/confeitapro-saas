import { Recipe, Ingredient, RecipeFinancials } from '../types';
import { formatCurrencyBRL } from './formatters';

// Importações do Firebase para a Trava de Segurança
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase'; // <-- Caminho corrigido com sucesso!

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

export async function askChefAi(
  prompt: string,
  contextRecipe?: { recipe: Recipe; financials: RecipeFinancials; ingredients: Ingredient[] },
  userId?: string // <-- Adicionamos o ID da confeiteira aqui
): Promise<string> {
  
  const todayStr = new Date().toISOString().split('T')[0];
  let userRef: any = null;

  // 1. VERIFICAÇÃO DA TRAVA (15 PERGUNTAS/DIA)
  if (userId && db) {
    try {
      userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const lastUsage = userData.ia_last_usage;
        let usageCount = userData.ia_usage_count || 0;

        // Se virou o dia, reseta o contador
        if (lastUsage !== todayStr) {
          usageCount = 0;
        }

        // Se bateu o teto de 15 perguntas
        if (usageCount >= 15) {
          return `### 🛑 Descanso da Chef\n\n🧁 Uau, você está voando hoje! A Chef IA já analisou 15 estratégias incríveis para o seu negócio.\n\nPara garantir a qualidade da nossa consultora e processar tudo que já aprendemos, seu limite diário foi atingido. Voltamos amanhã com muito mais lucros! ✨`;
        }
      }
    } catch (error) {
      console.error('Erro ao verificar limite no Firebase:', error);
    }
  }

  // 2. CHAMADA PARA A GROQ API
  if (GROQ_API_KEY && GROQ_API_KEY.trim() !== '') {
    try {
      let systemPrompt = `Você é a "Chef IA DoceLucro 2.0", a maior consultora do Brasil em confeitaria artesanal, engenharia de cardápios, redução de custos e precificação.
Sua missão é ajudar confeiteiras e responder DIRETAMENTE ao que foi perguntado, de forma fluida e prática.
Se a confeiteira pedir uma receita, forneça ingredientes detalhados e o modo de preparo.
Use emojis amigáveis (🧁, 💰, 📈). Responda sempre em português do Brasil.`;

      if (contextRecipe) {
        systemPrompt += `\n\nContexto da receita atual da usuária:
- Produto: ${contextRecipe.recipe.title}
- Custo Total de Produção: ${formatCurrencyBRL(contextRecipe.financials.totalCost)}
- Preço sugerido: ${formatCurrencyBRL(contextRecipe.financials.suggestedSalePrice)}
- Margem de Lucro: ${contextRecipe.recipe.desiredProfitMargin}%`;
      }

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY.trim()}`
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b', // O modelo que descobrimos que funciona!
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      if (response.ok) {
        const data = await response.json();
        const generatedText = data.choices?.[0]?.message?.content;

        // 3. ATUALIZA O SALDO DE PERGUNTAS (Se a resposta deu certo)
        if (generatedText && userRef) {
          try {
            const userSnap = await getDoc(userRef);
            let newCount = 1;
            
            if (userSnap.exists()) {
              const userData = userSnap.data();
              if (userData.ia_last_usage === todayStr) {
                newCount = (userData.ia_usage_count || 0) + 1;
              }
              await updateDoc(userRef, { ia_usage_count: newCount, ia_last_usage: todayStr });
            } else {
              await setDoc(userRef, { ia_usage_count: newCount, ia_last_usage: todayStr }, { merge: true });
            }
          } catch (e) {
            console.error('Erro ao debitar uso da IA no Firebase', e);
          }
        }

        if (generatedText) return generatedText;
      }
    } catch (err) {
      console.warn('Erro na Groq API.', err);
    }
  }

  // 4. FALLBACK INTELIGENTE
  return `### 👩‍🍳 Consultoria Chef IA\n\nEstou pronta para analisar suas receitas. Tivemos uma pequena instabilidade de conexão, mas pode perguntar novamente em alguns segundos!`;
}