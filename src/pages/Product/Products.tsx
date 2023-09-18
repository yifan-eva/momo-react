import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Link from '@mui/joy/Link';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

export default function ProductCard() {
  // const [state, dispatch] = useContext(CartContext);
  const [search, setSearch] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const location = useLocation();
  useEffect(() => {
    const categoryId = search.get("categoryId");
    const keyword = search.get("keyword");
    console.log(keyword)
    let params = ''
    let url = 'https://localhost:44373/ProductCategory';
    // 檢查是否有 categoryId 參數
    if (categoryId) {
      params += `?categoryId=${categoryId}`;
    }
    // 檢查是否有 keyword 參數
    if (params !== '' && keyword) {
      // 如果已经有查巡參數，使用 '&' 连接
      params += `&keyword=${keyword}`;
    } else if (keyword) {
      params += `?keyword=${keyword}`;
    }
    fetch(url + params)
      .then(response => response.json())
      .then(data => {
        // 處理返回的商品列表
        console.log(data);
        setProducts(data);
      })
      .catch(error => {
        console.error('發生錯誤:', error);
      });
  }, [location]);

  console.log("p", products)
  interface Product {
    productId: number;
    productName: string;
    categoryId: number;
    image: string;
    productPrice: number;
  }

  const [selectedQuantities, setSelectedQuantities] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false); 
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  
  const handleAddToCart = async (product: Product) => {
    try {
        if (userId != null) {
            const cartItem = new FormData();
            cartItem.append('userId', userId);
            cartItem.append('productId', product.productId.toString()); 
            cartItem.append('quantity', '1'); // 如果quantity也是数字，可以直接传递数字
            cartItem.append('productName', product.productName.toString()); // 如果quantity也是数字，可以直接传递数字
            cartItem.append('productPrice', product.productPrice.toString())

            const response = await fetch('https://localhost:44373/CartMember/add', {
                method: 'POST',
                body: cartItem,
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setSnackbarMessage(`成功將 ${product.productName} 添加到購物車`);
                    setSnackbarOpen(true);
                } else {
                    setSnackbarMessage(`加入購物車失敗: ${result.errorMessage}`);
                    setSnackbarOpen(true);
                }
            } else {
                throw new Error('网络请求失败');
            }
        } else {
            alert('請先登錄以添加產品到購物車。');
            navigate('/login');
        }
    } catch (error : any) {
        setSnackbarMessage(`加入購物車失敗: ${error.message}`);
        setSnackbarOpen(true);
    }
};

  return (
    //與上方的距離
    <Container sx={{ py: 4 }} maxWidth="md">
      {/* End hero unit */}
      {/* 每個項目上下左右間距 */}
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
                  href={`/Demo/ProductProfile?productId=${product.productId}`}
                  fontWeight="md"
                  color="neutral"
                  textColor="text.primary"
                  overlay
                  endDecorator={<ArrowOutwardIcon />}
                >
                  {product.productName}
                </Link>
                <br />
                ${product.productPrice}
                <br />
              </CardContent>
              <CardOverflow>
                <Button variant="solid" color="primary" size="lg"
                onClick={() => handleAddToCart(product)}>
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
