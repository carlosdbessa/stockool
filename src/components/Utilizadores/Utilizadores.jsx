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
  Card,
  CardContent,
  CardActions,
  useMediaQuery,
  useTheme
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { supabase } from '../../services/supabase'

function Utilizadores() {
  const [utilizadores, setUtilizadores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingUtilizador, setEditingUtilizador] = useState(null)
  const [formData, setFormData] = useState({
    nome: '',
    email: ''
  })

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    loadUtilizadores()
  }, [])

  const loadUtilizadores = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
          .from('utilizadores')
          .select('*')
          .order('nome', { ascending: true })

      if (error) throw error
      setUtilizadores(data || [])
    } catch (err) {
      console.error('Erro ao carregar utilizadores:', err)
      setError('Erro ao carregar utilizadores')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (utilizador = null) => {
    if (utilizador) {
      setEditingUtilizador(utilizador)
      setFormData({
        nome: utilizador.nome,
        email: utilizador.email
      })
    } else {
      setEditingUtilizador(null)
      setFormData({
        nome: '',
        email: ''
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingUtilizador(null)
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
      if (editingUtilizador) {
        const { error } = await supabase
            .from('utilizadores')
            .update(formData)
            .eq('id', editingUtilizador.id)

        if (error) throw error
      } else {
        const { error } = await supabase
            .from('utilizadores')
            .insert([formData])

        if (error) throw error
      }

      handleCloseDialog()
      loadUtilizadores()
      setError(null)
    } catch (err) {
      console.error('Erro ao guardar utilizador:', err)
      setError(err.message || 'Erro ao guardar utilizador')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja eliminar este utilizador?')) {
      try {
        const { error } = await supabase
            .from('utilizadores')
            .delete()
            .eq('id', id)

        if (error) throw error
        loadUtilizadores()
        setError(null)
      } catch (err) {
        console.error('Erro ao eliminar utilizador:', err)
        setError('Erro ao eliminar utilizador. Pode ter movimentos associados.')
      }
    }
  }

  // Versão Mobile - Cards
  const MobileView = () => (
      <Box>
        {utilizadores.map((utilizador) => (
            <Card key={utilizador.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {utilizador.nome}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Email:</strong> {utilizador.email}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  <strong>Registo:</strong> {new Date(utilizador.created_at).toLocaleDateString('pt-PT')}
                </Typography>
              </CardContent>

              <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(utilizador)}
                    color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                    size="small"
                    onClick={() => handleDelete(utilizador.id)}
                    color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
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
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Data de Registo</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {utilizadores.map((utilizador) => (
                <TableRow key={utilizador.id}>
                  <TableCell>{utilizador.nome}</TableCell>
                  <TableCell>{utilizador.email}</TableCell>
                  <TableCell>
                    {new Date(utilizador.created_at).toLocaleDateString('pt-PT')}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(utilizador)}
                        color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => handleDelete(utilizador.id)}
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
  )

  return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Utilizadores</Typography>
          <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              size={isMobile ? "medium" : "large"}
          >
            {isMobile ? "Novo" : "Novo Utilizador"}
          </Button>
        </Box>

        {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
        )}

        {isMobile ? <MobileView /> : <DesktopView />}

        {/* Dialog para adicionar/editar utilizador */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingUtilizador ? 'Editar Utilizador' : 'Novo Utilizador'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
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
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancelar</Button>
            <Button onClick={handleSubmit} variant="contained">
              {editingUtilizador ? 'Guardar' : 'Criar'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
  )
}

export default Utilizadores