import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { Drawer, useTheme } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Divider from '@mui/material/Divider';
import { Link, Link as RouterLink, useNavigate } from 'react-router-dom';
import ProductSearch from './Search';
import AppNavBar from './AppNavBar';
import EngineeringIcon from '@mui/icons-material/Engineering';
import FaceIcon from '@mui/icons-material/Face';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

export default function Navbar() {
    //左邊欄位打開方法
    const [open, setOpen] = React.useState(false);
    //左邊欄位打開的功能
    const theme = useTheme();
    const [expanded, setExpanded] = React.useState<string | false>(false);
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
        // alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        // justifyContent: 'flex-end',
    }));
    const AccordionHandleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };


    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
        React.useState<null | HTMLElement>(null);

    const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const adminId = localStorage.getItem('admin')

    //admin的下拉選單
    const [adminMenuAnchorEl, setAdminMenuAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleAdminMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAdminMenuAnchorEl(event.currentTarget);
    };

    const handleAdminMenuClose = () => {
        setAdminMenuAnchorEl(null);
    };


    const handleCartClick = () => {

        // 在单击购物车图标时进行导航到 '/cart' 页面
        navigate(`/cart?userId=${userId}`);
    };

    const handleAdminClick = () => {

        // 在单击购物车图标时进行导航到 '/cart' 页面
        navigate(`/AdminLogin`);
    };

    const handleAdminOrderClick = () => {

        // 在单击购物车图标时进行导航到 '/cart' 页面
        navigate(`/AdminOrder`);
    };

    const handleAdminMemberClick = () => {

        // 在单击购物车图标时进行导航到 '/cart' 页面
        navigate(`/AdminMember`);
    };
    const handleAdminProductClick = () => {

        // 在单击购物车图标时进行导航到 '/cart' 页面
        navigate(`/AdminProduct`);
    };
    const handleProfileMenuOpen = () => {
        setIsMenuOpen(true);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        // setAnchorEl(null);
        // handleMobileMenuClose();
        setIsMenuOpen(false);
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleLoggout = () => {
        alert('帳號已登出，跳回首頁')
        localStorage.removeItem('userId');
        localStorage.removeItem('admin')
        localStorage.removeItem('token')
        // 继续处理其他的登出逻辑
    };
    //isLoggedIn 表示用戶是否已經登入
    const isLoggedIn = userId !== null;
    const isAdminLoggin = adminId !== null;
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
                        <MenuItem component={RouterLink}
                            to={{
                                pathname: '/Profile',
                                search: `?userId=${userId}`,
                            }} onClick={handleMenuClose}>
                            我的帳號
                        </MenuItem>
                        <MenuItem component={RouterLink} to={`/OrderCheck2?userid=${userId}`} onClick={handleMenuClose}>
                            我的訂單
                        </MenuItem>
                        <MenuItem component={RouterLink} to="/" onClick={handleLoggout}>
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

    const adminMenu = (
        <Menu
            sx={{ mt: 6 }}
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
            anchorEl={adminMenuAnchorEl}
            open={Boolean(adminMenuAnchorEl)}
            onClose={handleAdminMenuClose}
        >
            {isAdminLoggin ?

                [(
                    <div key={"loggedIn"}>
                        <MenuItem onClick={handleAdminMemberClick}>
                            會員管理
                        </MenuItem>
                        <MenuItem onClick={handleAdminOrderClick}>
                            訂單管理
                        </MenuItem>
                        <MenuItem onClick={handleAdminProductClick}>
                            商品管理
                        </MenuItem>
                        <MenuItem component={RouterLink} to="/" onClick={handleLoggout}>
                            登出
                        </MenuItem>
                    </div>

                )]

                : [(
                    <div key={"UnLoggedIn"}>
                        <MenuItem onClick={handleAdminClick}>
                            管理員登入
                        </MenuItem>

                    </div>
                )]}
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
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
                        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                            MoMo購物網
                        </Link>
                    </Typography>
                    <ProductSearch />
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {adminMenu}
                        {isAdminLoggin ? (
                            <IconButton
                                size="large"
                                aria-label="cart"
                                color="inherit"
                                aria-haspopup="true"
                                aria-controls={menuId}
                                onClick={handleAdminMenuOpen}
                            >
                                <ManageAccountsIcon />
                            </IconButton>
                        ) : (
                            <IconButton
                                size="large"
                                aria-label="cart"
                                color="inherit"
                                aria-haspopup="true"
                                aria-controls={menuId}
                                onClick={handleAdminMenuOpen}
                            >
                                <EngineeringIcon />
                            </IconButton>
                        )}

                        {isLoggedIn && ( // 只有在用户已登录时才显示购物车图标
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
                    {renderMobileMenu}

                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
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