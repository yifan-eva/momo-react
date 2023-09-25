import * as React from 'react';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { Avatar, Box, Button, Container, InputBase, TableRow, TableCell, TableContainer, TableHead, TableBody, Grid, Select, MenuItem, Toolbar } from '@mui/material';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import RecentActorsIcon from '@mui/icons-material/RecentActors';

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

type Member = {
    userId: string,
    userName: string,
    email: string,
    birth: string,
    phone: string,
    status: string,
}
export default function AdminMember() {
    const navigate = useNavigate();
    const [members, setMembers] = useState<Member[]>([]);
    const userId = localStorage.getItem("userid")
    const amdinId = localStorage.getItem("admin")
    const [searchTerm, setSearchTerm] = useState('')
    const [memberItems, setMemberItems] = useState<Member[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const membersPerPage = 10;
    const startIndex = (currentPage - 1) * membersPerPage;
    const endIndex = startIndex + membersPerPage;
    const membersToDisplay = memberItems.slice(startIndex, endIndex);
    const totalPages = Math.ceil(memberItems.length / membersPerPage);

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

    const handleSearch = () => {
        // 使用filter方法篩選符合搜索條件的訂單
        const filteredMembers = members.filter((member) => {
            return (
                String(member.userId).toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(member.userName).toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(member.email).toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(member.birth).toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(member.phone).toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(member.status).toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
        // 更新訂單列表
        setMemberItems(filteredMembers);
        setCurrentPage(1);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://localhost:44373/MemberEdit/all`, {
                    method: 'POST',
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('order', data);
                setMembers(data);
                // 在数据加载完成后才执行相关操作
            } catch (error) {
                console.error('發生錯誤:', error);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (memberId: string) => {
        // 找到与 memberId 匹配的会员对象
        const updatedMembers = members.map((member) => {
            if (member.userId === memberId) {
                // 判断当前状态
                if (member.status === 'BLOCK') {
                    // 如果当前是 BLOCK，将状态切换为 UNBLOCK
                    member.status = 'UNBLOCK';
                } else {
                    // 如果当前是 UNBLOCK，将状态切换为 BLOCK
                    member.status = 'BLOCK';
                }
            }
            // 返回更新后的会员对象
            return member;
        });
        // 创建 FormData，并将 memberId 和新的 Status 添加到 FormData 中
        const formData = new FormData();
        formData.append('UserId', memberId);
        formData.append('Status', updatedMembers.find((member) => member.userId === memberId)?.status || '');

        try {
            const response = await fetch('https://localhost:44373/MemberEdit/UserStatus', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log('提交成功');
                // alert('更新成功');
                // 更新本地状态以反映更改
                setMembers(updatedMembers);
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
        setMemberItems(members);
    }, [members]);

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
                                <RecentActorsIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                會員資料
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
                                <TableCell>會員帳號</TableCell>
                                <TableCell>會員名稱</TableCell>
                                <TableCell>電子郵件</TableCell>
                                <TableCell>會員生日</TableCell>
                                <TableCell>會員電話</TableCell>
                                <TableCell>會員狀態</TableCell>
                                <TableCell>變更狀態</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {membersToDisplay.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7}>找不到此項目</TableCell>
                                </TableRow>
                            ) : (
                                membersToDisplay.map((member) => (
                                    <TableRow key={member.userId}>
                                        <TableCell>
                                            {member.userId}
                                        </TableCell>
                                        <TableCell>
                                            {member.userName}
                                        </TableCell>
                                        <TableCell >
                                            {member.email}
                                        </TableCell>
                                        <TableCell>
                                            {member.birth}
                                        </TableCell>
                                        <TableCell>
                                            {member.phone}
                                        </TableCell>
                                        <TableCell>
                                            {member.status}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant='outlined'
                                                color={member.status === 'BLOCK' ? 'error' : 'primary'}
                                                onClick={() => handleSubmit(member.userId)}
                                            >
                                                {member.status}
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
                            <Button
                                sx={{
                                    py: 1,
                                }}
                                variant="outlined"
                                color="primary"
                                onClick={handleNextPage}
                            >
                                下一頁
                            </Button>
                        </Toolbar>
                    </Typography>
                </TableContainer>
            </Grid >
        </Container >
    );
}