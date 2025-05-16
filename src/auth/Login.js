import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import { Box, Button, TextField, Typography, Checkbox, FormControlLabel, Stack } from '@mui/material';
import styled from '@emotion/styled';
import './Auth.css';

const StyledButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  textTransform: 'none',
  fontSize: '1rem',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export default function Login() {
  return (
    <Box
      className="auth-container"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: (theme) =>
          `url(${
            theme.palette.mode === 'light'
              ? 'https://aicahpl.com/datafiles/24-05-2024/17165153587681_z5457622581893_7a317754dc5b9a8b9c5627b59516d1fb.jpg'
              : 'https://aicahpl.com/content_hpl/upload/Image/470686884_1008976914560433_8237905483350125379_n.jpg'
          })`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Box className="auth-form-wrapper">
        <Box
          className="auth-form"
          sx={{
            bgcolor: (theme) => (theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(27, 36, 42, 0.7)'),
            backdropFilter: (theme) => (theme.palette.mode === 'light' ? 'blur(60px)' : 'blur(5px)'),
            borderRadius: 3,
            p: 3,
            width: 500,
            maxWidth: 700,
            boxShadow: (theme) => theme.shadows[1],
            transition: 'box-shadow 0.3s',
            '&:hover': {
              boxShadow: (theme) => `0 12px 48px ${theme.palette.mode === 'light' ? 'rgba(129, 127, 127, 0.5)' : 'rgba(0, 0, 0, 0.7)'}`,
            },
          }}
        >
          <Typography variant="h5" align="center" color="text.primary" mb={3} sx={{ fontSize: '2rem', fontWeight: 'bold' }}>
            Đăng nhập
          </Typography>
          <Box component="form">
            <Box className="form-group" sx={{ mb: 2 }}>
              <Typography component="label" htmlFor="email" color="text.primary" sx={{ mb: 1, fontSize: '1rem' }}>
                Email
              </Typography>
              <TextField
                fullWidth
                id="email"
                type="email"
                placeholder="Nhập email"
                variant="outlined"
                margin="normal"
                sx={{ mt: 1, '& .MuiOutlinedInput-root': { background: 'rgba(255, 255, 255, 0.2)', '& input': { color: 'white' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' } }, '& .MuiInputBase-input::placeholder': { color: 'rgba(255, 255, 255, 0.7)' } }}
              />
            </Box>
            <Box className="form-group" sx={{ mb: 2 }}>
              <Typography component="label" htmlFor="password" color="text.primary" sx={{ mb: 1, fontSize: '1rem' }}>
                Mật khẩu
              </Typography>
              <TextField
                fullWidth
                id="password"
                type="password"
                placeholder="Nhập mật khẩu"
                variant="outlined"
                margin="normal"
                sx={{ mt: 1, '& .MuiOutlinedInput-root': { background: 'rgba(255, 255, 255, 0.2)', '& input': { color: 'white' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' } }, '& .MuiInputBase-input::placeholder': { color: 'rgba(255, 255, 255, 0.7)' } }}
              />
            </Box>
            <Box className="form-options" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
              <FormControlLabel
                control={<Checkbox color="primary" />}
                label="Ghi nhớ đăng nhập"
                sx={{ color: 'text.secondary', '& .MuiTypography-root': { fontSize: '0.9rem' } }}
              />
              <Typography component="a" href="#" color="primary" sx={{ textDecoration: 'none', fontSize: '0.9rem', '&:hover': { textDecoration: 'underline' } }}>
                Quên mật khẩu?
              </Typography>
            </Box>
            <StyledButton type="submit">Đăng nhập</StyledButton>
          </Box>
          <Box className="social-login" sx={{ mt: 3 }}>
            <Typography align="center" color="text.secondary" sx={{ mb: 2, fontSize: '0.9rem' }}>
              Hoặc đăng nhập bằng
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
              <Button
                className="social-btn google-btn"
                sx={{
                  bgcolor: '#db4437',
                  color: '#fff',
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  '&:hover': { bgcolor: '#c1352b' },
                }}
              >
                <FontAwesomeIcon icon={faGoogle} className="icon" style={{ marginRight: '8px' }} />
                Google
              </Button>
              <Button
                className="social-btn facebook-btn"
                sx={{
                  bgcolor: '#4267b2',
                  color: '#fff',
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  '&:hover': { bgcolor: '#365899' },
                }}
              >
                <FontAwesomeIcon icon={faFacebookF} className="icon" style={{ marginRight: '8px' }} />
                Facebook
              </Button>
            </Stack>
          </Box>
          <Typography align="center" color="text.secondary" mt={2} className="switch-form" sx={{ fontSize: '0.9rem' }}>
            Bạn chưa có tài khoản?{' '}
            <Link to="/register" style={{ color: '#68bfb5', textDecoration: 'none' }}>
              Đăng ký
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}