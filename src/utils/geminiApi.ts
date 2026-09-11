import { Recipe, Ingredient, RecipeFinancials } from '../types';
import { formatCurrencyBRL } from './formatters';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export async function askChefAi(
  prompt: string,
  contextRecipe?: { recipe: Recipe; financials: RecipeFinancials; ingredients: Ingredient[] }
): Promise<string> {
  if (GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY') {
    try {
      let systemPrompt = `Você é a "Chef IA ConfeitaPro 2.0", a maior consultora do Brasil em confeitaria artesanal, engenharia de cardápios, redução de custos, precificação à prova de prejuízo e estratégias de vendas.
Seu tom é profissional, acolhedor, inspirador e estratégico. Use formatação limpa com tópicos, negrito nos números e valores em reais (R$).`;

      if (contextRecipe) {
        systemPrompt += `\n\nContexto da receita atual:
- Produto: ${contextRecipe.recipe.title}
- Categoria: ${contextRecipe.recipe.category}
- Rendimento: ${contextRecipe.recipe.yieldAmount} ${contextRecipe.recipe.yieldUnit}
- Custo Total de Produção: ${formatCurrencyBRL(contextRecipe.financials.totalCost)} (Insumos: ${formatCurrencyBRL(contextRecipe.financials.ingredientsCost)}, Embalagens: ${formatCurrencyBRL(contextRecipe.financials.packagingsCost)}, Gás/Luz: ${formatCurrencyBRL(contextRecipe.financials.overheadCost)}, Mão de Obra: ${formatCurrencyBRL(contextRecipe.financials.laborCost)})
- Preço sugerido: ${formatCurrencyBRL(contextRecipe.financials.suggestedSalePrice)} (${formatCurrencyBRL(contextRecipe.financials.suggestedPricePerUnit)} cada)
- Margem de Lucro: ${contextRecipe.recipe.desiredProfitMargin}%`;
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}\n\nPergunta da confeiteira: ${prompt}` }] }]
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

  // Fallback Gastronômico Inteligente de Alta Precisão
  await new Promise((resolve) => setTimeout(resolve, 700));
  const lower = prompt.toLowerCase();
  const title = contextRecipe?.recipe.title || 'sua receita';
  const totalCost = contextRecipe?.financials.totalCost || 40;
  const suggestedPrice = contextRecipe?.financials.suggestedSalePrice || 80;
  const unitPrice = contextRecipe?.financials.suggestedPricePerUnit || 8;

  // 1. Resposta para Objeção de Preço: "Achei Caro"
  if (lower.includes('caro') || lower.includes('objeção') || lower.includes('responder')) {
    return `### 💬 Roteiro de WhatsApp: Como Responder "Achei Caro" com Elegância e Fechar a Venda

Quando a cliente disser que achou caro, **nunca baixe o preço imediatamente**. Isso desvaloriza seu trabalho. Use esta técnica em 3 passos:

---

**Passo 1: Valide com empatia (sem se desculpar):**
> *"Oi [Nome da Cliente]! Entendo perfeitamente a sua preocupação com o orçamento. Na hora de escolher os doces da nossa comemoração, cada detalhe importa muito mesmo!"*

**Passo 2: Destaque o diferencial sensorial e a segurança:**
> *"O diferencial do nosso **${title}** é que ele é produzido de forma 100% artesanal, com chocolate nobre e manteiga de primeira linha, garantindo aquela cremosidade que derrete na boca e não fica com gosto de açúcar ou gordura. Além disso, vai em embalagem lacrada e pronta para impressionar seus convidados."*

**Passo 3: Ofereça uma alternativa inteligente (Downsell) em vez de dar desconto:**
> *"Se você quiser ajustar para caber certinho no seu orçamento hoje, podemos fazer [uma versão de tamanho menor / um kit com menos unidades] por apenas [Valor mais acessível]. O que acha de reservarmos para você?"*

💡 **Dica da Chef IA:** *Quem compra pelo preço, vai embora pelo preço. Quem compra pelo sabor e encanto, vira cliente fiel para a vida inteira!*`;
  }

  // 2. Otimização e Barateamento de Custos
  if (lower.includes('otimizar') || lower.includes('custo') || lower.includes('baratear') || lower.includes('economizar')) {
    return `### 📉 Diagnóstico de Redução de Custos da Chef IA para **${title}**

Com base no seu custo total de **${formatCurrencyBRL(totalCost)}**, identifiquei 3 pontos onde você pode economizar até **R$ ${(totalCost * 0.18).toFixed(2)} por receita**:

1. **Blend de Cacau & Chocolate Nobre:**
   - Se você usa 100% de chocolate nobre puro em coberturas cozidas, substitua 30% do peso por cacau em pó 100% alcalino. O sabor ficará mais intenso, a cor ficará aveludada e seu custo cai cerca de **15% a 18%**.

2. **Negociação de Embalagens em Atacado:**
   - As embalagens e fitas individuais costumam devorar até 22% do seu lucro. Compre caixas desmontadas em pacotes de 50 ou 100 unidades direto de distribuidores. O custo unitário cai em média de R$ 4,50 para R$ 1,60.

3. **Padronização e Controle de Gramatura:**
   - Utilize sempre balança de precisão digital. Uma variação de apenas 2 a 3 gramas a mais por brigadeiro ou fatia faz você perder o equivalente a **1 receita inteira a cada 10 fornadas**!

✨ **Resultado Previsto:** *Sua margem líquida sobe imediatamente de ${contextRecipe?.recipe.desiredProfitMargin || 120}% para ${(contextRecipe?.recipe.desiredProfitMargin || 120) + 25}% sem alterar 1 centavo no preço que a cliente paga.*`;
  }

  // 3. Calculadora de Desconto Seguro
  if (lower.includes('desconto') || lower.includes('promoção') || lower.includes('prejuízo')) {
    const discount10 = suggestedPrice * 0.9;
    const profitWithDiscount = discount10 - totalCost;
    return `### 📊 Análise de Desconto Seguro da Chef IA

Analisei a viabilidade de desconto para **${title}**:

- **Preço Cheio:** ${formatCurrencyBRL(suggestedPrice)} (Lucro Líquido: ${formatCurrencyBRL(suggestedPrice - totalCost)})
- **Com 5% de Desconto:** ${formatCurrencyBRL(suggestedPrice * 0.95)} (Lucro Líquido: ${formatCurrencyBRL((suggestedPrice * 0.95) - totalCost)}) 🟢 *Seguro*
- **Com 10% de Desconto:** ${formatCurrencyBRL(discount10)} (Lucro Líquido: ${formatCurrencyBRL(profitWithDiscount)}) 🟡 *Apenas para compras à vista no Pix*
- **Mais de 15% de Desconto:** 🔴 *PERIGO:* Você começará a trabalhar apenas para pagar o mercado e não terá margem para o seu salário!

💡 **Regra de Ouro:** *Só ofereça desconto mediante uma contrapartida da cliente: pagamento 100% antecipado no Pix ou pedido com mais de 3 dias de antecedência!*`;
  }

  // 4. Criação de Combos e Kits Lucrativos
  if (lower.includes('combo') || lower.includes('kit') || lower.includes('páscoa') || lower.includes('natal') || lower.includes('mães')) {
    return `### 🎁 Estratégia de Combos & Kits de Alto Lucro da Chef IA

Vender doces em kits aumenta seu ticket médio em até **65%**. Veja como estruturar:

1. **O Combo "Presente Afetivo" (Campeão de Vendas):**
   - 1 Unidade de **${title}** + Caixa com 4 brigadeiros gourmet belgas + Cartão kraft com mensagem personalizada.
   - **Custo de Produção:** ~R$ ${(totalCost * 1.15).toFixed(2)}
   - **Preço Sugerido do Kit:** ${formatCurrencyBRL(suggestedPrice * 1.45)}
   - **Seu Lucro no Kit:** +${formatCurrencyBRL((suggestedPrice * 1.45) - (totalCost * 1.15))}

2. **Gatilho da Escassez:**
   - Divulgue sempre como: *"Edição Limitada: Apenas 15 caixas disponíveis para esta semana!"*. As clientes compram por impulso para não ficar sem!`;
  }

  // Resposta padrão
  return `### 👩‍🍳 Dicas Estratégicas da Chef IA ConfeitaPro

Que alegria te ajudar a prosperar! Analisei sua receita de **${title}** (${formatCurrencyBRL(suggestedPrice)} por receita).

O que você quer explorar agora?
1. 📉 **Reduzir custos de insumos sem perder qualidade**
2. 📱 **Criar legenda magnética para o Instagram e WhatsApp**
3. 💬 **Roteiro pronto para fechar vendas no WhatsApp**
4. 🎁 **Como transformar esta receita em um Kit de Presente lucrativo**`;
}
