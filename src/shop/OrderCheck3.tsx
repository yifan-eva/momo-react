import Typography from '@mui/material/Typography';
import ForwardIcon from '@mui/icons-material/Forward';
import { useEffect, useState } from 'react';
import { Avatar, Box, Button, Container, TableRow, TableCell, TableContainer,  TableHead, TableBody, Grid } from '@mui/material';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import ListAltIcon from '@mui/icons-material/ListAlt';


export default function OrderCheck2() {
    const location = useLocation();
    const navigate = useNavigate();
    const [search, setSearch] = useSearchParams();
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const userId = localStorage.getItem("userId")
    const token = localStorage.getItem("token")
    interface OrderItem {
        orderId: string,
        orderItemId: string,
        productName: string,
        price: string,
        quantity: string,
        userId: string,
    }
    const handleBackClick = () => {
        navigate(`/OrderCheck2?userid=${userId}`); 
    };

    //判斷是否登入
    useEffect(() => {
        if (!userId) {
            alert("請先登入")
            navigate('/login');
        }
    }, [userId, navigate]);

    useEffect(() => {
        const id = search.get("orderid");
        console.log("id", id)
        const fetchData = async () => {
            try {
                const response = await fetch(`https://localhost:44373/orders/orderid` + id, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearea ${token}`
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('order', data);
                setOrderItems(data);
                // 在数据加载完成后才执行相关操作
            } catch (error) {
                console.error('發生錯誤:', error);
                navigate('/Authorization')
            }
        };
        fetchData();
    }, [location]);


    return (
        <Container component="main" sx={{ py: 8, width: '600px' }} maxWidth="md">
            <Grid container spacing={8}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >
                    < Avatar sx={{ m: 3, bgcolor: 'secondary.main' }}>
                        <ListAltIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        訂單詳細資訊
                    </Typography>
                </Box>
                <TableContainer sx={{ py: 1 }} >
                    <Typography>
                        <TableHead>
                            <TableRow>
                                <TableCell>產品名稱</TableCell>
                                <TableCell>產品價錢</TableCell>
                                <TableCell>購買數量</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orderItems.map((orderItem) => (
                                <TableRow >
                                    <TableCell>
                                        {orderItem.productName}
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                        ${orderItem.price}
                                    </TableCell>
                                    <TableCell style={{ textAlign: 'center' }}>
                                        {orderItem.quantity}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <Button variant="outlined" color="primary" onClick={handleBackClick} style={{ marginTop: '20px', marginBottom: '10px' }}>
                            {<ForwardIcon sx={{ transform: 'rotate(180deg)' }} />} 回到我的訂單
                        </Button>
                    </Typography>
                </TableContainer>
            </Grid >
        </Container >
    );
}