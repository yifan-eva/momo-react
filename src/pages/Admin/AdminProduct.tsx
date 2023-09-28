import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Avatar, Box, Button, Container, InputBase, TableRow, TableCell, TableContainer, TableHead, TableBody, Grid, Toolbar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
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
    const userId = localStorage.getItem("userid")
    const amdinId = localStorage.getItem("admin")
    const token = localStorage.getItem("token")
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('')
    const [productItems, setProductItems] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const productsPerPage = 10;
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToDisplay = productItems.slice(startIndex, endIndex);
    const totalPages = Math.ceil(productItems.length / productsPerPage);

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

    const handleUpdateDialogOpen = () => {
        setOpenUpdateDialog(true);
        navigate('/AdminProductUpdate')
    };

    const handleUpdateDialogClose = () => {
        setOpenUpdateDialog(false);
    };

    const handleupdateSubmit = () => {

    }

    const handleSearch = () => {
        // 使用filter方法篩選符合搜索條件的訂單
        const filteredMembers = products.filter((product) => {
            return (
                String(product.productId).toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(product.productName).toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(product.productPrice).toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(product.categoryName).toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(product.status).toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
        setCurrentPage(1);
        // 更新訂單列表
        setProductItems(filteredMembers);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://localhost:44373/Product/Adminall`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const sortedProducts = data.sort((a: { productId: string; }, b: { productId: string; }) => {
                    return parseInt(b.productId) - parseInt(a.productId);
                });

                setProducts(sortedProducts);
            } catch (error) {
                console.error('發生錯誤:', error);
                navigate('/Authorization')
            }
        };
        fetchData();
    }, []);

    const handleStatusSubmit = async (productId: string ,newstatus: string) => {
        const updatedProducts = products.map((product) => {
            //找到商品ID
            if (product.productId === productId) {
                if (product.status === 'off') {
                    product.status = 'on';
                } else {
                    product.status = 'off';
                }
            }
            return product;
        });
        const status = newstatus === "off" ? "上架" : "下架"
        const confirmed = window.confirm(`確定要將訂單狀態設為 ${status} 嗎？`);
        if (!confirmed) {
            return; // 如果用戶取消操作，不執行後續代碼
        }
        //將ProductId,Status包裝到formData
        const formData = new FormData();
        formData.append('ProductId', productId);
        formData.append('Status', updatedProducts.find((product) => product.productId === productId)?.status || '');
        try {
            const response = await fetch('https://localhost:44373/Product/ProductStatus', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                console.log('提交成功');
                setProducts(updatedProducts);
            } else {
                console.error('請檢查填寫內容', Error);
            }
        } catch (error) {
            console.error('發生錯誤', error);
            navigate('/Authorization')
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
    }, [amdinId, navigate]);

    useEffect(() => {
        // 當搜索關鍵字發生變化時執行搜索
        handleSearch();
    }, [searchTerm]);

    useEffect(() => {
        setProductItems(products);
    }, [products]);

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
                                {productsToDisplay.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7}>找不到此項目</TableCell>
                                    </TableRow>
                                ) : (
                                    productsToDisplay.map((product) => (
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
                                                {product.status === "off" ? "下架" : "上架"}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant='outlined'
                                                    color={product.status === 'on' ? 'error' : 'primary'}
                                                    onClick={() => handleStatusSubmit(product.productId , product.status)}
                                                >
                                                    {product.status === "off" ? "上架" : "下架"}
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
                                <Box sx={{ flexGrow: 1 }} />
                                <Button
                                    sx={{
                                        py: 1,
                                        marginLeft: 'auto'
                                    }}
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleSubmit}
                                >
                                    新增商品
                                </Button>
                            </Toolbar>
                        </Typography>
                    </TableContainer>
                </Grid >
            </Container >
        </Navbar>
    );
}