import { useState, useEffect } from 'react'
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material'
import InventoryIcon from '@mui/icons-material/Inventory'
import WarningIcon from '@mui/icons-material/Warning'
import PeopleIcon from '@mui/icons-material/People'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { supabase } from '../../services/supabase'

function Dashboard() {
  const [stats, setStats] = useState({
    totalProdutos: 0,
    produtosStockBaixo: 0,
    totalUtilizadores: 0,
    movimentosHoje: 0
  })
  const [produtosAlerta, setProdutosAlerta] = useState([])
  const [ultimosMovimentos, setUltimosMovimentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Total de produtos
      const { count: totalProdutos } = await supabase
          .from('produtos')
          .select('*', { count: 'exact', head: true })

      // Buscar todos os produtos primeiro
      const { data: todosProdutos } = await supabase
          .from('produtos')
          .select('*')

      // Filtrar manualmente os que têm stock baixo
      const produtosBaixo = todosProdutos?.filter(p => p.stock_atual <= p.stock_minimo).slice(0, 5) || []
      const countBaixo = todosProdutos?.filter(p => p.stock_atual <= p.stock_minimo).length || 0

      // Total de utilizadores
      const { count: totalUtilizadores } = await supabase
          .from('utilizadores')
          .select('*', { count: 'exact', head: true })

      // Movimentos de hoje
      const hoje = new Date().toISOString().split('T')[0]
      const { count: movimentosHoje } = await supabase
          .from('movimentos')
          .select('*', { count: 'exact', head: true })
          .gte('data', `${hoje}T00:00:00`)
          .lte('data', `${hoje}T23:59:59`)

      // Últimos 5 movimentos
      const { data: movimentos } = await supabase
          .from('movimentos')
          .select(`
          *,
          produtos (nome, codigo),
          utilizadores (nome)
        `)
          .order('data', { ascending: false })
          .limit(5)

      setStats({
        totalProdutos: totalProdutos || 0,
        produtosStockBaixo: countBaixo || 0,
        totalUtilizadores: totalUtilizadores || 0,
        movimentosHoje: movimentosHoje || 0
      })

      setProdutosAlerta(produtosBaixo || [])
      setUltimosMovimentos(movimentos || [])
      setError(null)
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err)
      setError('Erro ao carregar dados do dashboard')
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon, color }) => (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography color="textSecondary" gutterBottom variant="body2">
                {title}
              </Typography>
              <Typography variant="h4" component="div">
                {value}
              </Typography>
            </Box>
            <Box
                sx={{
                  backgroundColor: `${color}.light`,
                  borderRadius: '50%',
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
            >
              {icon}
            </Box>
          </Box>
        </CardContent>
      </Card>
  )

  if (loading) {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
    )
  }

  return (
      <Box sx={{ width: '100%' }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>

        {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
        )}

        {/* Cards de estatísticas */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
                title="Total de Produtos"
                value={stats.totalProdutos}
                icon={<InventoryIcon color="primary" />}
                color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
                title="Stock Baixo"
                value={stats.produtosStockBaixo}
                icon={<WarningIcon color="warning" />}
                color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
                title="Utilizadores"
                value={stats.totalUtilizadores}
                icon={<PeopleIcon color="success" />}
                color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
                title="Movimentos Hoje"
                value={stats.movimentosHoje}
                icon={<TrendingUpIcon color="info" />}
                color="info"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Alertas de Stock Baixo */}
          <Grid item xs={12} lg={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Alertas de Stock Baixo
              </Typography>
              {produtosAlerta.length === 0 ? (
                  <Typography color="textSecondary">
                    Nenhum produto com stock baixo
                  </Typography>
              ) : (
                  <List>
                    {produtosAlerta.map((produto) => (
                        <ListItem key={produto.id} divider>
                          <ListItemText
                              primary={produto.nome}
                              secondary={`Código: ${produto.codigo} | Stock: ${produto.stock_atual} / Mínimo: ${produto.stock_minimo}`}
                          />
                          <Chip label="Baixo" color="warning" size="small" />
                        </ListItem>
                    ))}
                  </List>
              )}4npm
            </Paper>
          </Grid>

          {/* Últimos Movimentos */}
          <Grid item xs={12} lg={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Últimos Movimentos
              </Typography>
              {ultimosMovimentos.length === 0 ? (
                  <Typography color="textSecondary">
                    Nenhum movimento registado!
                  </Typography>
              ) : (
                  <List>
                    {ultimosMovimentos.map((mov) => (
                        <ListItem key={mov.id} divider>
                          <ListItemText
                              primary={`${mov.produtos?.nome || 'Produto'} - ${mov.quantidade} ${mov.tipo === 'entrada' ? 'entrada' : 'saída'}`}
                              secondary={`${mov.utilizadores?.nome || 'Utilizador'} • ${new Date(mov.data).toLocaleString('pt-PT')}`}
                          />
                          <Chip
                              label={mov.tipo}
                              color={mov.tipo === 'entrada' ? 'success' : 'error'}
                              size="small"
                          />
                        </ListItem>
                    ))}
                  </List>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
  )
}

export default Dashboard