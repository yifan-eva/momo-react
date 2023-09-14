import * as React from 'react';
import * as Yup from 'yup';
import { Formik, getIn } from 'formik';
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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Login() {
  const [formData,setFormData] = useState({
    UserId: '',
    UserPwd: '',
  })
  const [formErrors, setFormErrors] = useState({
    UserId: '',
    UserPwd: '',
  })
  const validateForm = () => {
    const errors = {
    UserId:'',
    UserPwd:'',
  };
  if (!formData.UserId) {
    errors.UserId = '請輸入會員帳號';
  }
  if (!formData.UserPwd) {
    errors.UserPwd = '請輸入會員密碼';
  }
  setFormErrors(errors);
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
        errors.UserId = ''; 
        if (!value) {
          errors.UserId = '請輸入會員帳號';
        } else if (!UserIdPattern.test(value)) {
          errors.UserId = '帳號只能輸入英文或數字';
        }
        break;
      case 'UserPwd':
        const UserPwdPattern = /^[a-zA-Z0-9]*$/; 
        //清除之前的錯誤消息
        errors.UserPwd = ''; 
        if (!value) {
          errors.UserPwd = '請輸入會員密碼';
        } else if (!UserPwdPattern.test(value)) {
          errors.UserPwd = '帳號只能輸入英文或數字';
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validateForm()) {
    const form = new FormData();
    form.append('UserId', formData.UserId);
    form.append('UserPwd', formData.UserPwd);
    try {
      const response = await fetch('https://localhost:44373/MemberLogin', {
        method: 'POST',
        body: form,
      });
      if (response.ok) {
        // 请求成功，您可以在这里处理成功的情况
        console.log('提交成功');
        navigate('/');
      } else {
        // 请求失败，您可以在这里处理错误情况
        console.error('帳號密碼錯誤');
      }
    } catch (error) {
      // 捕获任何异常
      console.error('發生錯誤', error);
    }
  }
  };
  //     if (!response.ok) {
  //       // 如果响应状态码不为 200，抛出一个错误
  //       throw new Error('Network response was not ok');
  //     }
  //     navigate('/');
  //     const data = await response.text();
  //     console.log(data);
  //     // 输出 "會員建立成功"
  //   } catch (error) {
  //     // 处理错误
  //     console.error('Error:', error);
  //   }
  // };
  //   fetch('https://localhost:44373/Member/Create', {
  //     method: 'POST',
  //     body: form,
  //   })
  //   .then(response => response.text()) // 解析响应为 JSON
  //   .then(data => {
  //     // 处理 JSON 数据，例如显示成功消息
  //     console.log(data); // 输出 "會員建立成功"
  //   })
  //   .catch(error => {
  //     // 处理错误
  //     console.error('Error:', error);
  //   });
  // };

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
            登入
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="UserId"
              label="會員帳號"
              name="UserId"
              autoComplete="id"
              autoFocus
              onChange={(e) => {
                handleInputChange(e);
                handleInputValidation(e);
                }}
            />
             <Typography variant="caption" color="error">
            {formErrors.UserId}
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              name="UserPwd"
              label="密碼"
              type="password"
              id="UserPwd"
              autoComplete="current-password"
              onChange={(e) => {
                handleInputChange(e);
                handleInputValidation(e);
              }} 
            />
            <Typography variant="caption" color="error">
            {formErrors.UserPwd}
            </Typography>
            <br/>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="記得我"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              登入
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  忘記密碼?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/Demo/Create" variant="body2">
                  {"沒有帳號嗎?那快來註冊吧!"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}