import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [formData, setFormData] = useState({
    userId: '',
    userName: '',
    email: '',
    phone: '',
    birth:'',
  });
  const [formNewData, setFormNewData] = useState({
    userId: '',
    userName: '',
    email: '',
    phone: '',
    birth:'',
  });
  const [formErrors, setFormErrors] = useState({
    userId: '',
    userName: '',
    email: '',
    phone: '',
  });
  const validateForm = () => {
    const errors = {
      userId: '',
      userName: '',
      email: '',
      phone: '',
    };

    if (!formData.userId) {
      errors.userId = '請輸入會員帳號';
    }
    if (!formData.userName) {
      errors.userName = '請輸入會員名稱';
    }
    if (!formData.email) {
      errors.email = '請輸入電子郵件';
    }
    if (!formData.phone) {
      errors.phone = '請輸入會員電話';
    }
    setFormErrors(errors);
    // 如果有任何錯誤，返回false
    return Object.values(errors).every((error) => error === '');
  };

  const handleInputValidation = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target;
    const errors = { ...formErrors };

    // 驗證邏輯
    switch (name) {
      case 'UserId':
        const UserIdPattern = /^[a-zA-Z0-9]*$/;
        //清除之前的錯誤消息
        errors.userId = '';
        if (!value) {
          errors.userId = '請輸入會員帳號';
        } else if (!UserIdPattern.test(value)) {
          errors.userId = '帳號只能輸入英文或數字';
        }
        break;
      case 'UserName':
        errors.userName = value ? '' : '請輸入會員名稱';
        break;
      case 'Email':
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        errors.email = '';
        if (!value) {
          errors.email = '請輸入電子郵件'
        } else if (!emailPattern.test(value)) {
          errors.email = '請輸入有效的電子郵件'
        }
        break;
      case 'Phone':
        const phonePattern = /^09\d{8}$/;
        errors.phone = '';
        if (!value) {
          errors.phone = '請輸入會員電話'
        } else if (!phonePattern.test(value)) {
          errors.phone = '請輸入有效的10位數字電話號碼'
        }
        break;
      default:
        break;
    }
    setFormErrors(errors);
  };

  const handleInputChange = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target;
    console.log(event.target.name)
    setFormNewData({
      ...formNewData,
      [name]: value,
    });
  };

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event?.preventDefault();

    if (validateForm()) {
      const formNew = new FormData();
      formNew.append('UserId', formNewData.userId);
      formNew.append('UserName', formNewData.userName);
      formNew.append('Email', formNewData.email);
      formNew.append('Phone', formNewData.phone);
      try {
        const response = await fetch('https://localhost:44373/MemberEdit/', {
          method: 'POST',
          body: formNew,
          headers: {
            'Authorization': `Bearer ${token}`, 
          },
        });
        if (response.ok) {
          console.log('提交成功');
          alert('會員更新成功，傳送至商品頁面')
          navigate(`/Product`);
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

  useEffect(() => {
    if (!userId) {
      alert("請先登入")
      navigate('/login'); 
    }
  }, [userId, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://localhost:44373/MemberProfile/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`, 
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('data', data);
        setFormData(data);
        setFormNewData(data)
        console.log("1", formData.userId);
      } catch (error) {
        console.error('發生錯誤:', error);
        navigate('/Authorization')
      }
    };
    fetchData();
  }, []);
 
  return (
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
            會員資料
          </Typography>
          { formData.userName &&
          (
          <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="userId"
              label="會員帳號"
              name="userId"
              autoComplete="id"
              autoFocus
              disabled
              value={formData.userId}
              onChange={(e) => {
                handleInputChange(e);
                handleInputValidation(e);
              }}
            />
            <Typography variant="caption" color="error">
              {formErrors.userId}
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              name="userName"
              label="會員名稱"
              id="userName"
              defaultValue={formData.userName}
              onChange={(e) => {
                handleInputChange(e);
                handleInputValidation(e);
              }}
            />
            <Typography variant="caption" color="error">
              {formErrors.userName}
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="電子郵件"
              type="email"
              id="email"
              defaultValue={formData.email}
              onChange={(e) => {
                handleInputChange(e);
                handleInputValidation(e);
              }}
            />
            <Typography variant="caption" color="error">
              {formErrors.email}
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              name="Birth"
              helperText="會員生日"
              type="date"
              id="Birth"
              value={formData.birth}
              disabled
              onChange={(e) => {
                handleInputChange(e);
                handleInputValidation(e);
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="phone"
              label="會員電話"
              type="number"
              id="phone"
              defaultValue={formData.phone}
              onChange={(e) => {
                handleInputChange(e);
                handleInputValidation(e);
              }}
            />
            <Typography variant="caption" color="error">
              {formErrors.phone}
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              更新會員資料
            </Button>
          </Box>
          )
          }
        </Box>
      </Container>
  );
}
