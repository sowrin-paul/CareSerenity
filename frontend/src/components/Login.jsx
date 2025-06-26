import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import GoogleIcon from '@mui/icons-material/Google';
import { GoogleLogin } from '@react-oauth/google';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import styles from '../css/Color.module.css';
import bgImage from '../assets/bg_4.jpg';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  background: 'rgba(35, 39, 47, 0.85)',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: '100vh',
  padding: theme.spacing(2),
  backgroundImage: `url(${bgImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'fixed',
  position: 'relative',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
  },
}));

const Login = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const navigate = useNavigate();

  const validateInputs = () => {
    let valid = true;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      valid = false;
    } else {
      setEmailError(false);
    }
    if (!password || password.length < 6) {
      setPasswordError(true);
      valid = false;
    } else {
      setPasswordError(false);
    }
    return valid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!validateInputs()) return;

    try {
      const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.data.access);
        const userId = data.data.id;
        const userRole = data.data.role;

        if (userRole === 0) {
          navigate(`/user-home/${userId}`);
        } else if (userRole === 1) {
          navigate(`/organization-profile/${userId}`);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Invalid credentials");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <React.Fragment>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="center">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{
              width: '100%',
              fontSize: 'clamp(2rem, 10vw, 2.15rem)',
              color: 'var(--primary-title-color)',
              fontFamily: 'var(--primary-font), sans-serif',
              fontWeight: 700,
              textAlign: 'center',
              letterSpacing: 1,
            }}
          >
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >

            {/* email field */}
            <FormControl>
              <TextField
                error={emailError}
                helperText={emailError ? "Please enter a valid email address." : ""}
                id="email"
                label="Email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                value={email}
                onChange={e => setEmail(e.target.value)}
                InputLabelProps={{
                  style: { color: '#b0bec5' },
                }}
                sx={{
                  mb: 2,
                  input: {
                    color: '#f5f5f5',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#00bcd4',
                    },
                    '&:hover fieldset': {
                      borderColor: '#00bcd4',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff4081',
                    },
                    background: '#23272f',
                  },
                  '& .MuiFormHelperText-root': {
                    color: '#ff4081',
                  },
                }}
              />
            </FormControl>

            {/* password field */}
            <FormControl>
              <TextField
                error={passwordError}
                helperText={passwordError ? "Password must be at least 6 characters long." : ""}
                name="password"
                label="Password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                value={password}
                onChange={e => setPassword(e.target.value)}
                InputLabelProps={{
                  style: { color: '#b0bec5' },
                }}
                sx={{
                  mb: 2,
                  input: {
                    color: '#f5f5f5',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#00bcd4',
                    },
                    '&:hover fieldset': {
                      borderColor: '#00bcd4',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#ff4081',
                    },
                    background: '#23272f',
                  },
                  '& .MuiFormHelperText-root': {
                    color: '#ff4081',
                  },
                }}
              />
            </FormControl>

            {/* remember label */}
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" sx={{
                color: 'var(--primary-color-light)',
                '&.Mui-checked': { color: 'var(--primary-color-dark)' }
              }} />}
              label="Remember me"
              sx={{ color: 'var(--primary-title-color)', fontFamily: 'var(--primary-font)', fontSize: 14, }}
            />

            {/* sign in button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 1,
                background: 'var(--button-color)',
                color: '#fff',
                fontFamily: 'var(--primary-font)',
                fontWeight: 600,
                fontSize: 18,
                letterSpacing: 1,
                '&:hover': {
                  background: 'var(--primary-color-dark)',
                },
                boxShadow: 'none',
                borderRadius: '4px',
                py: 1.2,
              }}
            >
              Sign in
            </Button>
            {error && (
              <Typography color="error" sx={{ mt: 1, fontFamily: 'var(--primary-font)' }}>
                {error}
              </Typography>
            )}

            {/* forgot password */}
            <Link
              component="button"
              type="button"
              variant="body2"
              sx={{
                alignSelf: 'center',
                color: 'var(--secondary-title-color)',
                fontFamily: 'var(--primary-font)',
                mt: 1,
                fontSize: 14,
              }}
              onClick={() => navigate('/forgot-password')}
            >
              Forgot your password?
            </Link>
          </Box>
          <Divider sx={{ color: 'var(--primary-title-color)', fontFamily: 'var(--primary-font)', fontSize: 12, }}>or</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<GoogleIcon />}
              sx={{
                color: '#fff',
                borderColor: '#4285F4',
                background: '#4285F4',
                fontWeight: 600,
                fontSize: 16,
                textTransform: 'none',
                fontFamily: 'var(--primary-font)',
                '&:hover': {
                  background: '#357ae8',
                  borderColor: '#357ae8',
                },
                mb: 1,
              }}
              onClick={() => {
                <GoogleLogin
                  onSuccess={async credentialResponse => {
                    // credentialResponse.credential is the Google ID token
                    const res = await fetch('http://127.0.0.1:8000/auth/google/', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ token: credentialResponse.credential }),
                    });
                    if (res.ok) {
                      // handle login success (store JWT, redirect, etc)
                    } else {
                      // handle error
                    }
                  }}
                  onError={() => {
                    alert('Google Sign In Failed');
                  }}
                />
                alert('Google Sign Up not implemented');
              }}
              fullWidth
            >
              Sign up with Google
            </Button>
            <Typography sx={{ textAlign: 'center', fontFamily: 'var(--primary-font)', color: 'var(--primary-text-color)', fontSize: 14, }}>
              Don&apos;t have an account?{' '}
              <Link
                component="button"
                variant="body2"
                sx={{ color: 'var(--primary-color-dark)', fontFamily: 'var(--primary-font)', fontSize: 14, }}
                onClick={() => navigate('/signup')}
              >
                Sign up
              </Link>
            </Typography>
            <Typography sx={{ textAlign: 'center', mt: 1 }}>
              <Link
                component="button"
                variant="body2"
                sx={{ color: 'var(--secondary-title-color)', fontFamily: 'var(--primary-font)', fontSize: 14, }}
                onClick={() => navigate('/')}
              >
                Go Back
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </React.Fragment>
  );
}

export default Login;