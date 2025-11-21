# 📦 Stock Manager - Gestão de Stock

Aplicação web completa para gestão de stock de materiais com controlo de utilizadores e rastreamento de movimentações.

## 🚀 Tecnologias

- **Frontend:** React + Vite + Material-UI
- **Backend:** Supabase (PostgreSQL)
- **Autenticação:** Supabase Auth (opcional)

## 📋 Funcionalidades

### ✅ Dashboard
- Visão geral do stock
- Alertas de produtos com stock baixo
- Estatísticas de movimentações
- Últimos movimentos registados

### ✅ Produtos
- CRUD completo de produtos
- Gestão de categorias e unidades
- Controlo de stock atual e mínimo
- Localização no armazém
- Preço unitário

### ✅ Utilizadores
- Gestão de colaboradores
- Registo de nome e email
- Histórico de retiradas

### ✅ Movimentos
- Registo de entradas e saídas
- Controlo automático de stock
- Data/hora automática do sistema
- Rastreamento completo: quem, quando, quanto
- Observações por movimento

## 🛠️ Instalação

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Supabase

1. Vai a [https://supabase.com](https://supabase.com)
2. Cria uma conta (gratuita)
3. Cria um novo projeto
4. Aguarda alguns minutos até o projeto estar pronto

### 3. Criar as tabelas no Supabase

1. No painel do Supabase, vai a **SQL Editor**
2. Copia e cola o seguinte SQL:

```sql
-- Criar tabela de utilizadores
CREATE TABLE utilizadores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de produtos
CREATE TABLE produtos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  categoria TEXT,
  unidade TEXT DEFAULT 'unidades',
  stock_atual INTEGER DEFAULT 0,
  stock_minimo INTEGER DEFAULT 0,
  preco_unitario DECIMAL(10,2) DEFAULT 0,
  localizacao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de movimentos
CREATE TABLE movimentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  produto_id UUID REFERENCES produtos(id) ON DELETE RESTRICT,
  utilizador_id UUID REFERENCES utilizadores(id) ON DELETE RESTRICT,
  tipo TEXT CHECK (tipo IN ('entrada', 'saida')) NOT NULL,
  quantidade INTEGER NOT NULL,
  stock_anterior INTEGER NOT NULL,
  stock_novo INTEGER NOT NULL,
  data TIMESTAMP WITH TIME ZONE NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para performance
CREATE INDEX idx_movimentos_produto ON movimentos(produto_id);
CREATE INDEX idx_movimentos_utilizador ON movimentos(utilizador_id);
CREATE INDEX idx_movimentos_data ON movimentos(data DESC);
CREATE INDEX idx_produtos_stock_baixo ON produtos(stock_atual) WHERE stock_atual <= stock_minimo;
```

3. Clica em **Run** para executar o SQL

### 4. Configurar variáveis de ambiente

1. No painel do Supabase, vai a **Settings > API**
2. Copia a **URL** e a **anon public key**
3. Cria um ficheiro `.env` na raiz do projeto:

```bash
cp .env.example .env
```

4. Edita o ficheiro `.env` e cola os valores:

```env
VITE_SUPABASE_URL=https://teu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=tua-chave-anon-aqui
```

### 5. Iniciar a aplicação

```bash
npm run dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000)

## 📊 Estrutura da Base de Dados

### Tabela: utilizadores
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único |
| nome | TEXT | Nome do utilizador |
| email | TEXT | Email (único) |
| created_at | TIMESTAMP | Data de criação |

### Tabela: produtos
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único |
| codigo | TEXT | Código do produto (único) |
| nome | TEXT | Nome do produto |
| descricao | TEXT | Descrição detalhada |
| categoria | TEXT | Categoria do produto |
| unidade | TEXT | Unidade de medida |
| stock_atual | INTEGER | Quantidade atual em stock |
| stock_minimo | INTEGER | Nível mínimo de stock |
| preco_unitario | DECIMAL | Preço por unidade |
| localizacao | TEXT | Localização no armazém |
| created_at | TIMESTAMP | Data de criação |

### Tabela: movimentos
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único |
| produto_id | UUID | Referência ao produto |
| utilizador_id | UUID | Referência ao utilizador |
| tipo | TEXT | 'entrada' ou 'saida' |
| quantidade | INTEGER | Quantidade movimentada |
| stock_anterior | INTEGER | Stock antes do movimento |
| stock_novo | INTEGER | Stock após o movimento |
| data | TIMESTAMP | Data/hora do movimento |
| observacoes | TEXT | Notas adicionais |
| created_at | TIMESTAMP | Data de criação do registo |

## 🎯 Como usar

### Adicionar Utilizadores
1. Vai ao menu **Utilizadores**
2. Clica em **Novo Utilizador**
3. Preenche nome e email
4. Clica em **Criar**

### Adicionar Produtos
1. Vai ao menu **Produtos**
2. Clica em **Novo Produto**
3. Preenche os dados (código, nome, categoria, etc.)
4. Define stock inicial e stock mínimo
5. Clica em **Criar**

### Registar Movimentos
1. Vai ao menu **Movimentos**
2. Clica em **Novo Movimento**
3. Seleciona o produto
4. Seleciona o utilizador
5. Escolhe o tipo (entrada ou saída)
6. Define a quantidade
7. Adiciona observações (opcional)
8. Clica em **Registar**

**Nota:** O sistema valida automaticamente:
- Stock insuficiente em saídas
- Atualização automática do stock do produto
- Registo de data/hora do sistema
- Histórico completo de alterações

## 📦 Deploy

### Opção 1: Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### Opção 2: Netlify

```bash
npm run build
# Faz upload da pasta 'dist' no Netlify
```

Não te esqueças de adicionar as variáveis de ambiente nas configurações!

## 🐛 Troubleshooting

### Erro: "Failed to fetch"
- Verifica se as credenciais do Supabase estão corretas no `.env`
- Confirma que as tabelas foram criadas no Supabase

### Produtos não aparecem
- Verifica se as tabelas foram criadas corretamente
- Adiciona alguns produtos manualmente primeiro

## 📝 Próximas melhorias

- [ ] Exportar relatórios para Excel/PDF
- [ ] Filtros avançados por data/utilizador/produto
- [ ] Gráficos de consumo mensal
- [ ] Scanner de código de barras
- [ ] Notificações quando stock fica baixo
- [ ] Sistema de aprovação de retiradas
- [ ] Multi-armazém

## 📄 Licença

MIT
