import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link } from '@mui/material';

function Copyright() {
    return (
      <Typography  color="text.secondary" align="center">
        {'Copyright © '}
        <Link  href="https://mui.com/">
          momo-fan
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

  export default function Footer() {
    return (
        <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
            <Copyright /> 
        </Box>
    )
  }