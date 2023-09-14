import { InputBase } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';


//搜尋欄
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
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

export default function ProductSearch() {
    const [searchTerm, setSearchTerm] = useState('')
    const handleSearch = () => {
        console.log('Searching for:', searchTerm);
        // 處理搜索操作，可以調用後端 API 來執行實際搜索
    };
    return (
        <>
            <Search>
                <SearchIconWrapper>
                </SearchIconWrapper>
                <StyledInputBase
                    placeholder="產品搜尋"
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
            <SearchIcon
                onClick={handleSearch}
                style={{ cursor: 'pointer' }}
                role="button"
                tabIndex={0}
                // onKeyPress={(e) => {
                //     if (e.key === 'Enter') {
                //         handleSearch();
                //     }
                // }} 
                />
        </>
    )
};
