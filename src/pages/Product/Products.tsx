import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Link from '@mui/joy/Link';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { useEffect, useState } from 'react';
import { Container, Grid, createTheme } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Select, { selectClasses } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';

const defaultTheme = createTheme();

export default function ProductCard() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    fetch('https://localhost:44373/Product')
      .then(response => response.json())
      .then(data => {
        // 處理返回的商品列表
        console.log(data);
        setProducts(data);
      })
      .catch(error => {
        console.error('發稱錯誤:', error);
      });
  }, []);
  console.log("p", products)
  interface Product {
    productId: number;
    productName: string;
    categoryId: number;
    image: string;
    productPrice: number;
  }

  return (

    <Container sx={{ py: 4 }} maxWidth="md">
      {/* End hero unit */}
      <Grid container spacing={8}>
        {products.map((product) => (
          <Grid item key={product.productId} xs={12} sm={6} md={4}>
            <Card sx={{
              height: '100%', display: 'flex', flexDirection: 'column',
              maxWidth: '100%', boxShadow: 'lg'
            }}>
              <CardOverflow sx={{ height: '150' }}>
                {/* <AspectRatio sx={{ minWidth: 200 }}> */}
                <img
                  src={product.image}
                  // srcSet="https://images.unsplash.com/photo-1593121925328-369cc8459c08?auto=format&fit=crop&w=286&dpr=2 2x"
                  loading="lazy"
                  alt=""
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '150%'
                  }}
                />
                {/* </AspectRatio> */}
              </CardOverflow>
              <CardContent>
                {/* <Typography level="body-xs">{product.productName}</Typography> */}
                <Link
                  href="#product-card"
                  fontWeight="md"
                  color="neutral"
                  textColor="text.primary"
                  overlay
                  endDecorator={<ArrowOutwardIcon />}
                >
                  {product.productName}
                </Link>

                {/* <Typography
          level="title-lg"
          sx={{ mt: 1, fontWeight: 'xl' }}
          endDecorator={
            <Chip component="span" size="sm" variant="soft" color="success">
              最低價格
            </Chip>
          }
        >
           ${product.productPrice}
        </Typography>
        <Typography level="body-sm">
          (Only <b>7</b> left in stock!)
        </Typography> */}
                <br />
                <Select
                  placeholder="Select a pet…"
                  indicator={<KeyboardArrowDown />}
                  sx={{
                    width: 100,
                    [`& .${selectClasses.indicator}`]: {
                      transition: '0.2s',
                      [`&.${selectClasses.expanded}`]: {
                        transform: 'rotate(-180deg)',
                      },
                    },
                  }}
                >
                  {[...Array(20)].map((_, i) => {
                    return (
                      <Option value={i + 1} key={i}>{i + 1}</Option>
                    )
                  })}
                </Select>
              </CardContent>
              <CardOverflow>
                <Button variant="solid" color="primary" size="lg" >
                  {<ShoppingCartIcon />} 加入購物車
                </Button>
              </CardOverflow>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>

  );
}