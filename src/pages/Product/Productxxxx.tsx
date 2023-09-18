import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { CardActionArea } from '@mui/material';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Product() {
  const [products, setProducts] = useState<Product[]>([]);
    useEffect(() => {
      fetch('https://localhost:44373/Product')
      .then(response => response.json())
      .then(data => {
        // 在这里处理返回的产品列表数据
        console.log(data);
        setProducts(data);
        })
      .catch(error => {
        console.error('发生错误:', error);
        });
}, []);
console.log("p",products)
interface Product {
  productId: number;
  productName: string;
  description:string;
  categoryId:number;
  image:string;
  productPrice:number;
  // 其他产品属性
}

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 5,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h2"
              variant="h3"
              align="center"
              color="text.primary"
              gutterBottom
            >
              產品頁面
            </Typography>
          </Container>
        </Box>
        <Container sx={{ py: 2 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {products.map((product) => (
              <Grid item key={product.productId} xs={12} sm={6} md={4}>
                {/* <CardActionArea 
                  sx={{transition:'transform 0.2s,box-shadow 0.2s', 
                  ',hover':{
                    transform:'translate(-5px)',
                    boxShadow:'0 0 10px rgba(0,0,0,0.5)',
                  }}}> */}
                <CardActionArea href='https://mui.com/material-ui/getting-started/'
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column',
                  }}>
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt="green iguana"
                    sx={{
                      pt:'0%',
                      image:{
                        objectFit:'cover',
                        width:'100%',
                        height:'100%'
                      }
                    }}
                  />
                    <CardContent sx={{ flexGrow: 3 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {product.productName}
                      </Typography>
                      <Typography>
                        ${product.productPrice}
                      </Typography>
                    </CardContent>
                    <CardActions >
                      <Button size="small" startIcon={<ShoppingCartIcon />} variant="outlined"
                        href='https://www.google.com/?authuser=0' >
                        加入購物車
                      </Button>
                    </CardActions>
                </CardActionArea>
                  {/* </CardActionArea> */}
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}