import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import { useEffect, useState } from 'react';
import { Container, Snackbar, createTheme } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Select, { selectClasses } from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import ForwardIcon from '@mui/icons-material/Forward';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ProductCard() {
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();
    const [search, setSearch] = useSearchParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleButtonClick = () => {
        navigate('/Product');
    };

    interface Product {
        productId: number;
        productName: string;
        categoryId: number;
        image: string;
        productPrice: number;
        description: string
    }


    const handleAddToCart = async (product: Product) => {
        try {
            if (userId != null) {
                const cartItem = new FormData();
                cartItem.append('userId', userId);
                cartItem.append('productId', product.productId.toString());
                cartItem.append('quantity', '1');
                cartItem.append('productName', product.productName.toString());
                cartItem.append('productPrice', product.productPrice.toString())

                const response = await fetch('https://localhost:44373/CartMember/add', {
                    method: 'POST',
                    body: cartItem,
                });
                // if (respnse.ok) {
                if (response.ok) {
                    setSnackbarMessage(`成功將 ${product.productName} 添加到購物車`);
                    setSnackbarOpen(true);
                    console.log("1", snackbarMessage)
                    console.log("2", snackbarOpen)
                } else {
                    const result = await response.json();
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

    useEffect(() => {
        console.log('bb', search.get("productId"));
        fetch('https://localhost:44373/ProductProfile/' + search.get("productId"))
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setProduct(data)
            })
            .catch(error => {
                console.error('發稱錯誤:', error);
            });
    }, []);

    return (
        <Container sx={{ py: 2 }} maxWidth="md">
            {product && (
                <Card sx={{
                    height: '100%', display: 'flex', flexDirection: 'column',
                    maxWidth: '100%', boxShadow: 'lg'
                }}>
                    <CardContent>
                        <img
                            src={product.image}
                            loading="lazy"
                            alt=""
                            style={{
                                objectFit: 'cover',
                                width: '100%',
                                height: '100%'
                            }}
                        />
                        <br />
                        <h2>{product.productName}</h2>
                        <br />
                        <div>商品介紹: {product.description}</div>
                        <br />
                        <div>價格: ${product.productPrice}</div>
                    </CardContent>
                    <CardContent>
                        <Button variant="solid" color="primary" size="lg"
                            onClick={() => handleAddToCart(product)}>
                            {<ShoppingCartIcon />} 加入購物車
                        </Button>
                    </CardContent>
                </Card>
            )}
            <br />
            <Button variant="outlined" color="primary" size="lg" onClick={handleButtonClick}>
                {<ForwardIcon sx={{ transform: 'rotate(180deg)' }} />} 返到商品頁面
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
        </Container >
    );
}
