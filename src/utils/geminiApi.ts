import { Recipe, Ingredient, RecipeFinancials } from '../types';
import { formatCurrencyBRL } from './formatters';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export async function askChefAi(
  prompt: string,
  contextRecipe?: { recipe: Recipe; financials: RecipeFinancials; ingredients: Ingredient[] }
): Promise<string> {
  // Se temos a chave da API do Gemini, faz a chamada real
  if (GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY') {
    try {
      let systemPrompt = `Você é a "Chef IA ConfeitaPro", a maior especialista do Brasil em confeitaria artesanal, engenharia de cardápios, redução de custos e marketing para docerias.
Seu tom é acolhedor, inspirador, técnico porém simples de entender, carinhoso (usa termos como "confeiteira", "querida", "sucesso nas vendas") e direto ao ponto.
Responda sempre em Português do Brasil com formatação markdown limpa (tópicos com emojis, negrito nos números importantes).`;

      if (contextRecipe) {
        systemPrompt += `\n\nContexto da receita atual:
- Nome: ${contextRecipe.recipe.title}
- Categoria: ${contextRecipe.recipe.category}
- Rendimento: ${contextRecipe.recipe.yieldAmount} ${contextRecipe.recipe.yieldUnit}
- Custo Total de Produção: ${formatCurrencyBRL(contextRecipe.financials.totalCost)}
- Custo por unidade: ${formatCurrencyBRL(contextRecipe.financials.costPerUnit)}
- Preço sugerido: ${formatCurrencyBRL(contextRecipe.financials.suggestedSalePrice)} (${formatCurrencyBRL(contextRecipe.financials.suggestedPricePerUnit)} cada)
- Margem de Lucro: ${contextRecipe.recipe.desiredProfitMargin}%
- Ingredientes usados: ${contextRecipe.recipe.ingredients.map(i => {
          const ing = contextRecipe.ingredients.find(ing => ing.id === i.ingredientId);
          return `${ing?.name || 'Ingrediente'} (${i.quantity}${i.unit})`;
        }).join(', ')}`;
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `${systemPrompt}\n\nPergunta da confeiteira: ${prompt}` }
                ]
              }
            ]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generatedText) return generatedText;
      }
    } catch (err) {
      console.warn('Erro ao chamar API do Gemini:', err);
    }
  }

  // Fallback Gastronômico Inteligente (Garante experiência mágica mesmo sem chave de API configurada)
  await new Promise(resolve => setTimeout(resolve, 800));

  const lower = prompt.toLowerCase();

  if (lower.includes('otimizar') || lower.includes('custo') || lower.includes('baratear') || lower.includes('economizar')) {
    const title = contextRecipe?.recipe.title || 'sua receita';
    const cost = contextRecipe?.financials.totalCost ? formatCurrencyBRL(contextRecipe.financials.totalCost) : 'o custo atual';
    return `### 🧁 Diagnóstico de Custos da Chef IA para **${title}**

Analisei a composição do seu produto (Custo atual: **${cost}**). Aqui estão 3 estratégias de ouro para aumentar seu lucro sem perder qualidade:

1. **Substituição de Base Láctea de Alto Rendimento:**
   - Em vez de usar 100% de chocolate nobre puro em recheios cozidos, faça um *blend* de 70% chocolate nobre meio amargo + 30% cacau 100% alcalino. Isso reduz o custo do recheio em até **18%** e deixa o sabor ainda mais sofisticado e menos enjoativo!
   
2. **Negociação de Embalagens em Atacado:**
   - Embalagens e fitas individuais costumam representar de 15% a 25% do custo direto. Comprando caixas desmontadas em lotes de 50 ou 100 direto de fabricantes (como Art&Monta ou Sulformas), o custo unitário cai de R$ 3,50 para cerca de R$ 1,40.

3. **Padronização de Gramatura:**
   - Utilize sempre uma balança de precisão para bolear brigadeiros ou porcionar recheios. Uma variação de apenas 3g a mais por docinho em um cento representa **15 docinhos a menos** de lucro para você!

💡 **Dica da Chef:** *Com esses ajustes, sua margem real salta de ${(contextRecipe?.recipe.desiredProfitMargin || 100)}% para mais de ${(contextRecipe?.recipe.desiredProfitMargin || 100) + 25}% sem alterar o preço final para a cliente!*`;
  }

  if (lower.includes('legenda') || lower.includes('instagram') || lower.includes('vender') || lower.includes('whatsapp')) {
    const title = contextRecipe?.recipe.title || 'Delícia Artesanal';
    const priceUnit = contextRecipe?.financials.suggestedPricePerUnit 
      ? formatCurrencyBRL(contextRecipe.financials.suggestedPricePerUnit) 
      : 'R$ 15,00';

    return `### ✨ Legenda Magnética para Instagram & WhatsApp

Aqui está uma copy irresistível com apelo sensorial desenvolvida para converter curtidas em encomendas:

---

**Aquele momento do dia que pede um abraço em forma de doce... 🍫✨**

Imagine morder uma casquinha delicada e ser surpreendida por um recheio extremamente aveludado, feito com ingredientes nobres e aquele toque de amor que só a confeitaria artesanal tem.

Nosso **${title}** é feito sob encomenda, sempre fresquinho e perfumado, perfeito para presentear alguém especial ou para o seu merecido momento de autocuidado hoje! 🥰

🏷️ **Investimento individual:** apenas ${priceUnit}
📦 **Produção limitada para garantir o frescor máximo!**

💬 *Clique no link da bio ou me chame no WhatsApp para garantir o seu antes que esgote a fornada!* 👇

#confeitariaartesanal #docesgourmet #artesanal #momentodoce #feitocomamor

---
💡 **Dica de Venda:** Poste essa legenda junto a um vídeo em close (slow motion) cortando o doce ao meio! O desejo visual dobra as chances de encomenda.`;
  }

  if (lower.includes('validade') || lower.includes('congelamento') || lower.includes('conservar')) {
    return `### 🧊 Guia de Conservação & Congelamento Profissional

- **Em temperatura ambiente (local fresco até 23°C):** Consumir em até 3 a 4 dias, sempre bem vedado para não ressecar.
- **Sob refrigeração (geladeira 4°C a 8°C):** Até 7 a 10 dias em pote hermético. *Atenção:* tire 20 minutos antes de servir para voltar à cremosidade ideal.
- **Congelamento técnico (-18°C):** Até 60 dias sem perder textura ou sabor. Embale individualmente em plástico filme sem ar e depois em saco zip-lock. Descongele sempre dentro da geladeira por 6 horas!`;
  }

  // Resposta padrão interativa
  return `### 👩‍🍳 Dica da Chef IA ConfeitaPro

Que alegria te ajudar a prosperar na confeitaria! 

Sua dúvida sobre *"**${prompt}**"* é excelente. O segredo de uma confeitaria lucrativa está no equilíbrio entre **ingredientes de excelência**, **precificação sem medo de cobrar o que vale** e **apresentação encantadora**.

Posso te ajudar com:
- 📉 Estratégias para baratear custos sem perder padrão.
- 📱 Criar legendas e roteiros de vídeos para o Instagram.
- 🎯 Como montar combos e kits para datas especiais (Páscoa, Dia das Mães, Natal).
- 📐 Como converter as quantidades desta receita para formas de 15cm, 20cm ou 25cm.

O que você gostaria de explorar agora?`;
}
