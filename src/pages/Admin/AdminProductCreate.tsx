import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import ForwardIcon from '@mui/icons-material/Forward';
import { useState } from 'react';
import { InputLabel, MenuItem, Select } from '@mui/material';
import Navbar from '@/components/NavBar';

export default function AdminProductCreate() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token")
    const handleButtonClick = () => {
        navigate('/AdminProduct'); 
    };
    const [formData, setFormData] = useState({
        ProductName: '',
        ProductPrice: '',
        Image: '',
        Description: '',
        CategoryId: '',
    });
    const [formErrors, setFormErrors] = useState({
        ProductName: '',
        ProductPrice: '',
        Image: '',
        Description: '',
        CategoryId: '',
    });
    //傳送給後端得值要正確才會傳送
    const validateForm = () => {
        const errors = {
            ProductName: '',
            ProductPrice: '',
            Image: '',
            Description: '',
            CategoryId: '',
        };
        //開發者工具
        if (!formData.ProductName) {
            errors.ProductName = '請輸入商品名稱';
        }
        if (!formData.ProductPrice) {
            errors.ProductPrice = '請輸入商品價錢';
        }
        if (!formData.Image) {
            errors.Image = '請輸入商品圖片網址';
        }
        if (!formData.Description) {
            errors.Description = '請輸入商品內容';
        }
        if (!formData.CategoryId) {
            errors.CategoryId = '請選擇商品分類';
        }
        setFormErrors(errors);
        // 如果有任何錯誤，返回false
        return Object.values(errors).every((error) => error === '');
    };
    //畫面呈現
    const handleInputValidation = (event: { target: { name: any; value: any; }; }) => {
        const { name, value } = event.target;
        const errors = { ...formErrors };
        // 驗證邏輯
        switch (name) {
            case 'ProductName':
                errors.ProductName = value ? '' : '請輸入商品名稱';
                break;
            case 'ProductPrice':
                if (!value) {
                    errors.ProductPrice = '請輸入商品價錢';
                } else if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                    errors.ProductPrice = '請輸入有效的商品價錢';
                } else {
                    errors.ProductPrice = '';
                }
                break;
            case 'Image':
                if (!value) {
                    errors.Image = '請輸入商品圖片網址';
                } else if (
                    !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(value)
                ) {
                    errors.Image = '請輸入有效的商品圖片網址';
                } else {
                    errors.Image = '';
                }
                break;

            case 'Description':
                errors.Description = value ? '' : '請輸入商品描述';
                break;
            case 'CategoryId':
                errors.CategoryId = value ? '' : '請選擇商品分類';
                break;
            default:
                break;
        }
        setFormErrors(errors);
    };

    const handleInputChange = (event: { target: { name: any; value: any; }; }) => {
        const { name, value } = event.target;
        console.log(event.target.name)
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event?.preventDefault();
        if (validateForm()) {
            const form = new FormData();
            form.append('ProductName', formData.ProductName);
            form.append('ProductPrice', formData.ProductPrice);
            form.append('Image', formData.Image);
            form.append('Description', formData.Description);
            form.append('CategoryId', formData.CategoryId);
            try {
                const response = await fetch('https://localhost:44373/ProductCreate', {
                    method: 'POST',
                    body: form,
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                      },
                });
                if (response.ok) {
                    console.log('提交成功');
                    alert('商品新增成功')
                    navigate('/AdminProduct');
                } else {
                    console.error('請檢查填寫內容', Error);
                }
            } catch (error) {
                //捕獲異常
                console.error('發生錯誤', error);
                navigate('/Authorization')
            }
        }
    };
    return (
        <Navbar>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    商品上架
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} >
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="ProductName"
                                label="商品名稱"
                                name="ProductName"
                                autoComplete="ProductName"
                                autoFocus
                                onChange={(e) => {
                                    handleInputChange(e);
                                    handleInputValidation(e);
                                }}
                            />
                            <Typography variant="caption" color="error">
                                {formErrors.ProductName}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} >
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="ProductPrice"
                                label="商品價錢(台幣)"
                                name="ProductPrice"
                                autoComplete="ProductPrice"
                                autoFocus
                                onChange={(e) => {
                                    handleInputChange(e);
                                    handleInputValidation(e);
                                }}
                            />
                            <Typography variant="caption" color="error">
                                {formErrors.ProductPrice}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} >
                            <InputLabel htmlFor="CategoryId">商品分類*</InputLabel>
                            <Select
                                label="商品分類"
                                id="CategoryId"
                                name="CategoryId"
                                value={formData.CategoryId} // 選值的值
                                onChange={handleInputChange} 
                                error={Boolean(formErrors.CategoryId)} 
                                fullWidth
                            >
                                <MenuItem value="1">電子產品</MenuItem>
                                <MenuItem value="2">美妝</MenuItem>
                                <MenuItem value="3">服飾</MenuItem>
                                <MenuItem value="4">生活用品</MenuItem>
                            </Select>
                            <Typography variant="caption" color="error">
                                {formErrors.CategoryId}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="Image"
                                label="商品圖片網址"
                                name="Image"
                                autoComplete=""
                                autoFocus
                                onChange={(e) => {
                                    handleInputChange(e);
                                    handleInputValidation(e);
                                }}
                            />
                            <Typography variant="caption" color="error">
                                {formErrors.Image}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="Description"
                                label="請描述商品(50字以內)"
                                name="Description"
                                autoComplete="Description"
                                autoFocus
                                multiline
                                rows={4}
                                onChange={(e) => {
                                    handleInputChange(e);
                                    handleInputValidation(e);
                                }}
                            />
                            <Typography variant="caption" color="error">
                                {formErrors.Description}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        送出商品資訊
                    </Button>
                </Box>
            </Box>
            <Button variant="outlined" color="primary" onClick={handleButtonClick}>
                {<ForwardIcon sx={{ transform: 'rotate(180deg)' }} />} 返到商品管理頁面
            </Button>
        </Container>
        </Navbar>
    );
}