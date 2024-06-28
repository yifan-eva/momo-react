import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Avatar, Box, Button, Container, TableFooter, TableRow, TableCell, Radio, RadioGroup, FormLabel, TableContainer, Table, TableHead, TableBody, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import ForwardIcon from '@mui/icons-material/Forward';
import { useState, useEffect } from 'react';

export default function OrderCheck1() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId')
    const token = localStorage.getItem('token')
    const [cartData, setCartData] = useState<CartItem[]>([]);

    const [formData, setFormData] = useState({
        UserId: '',
        OrderDate: '2023-09-19T15:4848.018Z',
        OrderTotal: '',
        Status: '待出貨',
        ProductName: '',
        ProductPrice: '',
        Place: '',
        Pay: '',
        OrderName: ''
    })
    //畫面驗證
    const [formErrors, setFormErrors] = useState({
        UserId: '',
        Place: '',
        Pay: '',
        OrderName: ''
    })
    //開發者工具驗證
    const validateForm = () => {
        const errors = {
            UserId: '',
            Place: '',
            Pay: '',
            OrderName: ''
        }
        if (!formData.Place) {
            errors.Place = '請輸入地址'
        }
        if (!formData.Pay) {
            errors.Pay = '請選擇付費方式'
        }
        if (!formData.OrderName) {
            errors.OrderName = '請輸入訂購人姓名'
        }
        setFormErrors(errors);
        // 如果有任何錯誤，返回false
        return Object.values(errors).every((error) => error === '');
    }

    const handleInputValidation = (event: { target: { name: any; value: any; }; }) => {
        const { name, value } = event.target;
        const errors = { ...formErrors };
        //驗證邏輯
        switch (name) {
            case 'Place':
                errors.Place = value ? '' : '請輸入取貨地址';
                break;
            case 'Pay':
                errors.Pay = value ? '' : '請選擇付費方式';
                break;
            case 'OrderName':
                errors.OrderName = value ? '' : '請輸入訂購人姓名'

        }
        setFormErrors(errors)
    };
    const handleInputChange = (event: { target: { name: any; value: any; }; }) => {
        const { name, value } = event.target;
        console.log(event.target.name)
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    interface CartItem {
        userToken: string;
        productId: number;
        productName: string;
        productPrice: number;
        quantity: number;

    }

    const handleBackClick = () => {
        navigate('/cart'); // 导航到指定的路由
    };

    //判斷是否登入
    useEffect(() => {
        if (!userId) {
            alert("請先登入")
            navigate('/login');
        }
    }, [userId, navigate]);

    useEffect(() => {
        fetch('https://localhost:44373/CartMember/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setCartData(data)
            })
            .catch(error => {
                console.error('發生錯誤:', error);
                navigate('/Authorization')
            });
    }, []);
    console.log("12", cartData)

    const handleValidateSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        if (validateForm()) {
            // 执行表单提交
            console.log('ok');
            setOpen(true);
        } else {
            // 输出验证错误
            console.error('驗證失敗:', validateForm);
        }
    };
    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event?.preventDefault();
        const OrderTotal = cartData.reduce((total, item) => total + item.productPrice, 0);
        try {
            const response = await fetch('https://localhost:44373/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    UserId: userId,
                    Pay: formData.Pay,
                    Place: formData.Place,
                    OrderName: formData.OrderName,
                    OrderTotal: OrderTotal

                }),
            });
            if (response.ok) {
                console.log('提交成功');
                navigate(`/OrderCheck2`);
            } else {
                // console.error('請檢查填寫內容');
                console.log(response);
            }
        } catch (error) {
            //捕獲異常
            console.error('發生錯誤', error);
            navigate('/Authorization')
        }
    };

    return (
        <Container component="main" sx={{ py: 8 }} maxWidth="md">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                }}
            >
                < Avatar sx={{ m: 3, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    確認訂單
                </Typography>
            </Box>
            <TableContainer sx={{ py: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>商品</TableCell>
                            <TableCell>數量</TableCell>
                            <TableCell>小計</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cartData.map((item: any) => (
                            <TableRow key={item.productId}>
                                <TableCell>
                                    {item.productName}
                                    <br />
                                    <Typography variant="body2" color="textSecondary">
                                        {item.productPrice}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    {item.quantity}
                                    <br />
                                </TableCell>
                                <TableCell className="text-end">
                                    {(item.productPrice * item.quantity)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={4} sx={{ textAlign: 'right', fontSize: '16px' }}>
                                總金額 NT$
                                {cartData.reduce((total, item) => total + item.productPrice * item.quantity, 0)}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box component="form" noValidate sx={{ mt: 1 }}>
                    <React.Fragment>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    id="UserId"
                                    name="UserId"
                                    label="會員帳號"
                                    fullWidth
                                    autoComplete="given-name"
                                    variant="standard"
                                    value={userId}
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    id="OrderName"
                                    name="OrderName"
                                    label="訂購人名稱"
                                    fullWidth
                                    autoComplete="id"
                                    variant="standard"
                                    onChange={(e) => {
                                        handleInputChange(e);
                                        handleInputValidation(e);
                                    }}
                                />
                                <Typography variant="caption" color="error">
                                    {formErrors.OrderName}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <FormLabel id="Pay">付款方式</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="Pay"
                                    onChange={(e) => {
                                        handleInputChange(e);
                                        handleInputValidation(e);
                                    }}
                                >
                                    <FormControlLabel value="貨到付款" control={<Radio />} label="貨到付款" />
                                    <FormControlLabel value="信用卡" control={<Radio />} label="信用卡" />
                                    <FormControlLabel value="銀行轉帳" control={<Radio />} label="銀行轉帳" />
                                </RadioGroup>
                                <Typography variant="caption" color="error">
                                    {formErrors.Pay}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="Place"
                                    name="Place"
                                    label="取貨地址"
                                    fullWidth
                                    autoComplete="id"
                                    variant="standard"
                                    onChange={(e) => {
                                        handleInputChange(e);
                                        handleInputValidation(e);
                                    }}
                                />
                                <Typography variant="caption" color="error">
                                    {formErrors.Place}
                                </Typography>
                            </Grid>
                            <Button variant="outlined" color="primary" onClick={handleBackClick} style={{ marginTop: '20px', marginBottom: '10px' }}>
                                {<ForwardIcon sx={{ transform: 'rotate(180deg)' }} />} 回到購物車
                            </Button>
                            <Button
                                color="primary"
                                variant="contained"
                                style={{
                                    marginLeft: 'auto',
                                    marginTop: '20px',
                                    marginBottom: '10px'
                                }}
                                onClick={handleValidateSubmit}>
                                我要購買
                            </Button>
                            <Dialog
                                open={open}
                                onClose={() => setOpen(false)}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle id="alert-dialog-title">{"確認購買?"}</DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        下單後無法退貨或更改訂單喔
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => setOpen(false)} color="primary">
                                        取消
                                    </Button>
                                    <Button onClick={handleSubmit} color="primary" autoFocus>
                                        確定
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Grid>
                    </React.Fragment>
                </Box>
            </Box>
        </Container >
    );
}

