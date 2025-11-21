-- ================================================
-- STOCK MANAGER - SCHEMA DO SUPABASE
-- ================================================
-- Copia e cola este SQL no SQL Editor do Supabase
-- ================================================

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

-- Criar índices para melhor performance
CREATE INDEX idx_movimentos_produto ON movimentos(produto_id);
CREATE INDEX idx_movimentos_utilizador ON movimentos(utilizador_id);
CREATE INDEX idx_movimentos_data ON movimentos(data DESC);
CREATE INDEX idx_produtos_stock_baixo ON produtos(stock_atual) WHERE stock_atual <= stock_minimo;
CREATE INDEX idx_produtos_categoria ON produtos(categoria);

-- Comentários nas tabelas (documentação)
COMMENT ON TABLE utilizadores IS 'Colaboradores que fazem movimentações de stock';
COMMENT ON TABLE produtos IS 'Produtos/materiais disponíveis em stock';
COMMENT ON TABLE movimentos IS 'Histórico completo de entradas e saídas de stock';

-- ================================================
-- DADOS DE EXEMPLO (OPCIONAL)
-- ================================================
-- Remover comentários para inserir dados de teste

-- Inserir utilizadores de exemplo
/*
INSERT INTO utilizadores (nome, email) VALUES
('João Silva', 'joao.silva@empresa.pt'),
('Maria Santos', 'maria.santos@empresa.pt'),
('Pedro Costa', 'pedro.costa@empresa.pt');
*/

-- Inserir produtos de exemplo
/*
INSERT INTO produtos (codigo, nome, descricao, categoria, unidade, stock_atual, stock_minimo, preco_unitario, localizacao) VALUES
('FERR-001', 'Chave de Fendas', 'Chave de fendas Phillips', 'Ferramentas', 'unidades', 50, 10, 5.99, 'Armazém A - Prateleira 1'),
('MAT-001', 'Resma A4', 'Resma papel A4 500 folhas', 'Material Escritório', 'unidades', 100, 20, 3.50, 'Armazém B - Prateleira 2'),
('IT-001', 'Mouse USB', 'Mouse ótico USB', 'Equipamento IT', 'unidades', 30, 5, 12.99, 'Armazém C - Prateleira 1'),
('LIMP-001', 'Detergente', 'Detergente líquido 5L', 'Limpeza', 'litros', 25, 10, 8.50, 'Armazém D - Prateleira 3');
*/

-- ================================================
-- FIM DO SCRIPT
-- ================================================
