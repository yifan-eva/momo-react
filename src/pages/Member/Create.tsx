import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export function MemberCreate() {
  const [formData, setFormData] = useState({
    UserId: '',
    UserPwd: '',
    RUserPwd: '',
    UserName: '',
    Email: '',
    Birth: '',
    Phone: '',
  });
  const [formErrors, setFormErrors] = useState({
    UserId: '',
    UserPwd: '',
    RUserPwd: '',
    UserName: '',
    Email: '',
    Birth: '',
    Phone: '',
  });
  //傳送給後端得值要正確才會傳送
  const validateForm = () => {
    const errors = {
      UserId: '',
      UserPwd: '',
      RUserPwd: '',
      UserName: '',
      Email: '',
      Birth: '',
      Phone: '',
    };
    //開發者工具
    if (!formData.UserId) {
      errors.UserId = '請輸入會員帳號';
    }
    if (!formData.UserPwd) {
      errors.UserPwd = '請輸入會員密碼';
    }
    if (!formData.RUserPwd) {
      errors.RUserPwd = '請確認密碼';
    }
    if (!formData.UserName) {
      errors.UserName = '請輸入會員名稱';
    }
    if (!formData.Email) {
      errors.Email = '請輸入電子郵件';
    }
    if (!formData.Birth) {
      errors.Birth = '請輸入會員生日';
    }
    if (!formData.Phone) {
      errors.Phone = '請輸入會員電話';
    }
    setFormErrors(errors);
    return Object.values(errors).every((error) => error === '');
  };
  //畫面呈現
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
      case 'RUserPwd':
        const RUserPwdPattern = value === formData.UserPwd;
        errors.RUserPwd = '';
        if (!value) {
          errors.RUserPwd = '請輸入會員密碼'
        } else if (!RUserPwdPattern) {
          errors.RUserPwd = '密碼不一樣'
        }
        break;
      case 'UserName':
        errors.UserName = value ? '' : '請輸入會員名稱';
        break;
      case 'Email':
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        errors.Email = '';
        if (!value) {
          errors.Email = '請輸入電子郵件'
        } else if (!emailPattern.test(value)) {
          errors.Email = '請輸入有效的電子郵件'
        }
        break;
      case 'Birth':
        errors.Birth = value ? '' : '請輸入會員生日';
        break;
      case 'Phone':
        const phonePattern = /^09\d{8}$/;
        errors.Phone = '';
        if (!value) {
          errors.Phone = '請輸入會員電話'
        } else if (!phonePattern.test(value)) {
          errors.Phone = '請輸入有效的10位數字電話號碼'
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

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event?.preventDefault();
    if (validateForm()) {
      const form = new FormData();
      form.append('UserId', formData.UserId);
      form.append('UserPwd', formData.UserPwd);
      form.append('RUserPwd', formData.RUserPwd);
      form.append('UserName', formData.UserName);
      form.append('Email', formData.Email);
      form.append('Birth', formData.Birth);
      form.append('Phone', formData.Phone);
      try {
        const response = await fetch('https://localhost:44373/MemberCreate', {
          method: 'POST',
          body: form,
        });
        if (response.ok) {
          console.log('提交成功');
          navigate('/Login');
        } else {
          console.error('請檢查填寫內容', Error);
        }
      } catch (error) {
        //捕獲異常
        console.error('發生錯誤', error);
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
          <PersonAddIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          註冊會員
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
            {formErrors.UserPwd}
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
          />
          <Typography variant="caption" color="error">
            {formErrors.RUserPwd}
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            name="UserName"
            label="會員名稱"
            id="UserName"
            onChange={(e) => {
              handleInputChange(e);
              handleInputValidation(e);
            }}
          />
          <Typography variant="caption" color="error">
            {formErrors.UserName}
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            name="Email"
            label="電子郵件"
            type="email"
            id="Email"
            onChange={(e) => {
              handleInputChange(e);
              handleInputValidation(e);
            }}
          />
          <Typography variant="caption" color="error">
            {formErrors.Email}
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            name="Birth"
            helperText="會員生日*"
            type="date"
            id="Birth"
            onChange={(e) => {
              handleInputChange(e);
              handleInputValidation(e);
            }}
          />
          <Typography variant="caption" color="error">
            {formErrors.Birth}
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            name="Phone"
            label="會員電話"
            type="number"
            id="Phone"
            onChange={(e) => {
              handleInputChange(e);
              handleInputValidation(e);
            }}
          />
          <Typography variant="caption" color="error">
            {formErrors.Phone}
          </Typography>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            註冊
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
  );
}
