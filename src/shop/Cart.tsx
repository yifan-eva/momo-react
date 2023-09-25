import { Button, TableCell, TableContainer, Table, TableHead, TableBody, TableRow, Select, MenuItem, Typography, TableFooter, Container, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import ForwardIcon from '@mui/icons-material/Forward';
import { useNavigate } from 'react-router-dom';

interface CartItem {
    userToken: string;
    productId: number;
    productName: string;
    productPrice: number;
    quantity: number;
}
export default function Cart() {
    const userId = localStorage.getItem('userId');
    const [cartData, setCartData] = useState<CartItem[]>([]);
    const [itemQuantities, setItemQuantities] = useState<{ [productId: string]: number }>({});
    const navigate = useNavigate();

    const handleBackClick = () => {
        navigate('/Product'); // 导航到指定的路由
    };

    const handleShopClick = () => {
        navigate('/OrderCheck1'); // 导航到指定的路由
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('https://localhost:44373/CartMember/' + localStorage.getItem('userId'), {
                method: 'POST',
            });

            if (response.ok) {
                const data = await response.json();
                setCartData(data);
                console.log("data", data)
                // 处理从后端收到的购物车商品数据
                const quantities: { [productId: string]: number } = {};
                data.forEach((item: { productId: string | number; quantity: number; }) => {
                    quantities[item.productId] = item.quantity;
                });
                setItemQuantities(quantities);
            } else {
                console.error('發生錯誤:', response);
                // 处理请求失败的情况
            }
        } catch (error) {
            console.error('發生錯誤:', error);
            // 处理请求错误
        }
    }
    //更新購物車
    const updateCartItemQuantity = async (userId: string, productId: string, newQuantity: number) => {
        try {
            const updateDto = {
                userId: userId,
                productId: productId,
                quantity: newQuantity,
            };
            const response = await fetch('https://localhost:44373/CartMember/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateDto),
            });

            if (response.ok) {
                // 更新购物车项成功
                // 可以选择刷新购物车数据或者执行其他操作
                fetchData(); // 刷新购物车数据
            } else {
                // 处理更新失败的情况
                console.error('更新失败:', response);
            }
        } catch (error) {
            // 处理请求错误
            console.error('更新失败:', error);
        }
    };

    const handleQuantityChange = async (e: { target: { value: any; }; }, userId: string, productId: string) => {
        const newQuantity = parseInt(e.target.value, 10);
        updateCartItemQuantity(userId, productId, newQuantity);
    };

    // 移除购物车中的商品
    const removeCartItem = async (userId: string, productId: any) => {
        try {
            const removeDto = {
                productId: productId, userId: userId
            }
            const response = await fetch('https://localhost:44373/CartMember/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(removeDto),
            });

            if (response.ok) {
                // 处理删除成功的情况
                const updatedCartData = cartData.filter(item => item.productId !== productId);
                setCartData(updatedCartData);
            } else {
                // 处理请求失败的情况
            }
        } catch (error) {
            // 处理请求错误
        }
    };
    //判斷是否登入
    useEffect(() => {
        if (!userId) {
            alert("請先登入")
            navigate('/login');
        }
    }, [userId, navigate]);

    return (
        <Container sx={{ py: 8 }} maxWidth="md">
            {cartData.length === 0 ? (
                <Container component="main" maxWidth="xs"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        paddingTop: '64px'
                    }}>
                    <Typography variant="h5">目前購物車沒有東西喔!</Typography>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleBackClick}
                        style={{ marginTop: '16px' }}>
                        {<ForwardIcon sx={{ transform: 'rotate(180deg)' }} />} 返到商品頁面
                    </Button>
                </Container>
            ) : (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>商品</TableCell>
                                <TableCell>數量</TableCell>
                                <TableCell>小計</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cartData.map((item: any) => (
                                <TableRow>
                                    {/* <TableRow key={item.productId}> */}
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => removeCartItem(item.userId, item.productId)}
                                        >
                                            x
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        {item.productName}
                                        <br />
                                        <Typography variant="body2" color="textSecondary">
                                            NT$
                                            {item.productPrice.toFixed(2)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={itemQuantities[item.productId]} // 使用存储在对象中的数量
                                            onChange={(e) => handleQuantityChange(e, item.userId, item.productId)} // 传递唯一标识
                                        >
                                            {[...Array(20)].map((_, i) => (
                                                <MenuItem value={i + 1} key={i}>
                                                    {i + 1}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-end">
                                        NT$
                                        {(item.productPrice * item.quantity).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={1}>
                                    <Button variant="outlined" color="primary" onClick={handleBackClick}>
                                        {<ForwardIcon sx={{ transform: 'rotate(180deg)' }} />} 返到商品頁面
                                    </Button>
                                </TableCell>
                                <TableCell colSpan={2} sx={{ textAlign: 'right', fontSize: '18px' }}>
                                    總金額 NT$
                                    {cartData.reduce((total, item) => total + item.productPrice * item.quantity, 0).toFixed(2)}
                                </TableCell>
                                <TableCell colSpan={1}>
                                    <Button variant="contained" color="primary" onClick={handleShopClick}>
                                        我要購買
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
}
