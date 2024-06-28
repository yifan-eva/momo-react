import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled, alpha } from '@mui/material/styles';
import { Avatar, Box, Button, Container, InputBase, TableRow, TableCell, TableContainer, TableHead, TableBody, Grid, Select, MenuItem, Toolbar } from '@mui/material';
import Navbar from '@/components/NavBar';

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
    const adminId = localStorage.getItem("admin")
    const token = localStorage.getItem("token")
    const navigate = useNavigate();
    const [orders, setOrders] = useState<Order[]>([]);
    const [searchTerm, setSearchTerm] = useState('')
    const [orderItems, setOrderItems] = useState<Order[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;
    const startIndex = (currentPage - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    const ordersToDisplay = orderItems.slice(startIndex, endIndex);
    const totalPages = Math.ceil(orderItems.length / ordersPerPage);

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
        navigate(`/AdminOrderItem?orderid=` + id);
    };

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

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            // 把要傳送的訊息封裝起來
            const data = {
                orderId: orderId,
                status: newStatus,
            };
            console.log("訂單", orderId, "狀態", newStatus)
            // 提示用戶確認
            const confirmed = window.confirm(`確定要將訂單狀態設為 ${newStatus} 嗎？`);

            if (!confirmed) {
                return; 
            }

            const response = await fetch('https://localhost:44373/orders/OrderStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    orderId: data.orderId,
                    Status: data.status
                }),
            });
            console.log(response)

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('請求失敗:', errorMessage);
            } else {
                // 更新前端訂單狀態
                const updatedOrders = orders.map((order) => {
                    if (order.orderId === orderId) {
                        order.status = newStatus;
                        console.log(newStatus)
                    }
                    return order;
                });

                console.log(orders)
                console.log(updatedOrders);
                setOrders(updatedOrders);
                alert('狀態更新成功')
                console.log('訂單狀態已更新');
            }
        } catch (error) {
            console.error('錯誤:', error);
            navigate('/Authorization')
        }
    };

    //判斷是否登入
    useEffect(() => {
        if (!adminId) {
            alert("未登入無法進入")
            navigate('/AdminLogin');
        }
    }, [adminId, navigate]);

    useEffect(() => {
        // 當搜索關鍵字發生變化時執行搜索
        handleSearch();
    }, [searchTerm]);

    useEffect(() => {
        // 初始化 orderItems，顯示所有訂單
        setOrderItems(orders);
    }, [orders]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://localhost:44373/orders/all`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                // 按照訂單ID降冪排序
                const sortedData = [...data].sort((a, b) => {
                    // 將ID解析為數字再加以排序
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
        <Navbar>
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
                                    <ReceiptLongIcon />
                                </Avatar>
                                <Typography component="h1" variant="h5">
                                    訂單資訊
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
                                    <TableCell sx={{ px: 1 }}>訂單編號</TableCell>
                                    <TableCell sx={{ px: 1 }} >會員</TableCell>
                                    <TableCell sx={{ px: 1 }} >付款方式</TableCell>
                                    <TableCell sx={{ px: 3 }} >收件地址</TableCell>
                                    <TableCell sx={{ px: 1 }} >下單時間</TableCell>
                                    <TableCell sx={{ px: 2 }} >貨品狀況</TableCell>
                                    <TableCell sx={{ px: 2 }} >詳細訂單資訊</TableCell>
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
                                            <TableCell sx={{ px: 1 }}>
                                                {order.orderId}
                                            </TableCell>
                                            <TableCell sx={{ px: 1 }}>
                                                {order.userId}
                                            </TableCell>
                                            <TableCell sx={{ px: 1 }}>
                                                {order.pay}
                                            </TableCell>
                                            <TableCell sx={{ px: 3 }}>
                                                {order.place}
                                            </TableCell>
                                            <TableCell sx={{ px: 1 }}>
                                                {order.orderDate}
                                            </TableCell>
                                            <TableCell sx={{ px: 2 }}>
                                                <Select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                                                >
                                                    <MenuItem value="待出貨">待出貨</MenuItem>
                                                    <MenuItem value="已出貨">已出貨</MenuItem>
                                                    <MenuItem value="已送達">已送達</MenuItem>
                                                </Select>
                                            </TableCell>
                                            <TableCell sx={{ px: 2 }}>
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
                </Grid >
            </Container >
        </Navbar>
    );
}