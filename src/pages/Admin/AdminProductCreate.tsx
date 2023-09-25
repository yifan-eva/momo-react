import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ForwardIcon from '@mui/icons-material/Forward';
import { useState } from 'react';
import { MenuItem, Select } from '@mui/material';


// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function AdminProductCreate() {
    const navigate = useNavigate();
    const handleButtonClick = () => {
        navigate('/AdminProduct'); // 导航到指定的路由
    };
    const [formData, setFormData] = useState({
        ProductName: '',
        ProductPrice: '',
        Image: '',
        Description: '',
        CategoryId: '',
        // CategoryName: '',
    });
    const [formErrors, setFormErrors] = useState({
        ProductName: '',
        ProductPrice: '',
        Image: '',
        Description: '',
        CategoryId: '',
        // CategoryName: '',
    });
    //傳送給後端得值要正確才會傳送
    const validateForm = () => {
        const errors = {
            ProductName: '',
            ProductPrice: '',
            Image: '',
            Description: '',
            CategoryId: '',
            // CategoryName: '',
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
        // if (!formData.CategoryName) {
        //     errors.CategoryName = '請輸入商品分類';
        // }
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
            // case 'CategoryName':
            //     errors.CategoryName = value ? '' : '請選擇商品分類';
            //     break;

            default:
                break;
        }

        setFormErrors(errors);
    };
    const [selectedValue, setSelectedValue] = useState('1'); // 初始选择值
    const handleChange = (event: { target: { value: any; }; }) => {
        // 获取选择的值
        const selectedOption = event.target.value;
    
        // 映射选择的值
        let mappedValue;
        switch (selectedOption) {
          case '1':
            mappedValue = '1';
            break;
          case '2':
            mappedValue = '2';
            break;
          case '3':
            mappedValue = '3';
            break;
          case '4':
            mappedValue = '4';
            break;
          default:
            mappedValue = ''; // 如果没有匹配的值，可以设置为默认值
            break;
        }
    
        setSelectedValue(mappedValue);
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
            // form.append('CategoryName', formData.CategoryName);
            try {
                const response = await fetch('https://localhost:44373/ProductCreate', {
                    method: 'POST',
                    body: form,
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
            }
        }
    };
    return (
        <ThemeProvider theme={defaultTheme}>
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
                            <Grid item xs={12} sm={6}>
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
                            <Grid item xs={12} sm={6}>
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
                            {/* <Grid item xs={6}>
                                <Select
                                    label="商品分類"
                                    id="CategoryName"
                                    name="CategoryName"
                                    value={formData.CategoryName} // 用于选择的值
                                    onChange={handleInputChange} // 当选择更改时触发的处理程序
                                    error={Boolean(formErrors.CategoryName)} // 如果有错误，则为true
                                    fullWidth
                                > */}
                                    {/* 这里是下拉选项，你可以根据需要添加更多 */}
                                    {/* <MenuItem value="1">3C</MenuItem>
                                    <MenuItem value="2">美妝</MenuItem>
                                    <MenuItem value="3">服飾</MenuItem>
                                    <MenuItem value="4">生活用品</MenuItem>
                                </Select>
                                <Typography variant="caption" color="error">
                                    {formErrors.CategoryName}
                                </Typography>
                            </Grid> */}
                             <Grid item xs={6}>
                                <Select
                                    label="商品分類ID"
                                    id="CategoryId"
                                    name="CategoryId"
                                    value={formData.CategoryId} // 用于选择的值
                                    onChange={handleInputChange} // 当选择更改时触发的处理程序
                                    error={Boolean(formErrors.CategoryId)} // 如果有错误，则为true
                                    fullWidth
                                >
                                    {/* 这里是下拉选项，你可以根据需要添加更多 */}
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
        </ThemeProvider>
    );
}