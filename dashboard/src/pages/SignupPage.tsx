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

export default function SignupPage() {
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

  const validate = () => {
    let newErrors: any = {};

    if (!form.firstName.trim()) newErrors.firstName = "Required";
    if (!form.lastName.trim()) newErrors.lastName = "Required";
    if (!form.username.trim()) newErrors.username = "Required";

    if (!form.password) {
      newErrors.password = "Password is required";
    } else {
      const passwordError = validatePassword(form.password);
      if (passwordError) newErrors.password = passwordError;
    }

    // Confirm password
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
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

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
        handleSignup();
      //console.log("Form submitted:", form);
    } else {
        return;
    }

  };

  const handleSignup = async () => {
    try {
      // Sending data to /api/signup
      await api.post('/users/signup', {
        username: form.username,
        password: form.password,
        firstName: form.firstName,
        middleInital: form.middleInitial,
        lastName: form.lastName,
      });
      alert("Signup successful! Please login.");
      navigate('/login');
    } catch (err: any) {
      alert(err.message);
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
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            margin="normal"
            value={form.firstName}
            onChange={handleChange}
            error={!!errors.firstName}
            helperText={errors.firstName}
          />

          <TextField
            fullWidth
            label="Middle Initial"
            name="middleInitial"
            margin="normal"
            inputProps={{ maxLength: 1 }}
            value={form.middleInitial}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            margin="normal"
            value={form.lastName}
            onChange={handleChange}
            error={!!errors.lastName}
            helperText={errors.lastName}
          />

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

          <TextField
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
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ marginTop: 3 }}
          >
            Create Account
          </Button>

          <Button variant="text" fullWidth onClick={() => navigate('/login')}>
            Already have an account? Login
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}