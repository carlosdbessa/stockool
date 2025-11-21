# 🚀 GUIA RÁPIDO - Stock Manager

## ⚡ Começar em 5 minutos

### 1️⃣ Extrair o projeto
```bash
tar -xzf stock-manager.tar.gz
cd stock-manager
```

### 2️⃣ Instalar dependências
```bash
npm install
```

### 3️⃣ Configurar Supabase

**A. Criar conta no Supabase**
1. Vai a https://supabase.com
2. Clica em "Start your project"
3. Cria uma conta (gratuita)
4. Cria um novo projeto (escolhe uma password forte!)
5. Aguarda 2-3 minutos até estar pronto

**B. Criar tabelas**
1. No painel do Supabase, vai a **SQL Editor** (menu lateral esquerdo)
2. Clica em "+ New query"
3. Abre o ficheiro `supabase-schema.sql` que está no projeto
4. Copia TODO o conteúdo
5. Cola no SQL Editor do Supabase
6. Clica em **Run** (ou pressiona Ctrl+Enter)
7. Deves ver "Success. No rows returned" ✅

**C. Obter credenciais**
1. No painel do Supabase, vai a **Settings > API**
2. Copia o **Project URL** (parecido com: https://xxxxx.supabase.co)
3. Copia a **anon public** key (uma string longa)

**D. Configurar na app**
1. Cria um ficheiro `.env` na raiz do projeto:
   ```bash
   cp .env.example .env
   ```
2. Edita o ficheiro `.env` e cola os valores:
   ```
   VITE_SUPABASE_URL=cola-aqui-o-project-url
   VITE_SUPABASE_ANON_KEY=cola-aqui-a-anon-key
   ```

### 4️⃣ Iniciar a aplicação
```bash
npm run dev
```

Abre o browser em: http://localhost:3000

## ✅ Primeiro uso

### Adicionar um utilizador
1. Menu **Utilizadores** > **Novo Utilizador**
2. Nome: "João Silva"
3. Email: "joao@empresa.pt"
4. **Criar**

### Adicionar um produto
1. Menu **Produtos** > **Novo Produto**
2. Código: "FERR-001"
3. Nome: "Chave de Fendas"
4. Categoria: "Ferramentas"
5. Stock Atual: 50
6. Stock Mínimo: 10
7. **Criar**

### Fazer uma retirada
1. Menu **Movimentos** > **Novo Movimento**
2. Produto: "Chave de Fendas"
3. Utilizador: "João Silva"
4. Tipo: "Saída"
5. Quantidade: 5
6. Observações: "Manutenção sala 203"
7. **Registar**

## 🎯 Funcionalidades principais

| Funcionalidade | Descrição |
|---------------|-----------|
| **Dashboard** | Visão geral do stock e alertas |
| **Produtos** | Gestão completa de produtos/materiais |
| **Utilizadores** | Gestão de colaboradores |
| **Movimentos** | Entradas e saídas com rastreamento |

## 🆘 Problemas comuns

### ❌ "Failed to fetch"
- Verifica se o `.env` tem as credenciais corretas
- Confirma que as tabelas foram criadas no Supabase

### ❌ Nada aparece na app
- Adiciona dados manualmente primeiro
- Verifica a consola do browser (F12) para erros

### ❌ Erro ao criar movimento
- Certifica-te que tens utilizadores e produtos criados
- Verifica se tens stock suficiente para saídas

## 📱 Estrutura do projeto

```
stock-manager/
├── src/
│   ├── components/
│   │   ├── Dashboard/     # Visão geral
│   │   ├── Produtos/      # Gestão de produtos
│   │   ├── Utilizadores/  # Gestão de utilizadores
│   │   └── Movimentos/    # Entrada/saída stock
│   ├── services/
│   │   └── supabase.js    # Configuração Supabase
│   ├── App.jsx            # Componente principal
│   └── main.jsx           # Entry point
├── supabase-schema.sql    # SQL para criar tabelas
├── .env.example           # Exemplo variáveis ambiente
├── README.md              # Documentação completa
└── package.json           # Dependências
```

## 🎨 Personalizar

### Adicionar novas categorias de produtos
Edita o ficheiro `src/components/Produtos/Produtos.jsx`:
```javascript
const categorias = [
  'Ferramentas', 
  'Material Escritório', 
  'Equipamento IT', 
  'Limpeza', 
  'Outros',
  'TUA_NOVA_CATEGORIA'  // Adiciona aqui
]
```

### Adicionar novas unidades
Edita o mesmo ficheiro:
```javascript
const unidades = [
  'unidades', 
  'kg', 
  'litros', 
  'metros', 
  'caixas',
  'tua_unidade'  // Adiciona aqui
]
```

## 📊 Base de dados

### Tabelas criadas:
- **utilizadores** - Colaboradores
- **produtos** - Materiais em stock
- **movimentos** - Histórico completo

### Ver dados no Supabase:
1. Vai a **Table Editor** no painel do Supabase
2. Seleciona a tabela que queres ver
3. Podes editar diretamente se necessário

## 🚀 Deploy (Opcional)

### Vercel (Grátis):
```bash
npm install -g vercel
vercel
```

### Netlify (Grátis):
```bash
npm run build
# Faz upload da pasta 'dist' em netlify.com
```

**IMPORTANTE:** Adiciona as variáveis de ambiente no serviço de deploy!

## 📞 Suporte

Se tiveres problemas:
1. Lê o README.md completo
2. Verifica a consola do browser (F12)
3. Confirma as credenciais do Supabase
4. Verifica se as tabelas foram criadas

---

**Bom trabalho! 🎉**
