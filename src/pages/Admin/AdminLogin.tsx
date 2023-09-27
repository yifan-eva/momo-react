import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EngineeringIcon from '@mui/icons-material/Engineering';


export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    UserId: '',
    UserPwd: '',
    token: ''
  })
  const [formErrors, setFormErrors] = useState({
    UserId: '',
    UserPwd: '',
  })

  const validateForm = () => {
    const errors = {
      UserId: '',
      UserPwd: '',
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.removeItem('admin')
    localStorage.removeItem('token')
    if (validateForm()) {
      const form = new FormData();
      form.append('AdminId', formData.UserId);
      form.append('AdminPwd', formData.UserPwd);
      // form.append('Token', formData.token);
      try {
        const response = await fetch('https://localhost:44373/Admin/Login', {
          method: 'POST',
          body: form,
          headers: {
            'Authorization': `Bearer ${formData.token}`,
          },
        });

        const responseData = await response.json();
        if (response.ok) {
          if (responseData.data.adminId !== null) {
            console.log('token', responseData.data.token)
            console.log('提交成功');
            localStorage.setItem('admin', responseData.data.adminId);
            localStorage.setItem('token', responseData.data.token);
            // alert("成功")
            navigate('/AdminIndex');
          } else {
            console.error('登入失敗:', responseData.message);
            alert('登入失敗!')
          }
        } else {
          console.error('請求失敗:', responseData.message);
        }
      } catch (error) {
        console.error('發生錯誤', error);
        // navigate("/Authorization")
      }
    }
  };

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
          <EngineeringIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          管理員登入
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="UserId"
            label="帳號"
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
          <br />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            登入
          </Button>
        </Box>
      </Box>
    </Container>
  );
}