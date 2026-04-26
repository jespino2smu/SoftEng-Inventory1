import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Container,
  Paper
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import api from "../api/api";

interface AuthPageProps {
  type: 'Login' | 'Signup';
}

const AuthPage = ({type}: AuthPageProps) => {
  const [form, setForm] = useState({
    firstName: "",
    middleInitial: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: ""
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState<any>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Must be at least 8 characters long";
    }
    if (!/[A-Za-z]/.test(password)) {
      return "Must include at least 1 letter";
    }
    if (!/\d/.test(password)) {
      return "Must include at least 1 number";
    }
    if (!/[@$!%*#?&]/.test(password)) {
      return "Must include at least 1 special character";
    }
    return "";
  };

  const validateHasLetters = (str: string) => /[\p{L}\p{M}]/u.test(str);
  const validateNameChar = (str: string) => /^[\p{L}\p{M}\s]+$/u.test(str);
  const validateNameCharWithPeriod = (str: string) => /^[\p{L}\p{M}\s.]+$/u.test(str);
  const validateNameCharWithDash = (str: string) => /^[\p{L}\p{M}\s-]+$/u.test(str);

  const validate = () => {
    let newErrors: any = {};

    if (!form.firstName.trim()) newErrors.firstName = "Required";
    else if (!validateNameCharWithPeriod(form.firstName)) newErrors.firstName = "Only letters, spaces, and periods allowed";
    else if (!validateHasLetters(form.firstName)) newErrors.firstName = "Requires at least 1 letter";
    
    if (!form.lastName.trim()) newErrors.lastName = "Required";
    else if (!validateNameCharWithDash(form.lastName)) newErrors.lastName = "Only letters, spaces, and dashes allowed";
    else if (!validateHasLetters(form.lastName)) newErrors.lastName = "Requires at least 1 letter";

    if (!form.middleInitial.trim()) { }
    else if (form.middleInitial && !validateHasLetters(form.middleInitial)) newErrors.middleInitial = "Only letter allowed";

    if (!form.username.trim()) newErrors.username = "Required";

    if (!form.password) {
      newErrors.password = "Password is required";
    } else {
      const passwordError = validatePassword(form.password);
      if (passwordError) newErrors.password = passwordError;
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      newErrors.password = "Passwords do not match";
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value
    });

    setErrors({
      ...errors,
      [name]: ""
    });
  };

  const clear = () => {
    setForm({
    firstName: "",
    middleInitial: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  }

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    if (type === 'Signup') {
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0 && !handleCheckExistingStaff()) {
            handleSignup();
        //console.log("Form submitted:", form);
        } else {
            return;
        }
    } else if (type === 'Login') {
        let newErrors: any = {};
        if (!form.username.trim()) newErrors.username = "Required";
        if (!form.password) newErrors.password = "Required";
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            handleLogin();
        } else {
            return;
        }
    }
  };
  
  const handleCheckExistingStaff = async () => {
    try {
      const response = await api.post('/users/staff-exists',
      {
        username: form.username,
        firstName: form.firstName,
        lastName: form.lastName
      });
      //alert("Response T: " + response.data.token);
      let newErrors: any = {};
      
      //alert("hasExistingStaff: " + hasExistingStaff);
      if (response.data.exists) {
        if (response.data.type === "username" || response.data.type === "both") {
          newErrors.username = "Username already exists";
        } else if (response.data.type === "name" || response.data.type === "both") {
          newErrors.firstName = "Name already exists";
          newErrors.lastName = "Name already exists";
        }
      }
      setErrors(newErrors);

      localStorage.setItem('token', response.data.token);
      if (response.data.exists) {
        return true;
      }
      return false;

    } catch (err: any) {
      //alert(err.response?.data?.message || "Login failed");
      //alert(err.details);
      alert("Network error, try again later");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await api.post('/users/login',
      {
        username: form.username,
        password: form.password
      });
      //alert("Response T: " + response.data.token);

      localStorage.setItem('token', response.data.token);
      clear();
      navigate('/');
    } catch (err: any) {
      //alert(err.response?.data?.message || "Login failed");
      //alert(err.details);
      alert("Network error, try again later");
    }
  };

  const handleSignup = async () => {
    try {
      // Sending data to /api/signup
      await api.post('/users/signup', {
        username: form.username,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        middleInital: form.middleInitial
      });
      alert("Signup successful! Please login.");
      
      clear();
      navigate('/login');
    } catch (err: any) {
      //alert(err.message);
      alert("Network error, try again later");
      //alert(err.response?.data?.message || "Signup failed");
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Paper elevation={3}
        sx={{
            padding: 4, marginTop: 8
        }}>
        <Typography variant="h5" gutterBottom>
          Sign Up
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {type === 'Signup' && <TextField
            fullWidth
            label="First Name"
            name="firstName"
            margin="normal"
            value={form.firstName}
            onChange={handleChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
          />}

          {type === 'Signup' && <TextField
            fullWidth
            label="Middle Initial"
            name="middleInitial"
            margin="normal"
            inputProps={{ maxLength: 1 }}
            value={form.middleInitial}
            onChange={handleChange}
            error={!!errors.middleInitial}
            helperText={errors.middleInitial}
          />}

          {type === 'Signup' && <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            margin="normal"
            value={form.lastName}
            onChange={handleChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
          />}

          <TextField
            fullWidth
            label="Username"
            name="username"
            margin="normal"
            value={form.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            margin="normal"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {type === 'Signup' && <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            margin="normal"
            type={showConfirmPassword ? "text" : "password"}
            value={form.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />} 

          {/* <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ marginTop: 3 }}
          >
            Create Account
          </Button> */}

          {type === 'Login' && <Button variant="contained" fullWidth
            type="submit"
            sx={{ marginTop: 3 }}>
            Log in
          </Button>}

          {type === 'Signup' && <Button variant="contained" color="secondary" fullWidth
            type="submit"
            sx={{ marginTop: 3 }}>
            Sign up
          </Button>}
          
          {type === 'Signup' &&
          <Button variant="text" fullWidth
            sx={{ marginTop: 3 }}
            onClick={() => {
              clear();
              navigate('/login');
              }}>
            Already have an account? Login
          </Button>}
          
          {type === 'Login' &&
          <Button variant="text" fullWidth
            sx={{ marginTop: 3 }}
            onClick={() => {
              clear();
              navigate('/signup');
            }}>
            Need an account? Sign Up
          </Button>}
        </Box>
      </Paper>
    </Container>
  );
}

export default AuthPage;