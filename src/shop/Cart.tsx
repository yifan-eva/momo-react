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
    const token = localStorage.getItem('token')
    const navigate = useNavigate();
    const [cartData, setCartData] = useState<CartItem[]>([]);
    const [itemQuantities, setItemQuantities] = useState<{ [productId: string]: number }>({});

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
            if(token){
                const response = await fetch('https://localhost:44373/CartMember/' , {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setCartData(data);
                    console.log("data", data)
                    const quantities: { [productId: string]: number } = {};
                    data.forEach((item: { productId: string | number; quantity: number; }) => {
                        quantities[item.productId] = item.quantity;
                    });
                    setItemQuantities(quantities);
                } else if(response.status === 400) {
                    navigate("/Authorization")
                } else {
                    console.error('發生錯誤:', response);
                }
            }else{
                navigate("/Authorization")
            }
            
        } catch (error) {
            console.error('發生錯誤:', error);
            navigate("/Authorization")
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
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateDto),
            });

            if (response.ok) {
                fetchData(); 
            } else {
                console.error('更新失敗:', response);
            }
        } catch (error) {
            console.error('更新失敗:', error);
            navigate('/Authorization')
        }
    };
    //數量更新
    const handleQuantityChange = async (e: { target: { value: any; }; }, userId: string, productId: string) => {
        const newQuantity = parseInt(e.target.value, 10);
        updateCartItemQuantity(userId, productId, newQuantity);
    };

    const removeCartItem = async (userId: string, productId: any) => {
        try {
            const removeDto = {
                productId: productId, userId: userId
            }
            const response = await fetch('https://localhost:44373/CartMember/remove', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(removeDto),
            });

            if (response.ok) {
                const updatedCartData = cartData.filter(item => item.productId !== productId);
                setCartData(updatedCartData);
            } else {
            }
        } catch (error) {
            console.error('移除失败:', error);
            navigate('/Authorization')
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
                                            {item.productPrice}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Select                            
                                            value={itemQuantities[item.productId]}
                                            onChange={(e) => handleQuantityChange(e, item.userId, item.productId)} 
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
                                        {(item.productPrice * item.quantity)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={1}>
                                    <Button variant="outlined" color="primary" onClick={handleBackClick}>
                                        {<ForwardIcon sx={{ transform: 'rotate(180deg)' }} />} 返回<br/>商品頁面
                                    </Button>
                                </TableCell>
                                <TableCell colSpan={2} sx={{ textAlign: 'right', fontSize: '18px' }}>
                                    總金額 NT$
                                    {cartData.reduce((total, item) => total + item.productPrice * item.quantity, 0)}
                                </TableCell>
                                <TableCell colSpan={1}>
                                    <Button variant="contained" color="primary" onClick={handleShopClick} >
                                        我要<br/>
                                        購買
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
