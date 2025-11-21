import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
  Chip,
  MenuItem
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { supabase } from '../../services/supabase'

function Produtos() {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingProduto, setEditingProduto] = useState(null)
  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    descricao: '',
    categoria: '',
    unidade: 'unidades',
    stock_atual: 0,
    stock_minimo: 0,
    preco_unitario: 0,
    localizacao: ''
  })

  const categorias = ['Skincare', 'Outros']
  const unidades = ['unidades', 'caixas']

  useEffect(() => {
    loadProdutos()
  }, [])

  const loadProdutos = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('nome', { ascending: true })

      if (error) throw error
      setProdutos(data || [])
    } catch (err) {
      console.error('Erro ao carregar produtos:', err)
      setError('Erro ao carregar produtos')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (produto = null) => {
    if (produto) {
      setEditingProduto(produto)
      setFormData(produto)
    } else {
      setEditingProduto(null)
      setFormData({
        codigo: '',
        nome: '',
        descricao: '',
        categoria: '',
        unidade: 'unidades',
        stock_atual: 0,
        stock_minimo: 0,
        preco_unitario: 0,
        localizacao: ''
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingProduto(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    try {
      if (editingProduto) {
        const { error } = await supabase
          .from('produtos')
          .update(formData)
          .eq('id', editingProduto.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('produtos')
          .insert([formData])

        if (error) throw error
      }

      handleCloseDialog()
      loadProdutos()
      setError(null)
    } catch (err) {
      console.error('Erro ao guardar produto:', err)
      setError(err.message || 'Erro ao guardar produto')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja eliminar este produto?')) {
      try {
        const { error } = await supabase
          .from('produtos')
          .delete()
          .eq('id', id)

        if (error) throw error
        loadProdutos()
        setError(null)
      } catch (err) {
        console.error('Erro ao eliminar produto:', err)
        setError('Erro ao eliminar produto. Pode ter movimentos associados.')
      }
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Produtos</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Novo Produto
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell>Stock Atual</TableCell>
              <TableCell>Stock Mínimo</TableCell>
              <TableCell>Unidade</TableCell>
              <TableCell>Localização</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {produtos.map((produto) => (
              <TableRow key={produto.id}>
                <TableCell>{produto.codigo}</TableCell>
                <TableCell>{produto.nome}</TableCell>
                <TableCell>{produto.categoria}</TableCell>
                <TableCell>{produto.stock_atual}</TableCell>
                <TableCell>{produto.stock_minimo}</TableCell>
                <TableCell>{produto.unidade}</TableCell>
                <TableCell>{produto.localizacao}</TableCell>
                <TableCell>
                  {produto.stock_atual <= produto.stock_minimo ? (
                    <Chip label="Stock Baixo" color="warning" size="small" />
                  ) : (
                    <Chip label="OK" color="success" size="small" />
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(produto)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(produto.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para adicionar/editar produto */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduto ? 'Editar Produto' : 'Novo Produto'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Código"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
              >
                {categorias.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Unidade"
                name="unidade"
                value={formData.unidade}
                onChange={handleChange}
                required
              >
                {unidades.map((unid) => (
                  <MenuItem key={unid} value={unid}>
                    {unid}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Stock Atual"
                name="stock_atual"
                value={formData.stock_atual}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Stock Mínimo"
                name="stock_minimo"
                value={formData.stock_minimo}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type="number"
                label="Preço Unitário (€)"
                name="preco_unitario"
                value={formData.preco_unitario}
                onChange={handleChange}
                inputProps={{ step: "0.01" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Localização"
                name="localizacao"
                value={formData.localizacao}
                onChange={handleChange}
                placeholder="Ex: Armazém A - Prateleira 3"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingProduto ? 'Guardar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Produtos
