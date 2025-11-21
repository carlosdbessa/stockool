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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
  useMediaQuery,
  useTheme
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { supabase } from '../../services/supabase'

function Movimentos() {
  const [movimentos, setMovimentos] = useState([])
  const [produtos, setProdutos] = useState([])
  const [utilizadores, setUtilizadores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [formData, setFormData] = useState({
    produto_id: '',
    utilizador_id: '',
    tipo: 'saida',
    quantidade: 1,
    observacoes: ''
  })

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      const { data: movimentosData, error: movError } = await supabase
          .from('movimentos')
          .select(`
          *,
          produtos (nome, codigo, unidade),
          utilizadores (nome)
        `)
          .order('data', { ascending: false })
          .limit(100)

      if (movError) throw movError

      const { data: produtosData, error: prodError } = await supabase
          .from('produtos')
          .select('*')
          .order('nome', { ascending: true })

      if (prodError) throw prodError

      const { data: utilizadoresData, error: userError } = await supabase
          .from('utilizadores')
          .select('*')
          .order('nome', { ascending: true })

      if (userError) throw userError

      setMovimentos(movimentosData || [])
      setProdutos(produtosData || [])
      setUtilizadores(utilizadoresData || [])
      setError(null)
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
      setError('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = () => {
    setFormData({
      produto_id: '',
      utilizador_id: '',
      tipo: 'saida',
      quantidade: 1,
      observacoes: ''
    })
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
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
      if (!formData.produto_id || !formData.utilizador_id) {
        setError('Selecione o produto e o utilizador')
        return
      }

      if (formData.quantidade <= 0) {
        setError('A quantidade deve ser maior que zero')
        return
      }

      const { data: produto, error: prodError } = await supabase
          .from('produtos')
          .select('stock_atual')
          .eq('id', formData.produto_id)
          .single()

      if (prodError) throw prodError

      const stockAnterior = produto.stock_atual
      let novoStock

      if (formData.tipo === 'entrada') {
        novoStock = stockAnterior + parseInt(formData.quantidade)
      } else {
        if (stockAnterior < parseInt(formData.quantidade)) {
          setError('Stock insuficiente para esta operação')
          return
        }
        novoStock = stockAnterior - parseInt(formData.quantidade)
      }

      const { error: movError } = await supabase
          .from('movimentos')
          .insert([{
            produto_id: formData.produto_id,
            utilizador_id: formData.utilizador_id,
            tipo: formData.tipo,
            quantidade: parseInt(formData.quantidade),
            stock_anterior: stockAnterior,
            stock_novo: novoStock,
            data: new Date().toISOString(),
            observacoes: formData.observacoes
          }])

      if (movError) throw movError

      const { error: updateError } = await supabase
          .from('produtos')
          .update({ stock_atual: novoStock })
          .eq('id', formData.produto_id)

      if (updateError) throw updateError

      handleCloseDialog()
      loadData()
      setError(null)
    } catch (err) {
      console.error('Erro ao registar movimento:', err)
      setError(err.message || 'Erro ao registar movimento')
    }
  }

  // Versão Mobile - Cards
  const MobileView = () => (
      <Box>
        {movimentos.map((movimento) => (
            <Card key={movimento.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" component="div">
                    {movimento.produtos?.nome || 'N/A'}
                  </Typography>
                  <Chip
                      label={movimento.tipo}
                      color={movimento.tipo === 'entrada' ? 'success' : 'error'}
                      size="small"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Código:</strong> {movimento.produtos?.codigo || 'N/A'}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Utilizador:</strong> {movimento.utilizadores?.nome || 'N/A'}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Quantidade:</strong> {movimento.quantidade} {movimento.produtos?.unidade || ''}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Stock:</strong> {movimento.stock_anterior} → {movimento.stock_novo}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Data:</strong> {new Date(movimento.data).toLocaleString('pt-PT')}
                </Typography>

                {movimento.observacoes && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      <strong>Obs:</strong> {movimento.observacoes}
                    </Typography>
                )}
              </CardContent>
            </Card>
        ))}
      </Box>
  )

  // Versão Desktop - Tabela
  const DesktopView = () => (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data/Hora</TableCell>
              <TableCell>Produto</TableCell>
              <TableCell>Utilizador</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Quantidade</TableCell>
              <TableCell>Stock Anterior</TableCell>
              <TableCell>Stock Novo</TableCell>
              <TableCell>Observações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movimentos.map((movimento) => (
                <TableRow key={movimento.id}>
                  <TableCell>
                    {new Date(movimento.data).toLocaleString('pt-PT')}
                  </TableCell>
                  <TableCell>
                    {movimento.produtos?.nome || 'N/A'}
                    <br />
                    <Typography variant="caption" color="textSecondary">
                      {movimento.produtos?.codigo || ''}
                    </Typography>
                  </TableCell>
                  <TableCell>{movimento.utilizadores?.nome || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip
                        label={movimento.tipo}
                        color={movimento.tipo === 'entrada' ? 'success' : 'error'}
                        size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {movimento.quantidade} {movimento.produtos?.unidade || ''}
                  </TableCell>
                  <TableCell>{movimento.stock_anterior}</TableCell>
                  <TableCell>{movimento.stock_novo}</TableCell>
                  <TableCell>{movimento.observacoes || '-'}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  )

  return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Movimentos</Typography>
          <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
              size={isMobile ? "medium" : "large"}
          >
            {isMobile ? "Novo" : "Novo Movimento"}
          </Button>
        </Box>

        {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
        )}

        {isMobile ? <MobileView /> : <DesktopView />}

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Novo Movimento de Stock</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel id="produto-label">Produto</InputLabel>
                    <Select
                        labelId="produto-label"
                        name="produto_id"
                        value={formData.produto_id}
                        onChange={handleChange}
                        label="Produto"
                    >
                      {produtos.map((produto) => (
                          <MenuItem key={produto.id} value={produto.id}>
                            {produto.nome} ({produto.codigo}) - Stock: {produto.stock_atual}
                          </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel id="utilizador-label">Utilizador</InputLabel>
                    <Select
                        labelId="utilizador-label"
                        name="utilizador_id"
                        value={formData.utilizador_id}
                        onChange={handleChange}
                        label="Utilizador"
                    >
                      {utilizadores.map((utilizador) => (
                          <MenuItem key={utilizador.id} value={utilizador.id}>
                            {utilizador.nome}
                          </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <FormControl fullWidth required>
                    <InputLabel id="tipo-label">Tipo</InputLabel>
                    <Select
                        labelId="tipo-label"
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleChange}
                        label="Tipo"
                    >
                      <MenuItem value="entrada">Entrada</MenuItem>
                      <MenuItem value="saida">Saída</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                      fullWidth
                      type="number"
                      label="Quantidade"
                      name="quantidade"
                      value={formData.quantidade}
                      onChange={handleChange}
                      required
                      inputProps={{ min: 1 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                      fullWidth
                      label="Observações"
                      name="observacoes"
                      value={formData.observacoes}
                      onChange={handleChange}
                      multiline
                      rows={3}
                      placeholder="Motivo da movimentação, projeto, etc..."
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button onClick={handleSubmit} variant="contained">
              Registar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
  )
}

export default Movimentos