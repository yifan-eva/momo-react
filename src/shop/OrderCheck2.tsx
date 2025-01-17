import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Avatar, Box, Button, Container, TableRow, TableCell, TableContainer, TableHead, TableBody, Grid, InputBase, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SearchIcon from '@mui/icons-material/Search';

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

export default function OrderCheck2() {
    const userId = localStorage.getItem("userId")
    const token = localStorage.getItem("token")
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [orderItems, setOrderItems] = useState<Order[]>([]);
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    //silce(開始位置,結束位置)
    const ordersToDisplay = orderItems.slice(startIndex, endIndex);
    const totalPages = Math.ceil(orderItems.length / ordersPerPage);

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
    const handleBackClick = (id: string) => {
        navigate(`/OrderCheck3?orderid=` + id);
    };

    useEffect(() => {
        // 初始化 orderItems，顯示所有訂單
        setOrderItems(orders);
    }, [orders]);

    const handleSearch = () => {
        // 使用filter方法篩選符合搜索條件的訂單
        const filteredOrders = orders.filter((order) => {
            return (
                String(order.orderId).toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(order.userId).toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(order.place).toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(order.pay).toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(order.status).toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
        // 更新訂單列表
        setOrderItems(filteredOrders);
        setCurrentPage(1);
    };

    useEffect(() => {
        // 當搜索關鍵字發生變化時執行搜索
        handleSearch();
    }, [searchTerm]);

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
                const response = await fetch(`https://localhost:44373/orders/userid`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    throw new Error('連接失敗');
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
                navigate('/Authorization')
            }
        };
        fetchData();
    }, []);



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
                                我的訂單
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
                                <TableCell>收件人</TableCell>
                                <TableCell>收件地址</TableCell>
                                <TableCell>付款方式</TableCell>
                                <TableCell>貨品狀況</TableCell>
                                <TableCell>下單時間</TableCell>
                                <TableCell>詳細訂單資訊</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ordersToDisplay.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7}>找不到此項目</TableCell>
                                </TableRow>
                            ) : (

                                ordersToDisplay.map((order) => (
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
                                ))
                            )}
                        </TableBody>
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
                            <span>{currentPage}/{totalPages}</span>
                            <Button
                                sx={{
                                    py: 1,
                                    marginLeft: 1,
                                }}
                                variant="outlined"
                                color="primary"
                                onClick={handleNextPage}
                            >
                                下一頁
                            </Button>
                        </Toolbar>
                    </Typography>
                </TableContainer>
            </Grid>
        </Container >
    );
}