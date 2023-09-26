import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Link from '@mui/joy/Link';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { useEffect, useState } from 'react';
import { Container, Grid, Pagination, Snackbar, Toolbar } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

export default function ProductCard() {
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9); // 每页显示的商品数量
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);


  useEffect(() => {
    const categoryId = search.get("categoryId");
    const keyword = search.get("keyword");

    let params = ''
    let url = 'https://localhost:44373/ProductCategory';
    // 檢查是否有 categoryId 參數
    if (categoryId) {
      params += `?categoryId=${categoryId}`;
    }
    // 檢查是否有 keyword 參數
    if (params !== '' && keyword) {
      // 如果已經有查詢參數用&做連接
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

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  console.log("p", products)
  interface Product {
    productId: number;
    productName: string;
    categoryId: number;
    image: string;
    productPrice: number;
    status: string;
  }

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
        const result = await response.json();
        if (response.ok) {
          setSnackbarMessage(`成功將 ${product.productName} 添加到購物車`);
          setSnackbarOpen(true);
        } else {
          setSnackbarMessage(`加入購物車失敗: ${result.errorMessage}`);
          setSnackbarOpen(true);
        }
      } else {
        alert('請先登錄以添加產品到購物車。');
        navigate('/login');
      }
    } catch (error: any) {
      setSnackbarMessage(`加入購物車失敗: ${error.message}`);
      setSnackbarOpen(true);
    }
  };

  return (
    //與上方的距離
    <Container sx={{ py: 4 }} maxWidth="md">
      {/* 每個項目上下左右間距 */}
      <Grid container spacing={8}>
        {currentProducts.map((product) => (
          <Grid item key={product.productId} xs={12} sm={6} md={4}>
            <Card sx={{
              height: '100%', display: 'flex', flexDirection: 'column',
              maxWidth: '100%', boxShadow: 'lg'
            }}>
              <CardOverflow sx={{ height: '150' }}>
                <img
                  src={product.image}
                  loading="lazy"
                  alt=""
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '150%'
                  }}
                />
              </CardOverflow>
              <CardContent>
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
                <Snackbar
                  open={snackbarOpen}
                  autoHideDuration={3000}
                  onClose={() => setSnackbarOpen(false)}
                  message={snackbarMessage}
                  sx={{
                    '& .MuiSnackbarContent-root': {
                      backgroundColor: 'green',
                      boxShadow: 'none',
                    },
                  }}
                />
              </CardOverflow>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Pagination
        count={Math.ceil(products.length / productsPerPage)}
        page={currentPage}
        onChange={(event, page) => setCurrentPage(page)}
      />
      <Toolbar>
        <Button
          sx={{
            py: 1,
            marginRight: 1,
          }}
          variant="outlined"
          color="primary"
          onClick={handlePreviousPage}
        >
          上一頁
        </Button>
        <Button
          sx={{
            py: 1,
          }}
          variant="outlined"
          color="primary"
          onClick={handleNextPage}
        >
          下一頁
        </Button>
      </Toolbar>
    </Container>

  );
}
