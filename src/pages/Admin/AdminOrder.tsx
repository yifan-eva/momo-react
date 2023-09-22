import * as React from 'react';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Avatar, Box, Button, Container, InputBase, TableRow, TableCell, TableContainer, TableHead, TableBody, Grid } from '@mui/material';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    border: '1px solid black', // 添加黑色边框
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));
//搜尋欄的定位
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));
//搜尋欄位
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(0)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

type Order = {
    orderId: string,
    userId: string,
    orderName: string,
    orderDate: string,
    orderTotal: string,
    place: string,
    pay: string,
    status: string
}
export default function AdminMember() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const userId = localStorage.getItem("userid")
    const amdinId = localStorage.getItem("admin")
    const [searchTerm, setSearchTerm] = useState('')
    const [orderItems, setOrderItems] = useState<Order[]>([]);

    const handleBackClick = (id: string) => {
        navigate(`/AdminOrderItem?orderid=` + id); // 导航到指定的路由
    };

    const handleSearch = () => {
        // 使用filter方法篩選符合搜索條件的訂單
        const filteredOrders = orders.filter((order) => {
            return (
                String(order.orderId).toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(order.userId).toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(order.place).toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(order.pay).toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(order.status).toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(order.orderDate).toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
        // 更新訂單列表
        setOrderItems(filteredOrders);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://localhost:44373/orders/all`, {
                    method: 'POST',
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('order', data);
                setOrders(data);
                // 在数据加载完成后才执行相关操作
            } catch (error) {
                console.error('發生錯誤:', error);
            }
        };
        fetchData();
    }, []);

    //判斷是否登入
    useEffect(() => {
        if (!amdinId) {
            alert("未登入無法進入")
            navigate('/AdminLogin');
        }
    }, [userId, navigate]);

    useEffect(() => {
        // 當搜索關鍵字發生變化時執行搜索
        handleSearch();
    }, [searchTerm]);

    useEffect(() => {
        // 初始化 orderItems，顯示所有訂單
        setOrderItems(orders);
    }, [orders]);

    return (
        <Container component="main" sx={{ py: 8 }} maxWidth="md">
            <Grid container spacing={8}>
                <TableRow>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                        <Search>
                            <SearchIcon
                                onClick={handleSearch}
                                style={{ cursor: 'pointer' }}
                                role="button"
                                tabIndex={0}
                            />
                            <SearchIconWrapper>
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="搜尋"
                                inputProps={{ 'aria-label': 'search' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyUp={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch();
                                    }
                                }}
                            />
                        </Search>
                    </TableCell>
                </TableRow>
                <TableContainer sx={{ py: 1 }} >
                    <Typography>
                        <TableHead>
                            <TableRow>
                                <TableCell>訂單編號</TableCell>
                                <TableCell>會員</TableCell>
                                <TableCell>收件地址</TableCell>
                                <TableCell>付款方式</TableCell>
                                <TableCell>貨品狀況</TableCell>
                                <TableCell>下單時間</TableCell>
                                <TableCell>詳細訂單資訊</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orderItems.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7}>找不到此項目</TableCell>
                                </TableRow>
                            ) : (
                                orderItems.map((order) => (
                                    <TableRow key={order.orderId}>
                                        <TableCell>
                                            {order.orderId}
                                        </TableCell>
                                        <TableCell>
                                            {order.userId}
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
                                ))
                            )}
                        </TableBody>
                    </Typography>
                </TableContainer>
            </Grid >
        </Container >
    );
}