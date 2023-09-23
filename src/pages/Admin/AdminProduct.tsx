import * as React from 'react';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Avatar, Box, Button, Container, InputBase, TableRow, TableCell, TableContainer, TableHead, TableBody, Grid, Select, MenuItem, TableFooter, Toolbar } from '@mui/material';
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

type Product = {
    productId: string,
    productName: string,
    description: string,
    categoryId: string,
    productPrice: string,
    image: string,
    categoryName: string,
    status: string,

}
export default function AdminMember() {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const userId = localStorage.getItem("userid")
    const amdinId = localStorage.getItem("admin")
    const [searchTerm, setSearchTerm] = useState('')
    const [productItems, setProductItems] = useState<Product[]>([]);

    // const handleBackClick = (id: string) => {
    //     navigate(`/AdminOrderItem?orderid=` + id); // 导航到指定的路由
    // };

    const handleSearch = () => {
        // 使用filter方法篩選符合搜索條件的訂單
        const filteredMembers = products.filter((product) => {
            return (
                String(product.productId).toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(product.productName).toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(product.productPrice).toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(product.categoryName).toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(product.image).toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(product.status).toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
        // 更新訂單列表
        setProductItems(filteredMembers);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://localhost:44373/Product/all`, {
                    method: 'POST',
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('order', data);
                setProducts(data);
                // 在数据加载完成后才执行相关操作
            } catch (error) {
                console.error('發生錯誤:', error);
            }
        };
        fetchData();
    }, []);

    const handleStatusSubmit = async (productId: string) => {
        // 找到与 memberId 匹配的会员对象
        const updatedProducts = products.map((product) => {
            if (product.productId === productId) {
                if (product.status === 'off') {
                    product.status = 'on';
                } else {
                    product.status = 'off';
                }
            }
            // 返回更新后的会员对象
            return product;
        });
        // 创建 FormData，并将 memberId 和新的 Status 添加到 FormData 中
        const formData = new FormData();
        formData.append('ProductId', productId);
        formData.append('Status', updatedProducts.find((product) => product.productId === productId)?.status || '');

        try {
            const response = await fetch('https://localhost:44373/Product/ProductStatus', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log('提交成功');
                // 更新本地状态以反映更改
                setProducts(updatedProducts);
                // 在请求成功时，可能执行一些其他操作
            } else {
                console.error('請檢查填寫內容', Error);
                // 在请求失败时，可能采取其他操作或显示错误消息
            }
        } catch (error) {
            // 捕获异常并输出错误信息
            console.error('發生錯誤', error);
            // 可能还需要采取其他操作，如显示网络错误消息
        }
    };
    const handleSubmit = () => {
        navigate(`/AdminProductCreate`)
    }


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
        setProductItems(products);
    }, [products]);

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
                                商品資料
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
                                <TableCell>產品ID</TableCell>
                                <TableCell>產品名稱</TableCell>
                                <TableCell>產品價錢</TableCell>
                                <TableCell>產品分類</TableCell>
                                <TableCell>產品狀態</TableCell>
                                <TableCell>變更狀態</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {productItems.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7}>找不到此項目</TableCell>
                                </TableRow>
                            ) : (
                                productItems.map((product) => (
                                    <TableRow key={product.productId}>
                                        <TableCell>
                                            {product.productId}
                                        </TableCell>
                                        <TableCell>
                                            {product.productName}
                                        </TableCell>
                                        <TableCell >
                                            ${product.productPrice}
                                        </TableCell>
                                        <TableCell>
                                            {product.categoryName}
                                        </TableCell>
                                        <TableCell>
                                            {product.status}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant='outlined'
                                                color={product.status === 'off' ? 'error' : 'primary'}
                                                onClick={() => handleStatusSubmit(product.productId)}
                                            >
                                                {product.status}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                        <Toolbar>
                            {/* ... 其他工具栏元素 ... */}
                            <Box sx={{ flexGrow: 1 }} /> {/* 使用 flexGrow 来填充工具栏的剩余空间 */}
                            <Button
                                sx={{
                                    py: 1,
                                    marginLeft: 'auto' // 将按钮放置在工具栏的末尾
                                }}
                                variant="outlined"
                                color="primary"
                                onClick={handleSubmit}
                            >
                                商品上架
                            </Button>
                        </Toolbar>
                    </Typography>
                </TableContainer>
            </Grid >
        </Container >
    );
}