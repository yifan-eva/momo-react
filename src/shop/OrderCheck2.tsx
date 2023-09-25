import * as React from 'react';
import Typography from '@mui/material/Typography';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import { useEffect, useState } from 'react';
import { Avatar, Box, Button, Container, TableFooter, TableRow, TableCell, Radio, RadioGroup, FormLabel, TableContainer, Table, TableHead, TableBody, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ListAltIcon from '@mui/icons-material/ListAlt';


export default function OrderCheck2() {
    const userId = localStorage.getItem("userId")
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    interface Order {
        orderId: string,
        userId: string,
        orderName: string,
        orderDate: string,
        orderTotal: string,
        place: string,
        pay: string,
        status: string,
    }
    const [orderItems, setOrderItemss] = useState<OrderItem[]>([]);
    interface OrderItem {
        orderId: string,
        orderItemId: string,
        productName: string,
        price: string,
        quantity: string,
        userId: string,
    }

    const handleBackClick = (id: string) => {
        navigate(`/OrderCheck3?orderid=` + id); // 导航到指定的路由
    };

    //判斷是否登入
    useEffect(() => {
        if (!userId) {
            alert("請先登入")
            navigate('/login');
        }
    }, [userId, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = localStorage.getItem("userId");
                console.log(userId);

                const response = await fetch(`https://localhost:44373/orders/userid` + userId, {
                    method: 'POST',
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                // 依照orderId降冪排列
                const sortedData = [...data].sort((a, b) => {
                    // 將orderId分析為數字，然後按數字降冪排列
                    return parseInt(b.orderId) - parseInt(a.orderId);
                });
                setOrders(sortedData);
            } catch (error) {
                console.error('發生錯誤:', error);
            }
        };
        fetchData();
    }, []);



    return (
        <Container component="main" sx={{ py: 8 }} maxWidth="md">
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
                        我的訂單
                    </Typography>
                </Box>
                <TableContainer sx={{ py: 1 }} >
                    <Typography>
                        <TableHead>
                            <TableRow>
                                <TableCell>訂單編號</TableCell>
                                <TableCell>收件人</TableCell>
                                <TableCell>收件地址</TableCell>
                                <TableCell>付款方式</TableCell>
                                <TableCell>貨品狀況</TableCell>
                                <TableCell>下單時間</TableCell>
                                <TableCell>詳細訂單資訊</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.orderId}>
                                    <TableCell>
                                        {order.orderId}
                                    </TableCell>
                                    <TableCell>
                                        {order.orderName}
                                    </TableCell>
                                    <TableCell >
                                        {order.place}
                                    </TableCell>
                                    <TableCell>
                                        {order.pay}
                                    </TableCell>
                                    <TableCell>
                                        {order.status}
                                    </TableCell>
                                    <TableCell>
                                        {order.orderDate}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleBackClick(order.orderId)}
                                        >
                                            詳細訂單資訊
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Typography>
                </TableContainer>
            </Grid>
        </Container >
    );
}