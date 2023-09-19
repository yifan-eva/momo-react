import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const UserId = localStorage.getItem('userId')
  const [formData, setFormData] = useState({
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
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        console.log(userId);

        const response = await fetch(`https://localhost:44373/MemberProfile/` + userId, {
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('data', data);
        setFormData(data);
        // 在数据加载完成后才执行相关操作
        console.log("1", formData.userId);
      } catch (error) {
        console.error('發生錯誤:', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event?.preventDefault();

    if (validateForm()) {
      const form = new FormData();
      form.append('UserId', formData.userId);
      form.append('UserName', formData.userName);
      form.append('Email', formData.email);
      form.append('Phone', formData.phone);
      try {
        const response = await fetch('https://localhost:44373/MemberEdit/', {
          method: 'POST',
          body: form,
        });
        if (response.ok) {
          console.log('提交成功');
          // navigate('/Login');
        } else {
          console.error('請檢查填寫內容', Error);
        }
      } catch (error) {
        //捕獲異常
        console.error('發生錯誤', error);
      }
    }
  };

  console.log("11", formData.userId);
  // useEffect(() => {
  //   const userId = localStorage.getItem("userId");
  //   console.log(userId)
  //   fetch(`https://localhost:44373/MemberProfile/` + localStorage.getItem("userId"), {
  //     method: 'POST',
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       // 處理返回的商品列表
  //       console.log('data', data);
  //       setFormData(data);
  //       setDataLoaded(true);
  //     })
  //     .catch(error => {
  //       console.error('發生錯誤:', error);
  //     });
  // }, []);

  // const [dataLoaded, setDataLoaded] = useState(false);
  // useEffect(() => {
  //   // 数据已加载
  //   if (dataLoaded) {
  //     console.log("2", formData.UserId);
  //   }
  // }, [dataLoaded]);
  // console.log("1", formData.UserId)

  // 主題的設置
  const defaultTheme = createTheme();
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
            會員資料
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="UserId"
              label="會員帳號"
              name="UserId"
              autoComplete="id"
              autoFocus
              key={formData.userId}
              // defaultValue={formData.userId}
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
            {/* <TextField
              margin="normal"
              required
              fullWidth
              name="UserPwd"
              label="會員密碼"
              type="password"
              id="UserPwd"
              autoComplete="current-password"
              onChange={(e) => {
                handleInputChange(e);
                handleInputValidation(e);
              }}
            />
            <Typography variant="caption" color="error">
              {formErrors.userPwd}
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              name="RUserPwd"
              label="確認密碼"
              type="password"
              id="RUserPwd"
              autoComplete="current-password"
              onChange={(e) => {
                handleInputChange(e);
                handleInputValidation(e);
              }}
            /> */}
            {/* <Typography variant="caption" color="error">
              {formErrors.RUserPwd}
            </Typography> */}
            <TextField
              margin="normal"
              required
              fullWidth
              name="UserName"
              label="會員名稱"
              id="UserName"
              key={formData.userName}
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
              name="Email"
              label="電子郵件"
              type="email"
              id="Email"
              key={formData.email}
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
              key={formData.birth}
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
              name="Phone"
              label="會員電話"
              type="number"
              id="Phone"
              key={formData.phone}
              value={formData.phone}
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
            // onClick={handleSubmit}
            >
              更新會員資料
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/Demo/Login" variant="body2">
                  {"已經有帳號了?那快來登入吧!"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
