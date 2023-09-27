import Navbar from '@/components/NavBar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'

function AdminIndex() {
  return (
    <Navbar>
        <Container component='main' maxWidth='xs'>
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Box component='form' noValidate sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <h1>管理者頁面</h1>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
    </Navbar>
  )
}

export default AdminIndex
