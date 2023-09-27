import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { AppBar } from '@mui/material';
import { Link, Link as RouterLink, useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { ReactNode } from 'react'; 

export default function Navbar({ children }: { children: ReactNode }) {
    const [adminMenuAnchorEl, setAdminMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const [isAdminOpen, setIsAdminOpen] = React.useState<boolean>(false);
    const adminId = localStorage.getItem("admin")
    const isAdminLoggin = adminId !== null;

    const handleAdminMenuClose = () => {
        setIsAdminOpen(false);
    };
    const handleAdminProfileMenuOpen = () => {
        setIsAdminOpen(true);
    }

    const handleAdminLoggout = () => {
        alert('帳號已登出，跳回首頁')
        localStorage.removeItem('admin')
        localStorage.removeItem('token')
    };

    const adminMenu = (
        <Menu
            sx={{ mt: 6, paddingRight: '1rem' }}
            anchorEl={adminMenuAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            // id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isAdminOpen}
            onClose={handleAdminMenuClose}
        >
            <MenuItem component={RouterLink} to={`/AdminMember`} onClick={handleAdminMenuClose}>
                會員管理
            </MenuItem>
            <MenuItem component={RouterLink} to={`/AdminOrder`} onClick={handleAdminMenuClose}>
                訂單管理
            </MenuItem>
            <MenuItem component={RouterLink} to={`/AdminProduct`} onClick={handleAdminMenuClose}>
                商品管理
            </MenuItem>
            <MenuItem component={RouterLink} to="/Product" onClick={handleAdminLoggout}>
                登出
            </MenuItem>
        </Menu >
    );

    return (
        <Box sx={{ flexGrow: 1, display: 'flex' }}>
            <AppBar position="fixed" sx={{ backgroundColor: 'rgb(163 117 211 / 89%)' }}>
                <Toolbar>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        <Link to="/AdminIndex" style={{ textDecoration: 'none', color: 'inherit' }}>
                            管理者頁面
                        </Link>
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {adminMenu}
                        <IconButton
                            size="large"
                            aria-label="cart"
                            color="inherit"
                            aria-haspopup="true"
                            // aria-controls={menuId}
                            onClick={handleAdminProfileMenuOpen}
                        >
                            <ManageAccountsIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {children}
        </Box >
    );
}