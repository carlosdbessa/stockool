# 🚀 STOCKOOL - Instruções para IntelliJ IDEA

## 📋 Como importar o projeto

### Método 1: Copiar ficheiros diretamente

1. **Extrair o ZIP** `stockool-project.zip`
2. **Copiar tudo** para a pasta do teu projeto `stockool`
3. **No IntelliJ**, a estrutura deve ficar assim:

```
stockool/
├── .idea/                    (já existe - IDE)
├── src/                      (NOVO - copiar)
│   ├── components/
│   │   ├── Dashboard/
│   │   ├── Produtos/
│   │   ├── Utilizadores/
│   │   └── Movimentos/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
├── public/                   (NOVO - copiar)
├── index.html                (NOVO - copiar)
├── package.json              (NOVO - copiar)
├── vite.config.js            (NOVO - copiar)
├── .env.example              (NOVO - copiar)
├── .gitignore                (NOVO - copiar)
├── README.md                 (NOVO - copiar)
├── GUIA-RAPIDO.md            (NOVO - copiar)
└── supabase-schema.sql       (NOVO - copiar)
```

### Método 2: Extrair direto na pasta

```bash
# Na pasta do projeto
cd /caminho/para/stockool
unzip stockool-project.zip
```

## 🔧 Configurar no IntelliJ

### 1. Instalar Node.js (se não tiveres)
- Descarrega de https://nodejs.org/
- Instala a versão LTS

### 2. No Terminal do IntelliJ

```bash
# Instalar dependências
npm install

# Criar ficheiro .env
cp .env.example .env
```

### 3. Configurar Supabase

1. Vai a https://supabase.com
2. Cria conta (grátis)
3. Cria novo projeto
4. No Supabase, vai a **SQL Editor**
5. Copia o conteúdo de `supabase-schema.sql`
6. Cola e executa (Run)
7. Vai a **Settings > API**
8. Copia **URL** e **anon key**
9. Edita `.env` e cola os valores:

```env
VITE_SUPABASE_URL=https://teu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=tua-chave-aqui
```

### 4. Executar o projeto

No terminal do IntelliJ:

```bash
npm run dev
```

Abre o browser em: http://localhost:3000

## ✅ Verificar se está tudo OK

Após `npm run dev`, deves ver:

```
  VITE v6.0.1  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

## 🎯 Estrutura de ficheiros criada

```
📁 stockool/
│
├── 📁 src/                         # Código fonte
│   ├── 📁 components/              # Componentes React
│   │   ├── 📁 Dashboard/
│   │   │   └── Dashboard.jsx      # Dashboard principal
│   │   ├── 📁 Produtos/
│   │   │   └── Produtos.jsx       # Gestão de produtos
│   │   ├── 📁 Utilizadores/
│   │   │   └── Utilizadores.jsx   # Gestão utilizadores
│   │   └── 📁 Movimentos/
│   │       └── Movimentos.jsx     # Entrada/saída stock
│   │
│   ├── 📁 services/
│   │   └── supabase.js            # Config Supabase
│   │
│   ├── App.jsx                    # App principal
│   └── main.jsx                   # Entry point
│
├── 📁 public/                      # Ficheiros estáticos
│
├── 📄 index.html                   # HTML base
├── 📄 package.json                 # Dependências
├── 📄 vite.config.js               # Config Vite
├── 📄 .env.example                 # Exemplo env
├── 📄 .gitignore                   # Git ignore
│
├── 📄 README.md                    # Doc completa
├── 📄 GUIA-RAPIDO.md               # Guia rápido
└── 📄 supabase-schema.sql          # Schema BD
```

## 💻 Comandos úteis no Terminal IntelliJ

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Criar build de produção
npm run build

# Preview do build
npm run preview

# Limpar e reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 🐛 Problemas comuns

### ❌ "npm: command not found"
- Instala Node.js: https://nodejs.org/

### ❌ Porta 3000 ocupada
Edita `vite.config.js`:
```javascript
server: {
  port: 3001,  // Altera aqui
  open: true
}
```

### ❌ "Failed to fetch" na app
- Verifica se `.env` existe e tem as credenciais
- Confirma que executaste o SQL no Supabase

### ❌ IntelliJ não reconhece JSX
- File > Settings > Languages > JavaScript
- JavaScript language version: **React JSX**

## 🎨 IntelliJ IDEA - Plugins úteis

1. **JavaScript and TypeScript** (já instalado)
2. **.env files support** (para .env)
3. **Material Theme UI** (opcional, UI bonita)

## 📱 Como usar

### 1. Adicionar utilizadores
Menu Utilizadores > Novo Utilizador

### 2. Adicionar produtos  
Menu Produtos > Novo Produto

### 3. Fazer movimentos
Menu Movimentos > Novo Movimento

## 🚀 Próximo passo

**LÊ O GUIA-RAPIDO.md** para setup detalhado do Supabase!

---

**Projeto pronto para usar no IntelliJ IDEA! 🎉**
