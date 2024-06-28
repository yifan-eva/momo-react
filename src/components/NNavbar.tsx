import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { Drawer, useTheme } from '@mui/material';
import Divider from '@mui/material/Divider';
import { Link, Link as RouterLink, useNavigate } from 'react-router-dom';
import ProductSearch from './Search';
import AppNavBar from './AppNavBar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EngineeringIcon from '@mui/icons-material/Engineering';
import FaceIcon from '@mui/icons-material/Face';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

export default function NNavbar() {
    //左邊欄位打開方法
    const [open, setOpen] = React.useState(false);
    //左邊欄位打開的功能
    const theme = useTheme();
    //左邊欄位功能
    const drawerWidth = 240;
    interface AppBarProps extends MuiAppBarProps {
        open?: boolean;
    }
    //左邊功能打開時，navbar會跟著右移
    const AppBar = styled(MuiAppBar, {
        shouldForwardProp: (prop) => prop !== 'open',
    })<AppBarProps>(({ theme, open }) => ({
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: `${drawerWidth}px`,
            transition: theme.transitions.create(['margin', 'width'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
    }));
    //打開左邊欄位主畫面會跟著縮小
    const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
        open?: boolean;
    }>(({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    }));
    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    //左邊搜尋欄打開的內容
    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    }));

    //會員下拉
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    const handleProfileMenuOpen = () => {
        setIsMenuOpen(true);
    };
    const handleMenuClose = () => {
        ;
        setIsMenuOpen(false);
    };
    const handleCartClick = () => {
        navigate(`/cart?userId=${userId}`);
    };

    const handleLoggout = () => {
        alert('帳號已登出，跳回首頁')
        localStorage.removeItem('userId')
        localStorage.removeItem('token')
    };

    //isLoggedIn 表示用戶是否已經登入
    const isLoggedIn = userId !== null;
    // const isLoggedIn = false; // 或根據實際情況設置為 true 或 false
    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            sx={{ mt: 6 }}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            {isLoggedIn ?
                [(
                    <div key={"loggedIn"}>
                        <MenuItem component={RouterLink} to={`/Profile`} onClick={handleMenuClose}>
                            我的帳號
                        </MenuItem>
                        <MenuItem component={RouterLink} to={`/OrderCheck2`} onClick={handleMenuClose}>
                            我的訂單
                        </MenuItem>
                        <MenuItem component={RouterLink} to="/Product" onClick={handleLoggout}>
                            登出
                        </MenuItem>
                    </div>
                )]
                : [(
                    <div key={"UnLoggedIn"}>
                        <MenuItem component={RouterLink} to="/Login" onClick={handleMenuClose}>
                            登入
                        </MenuItem>
                        <MenuItem component={RouterLink} to="/Create" onClick={handleMenuClose}>
                            註冊
                        </MenuItem>
                    </div>
                )]}
        </Menu>
    );

    return (
        <Box sx={{ flexGrow: 1, display: 'flex' }}>
            <AppBar position="fixed" open={open} sx={{ backgroundColor: 'rgb(163 117 211 / 89%)' }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        <Link to="/Product" style={{ textDecoration: 'none', color: 'inherit' }}>
                            MoMo購物網
                        </Link>
                    </Typography>
                    <ProductSearch />
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {isLoggedIn && (
                            <IconButton
                                aria-label="cart"
                                size="large"
                                color="inherit"
                                aria-controls={menuId}
                                onClick={handleCartClick}
                            >
                                <ShoppingCartIcon />
                            </IconButton>
                        )}

                        {renderMenu}
                        {isLoggedIn ? (
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                color="inherit"
                            >
                                <FaceIcon />
                            </IconButton>
                        ) : (
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={handleProfileMenuOpen}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                    // 將Drawer定位在左側
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0, // 或者設置其他適當的高度
                    zIndex: 99,
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                {/* 左邊的功能欄 */}
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <AppNavBar />
            </Drawer>
            <Main open={open} />
        </Box>
    );
}