# 🧁 ConfeitaPro SaaS - Precificação & Gestão Gastronômica

> O sistema SaaS definitivo para confeiteiras, cozinheiros e pequenos negócios gastronômicos calcularem custos reais de receitas, mão de obra, embalagens, margens de lucro sem prejuízos, com **Chef IA no Plano Pro**, assinatura mensal via **Stripe** e banco em nuvem com **Firebase**.

---

## 🎨 Principais Recursos

- **🧮 Motor de Precificação Completo**:
  - Insumos diretos com conversão automática de medidas (kg, g, L, ml, un).
  - Embalagens e descartáveis (caixas, laços, pratos rígidos, tags).
  - Custos invisíveis rateados (gás, água, energia: 10% a 25%).
  - Mão de obra calculada pelo tempo de preparo vezes o valor da hora da confeiteira.
  - Slider dinâmico de margem de lucro (20% a 300%) com cálculo de ponto de equilíbrio.
- **📦 Banco de Ingredientes com Efeito Cascata**:
  - Altere o preço do leite condensado ou chocolate uma vez e todas as receitas recalculam instantaneamente.
- **🤖 Chef IA Confeiteira (Exclusiva Plano Pro)**:
  - Redução de custos em até 18% sem perder padrão.
  - Gerador de legendas com apelo sensorial para Instagram e WhatsApp.
  - Tabela de validade, conservação e congelamento técnico.
- **💳 Assinatura Stripe & Gestão de Planos**:
  - Planos: *Iniciante Doce (Grátis)*, *Confeiteira Pro (R$ 29,90/mês)* e *Ateliê Master (R$ 49,90/mês)*.
  - Checkout direto para o Stripe (`buy.stripe.com`).
- **📱 Ficha Técnica & Orçamento WhatsApp**:
  - Mensagem formatada pronta com dados do pedido e chave Pix para fechar encomendas com clientes.
  - Ficha de produção pronta para impressão (`window.print()`).
- **🔐 Autenticação Firebase**:
  - Login com Google e e-mail/senha.

---

## 🚀 Como Rodar Localmente

1. Clone o repositório:
```bash
git clone https://github.com/Nicolas-Novacovski/confeitapro-saas.git
cd confeitapro-saas
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo `.env`:
Copie o arquivo `.env.example` para `.env` e adicione suas chaves do Firebase e Stripe:
```bash
cp .env.example .env
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
Acesse em: `http://localhost:5173/`

---

## ⚙️ Conectando com Firebase (Google Auth & Firestore)

1. Acesse o [Firebase Console](https://console.firebase.google.com/) e crie um projeto gratuito.
2. Em **Authentication > Sign-in method**, ative o provedor **Google** e adicione `localhost` nos Domínios Autorizados.
3. Em **Configurações do Projeto > Seus aplicativos**, crie um app Web e copie as credenciais para o seu arquivo `.env`:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=1:...
```

---

## 💳 Conectando com o Stripe

1. Acesse o [Dashboard do Stripe](https://dashboard.stripe.com/).
2. Vá em **Produtos / Payment Links** e crie um link de pagamento recorrente mensal no valor de R$ 29,90 para o Plano Pro.
3. Cole o link no seu `.env`:
```env
VITE_STRIPE_PAYMENT_LINK_PRO=https://buy.stripe.com/...
```
Ou configure diretamente na tela de **Configurações** do ConfeitaPro.
