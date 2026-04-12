import { TextField, Button, Paper, Typography, Container, Box, Grid } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';


interface AuthPageProps {
  type: 'Login' | 'Signup';
}

const AuthPage2 = ({type}: AuthPageProps) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [firstName, setFirstName] = useState('');
  const [middleInitial, setMiddleInitial] = useState('');
  const [lastName, setLastName] = useState('');

  const handleLogin = async () => {
    try {
      const response = await api.post('/users/login',
      {
        username: username,
        password: password
      });
      //alert("Response T: " + response.data.token);

      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      //alert(err.response?.data?.message || "Login failed");
      alert(err.details);
    }
  };

  const handleSignup = async () => {
    try {
      // Sending data to /api/signup
      await api.post('/users/signup', {
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        middleInital: middleInitial
      });
      alert("Signup successful! Please login.");
      navigate('/');
    } catch (err: any) {
      alert(err.message);
      //alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <Grid container  sx={{ justifyContent: "center", alignItems: "center", minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Grid sx={{xs: 11, sm: 8, md: 4}} >
        <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h4" sx={{textAlign: "center"}}>
            {type === 'Login' && "Login"}
            {type === 'Signup' && "Signup"}
          </Typography>
          
          {type === 'Signup' &&
          <TextField
            label="First Name" 
            fullWidth 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)} 
          />}

          {type === 'Signup' &&
          <TextField 
            label="Middle Initial" 
            fullWidth 
            value={middleInitial}
            onChange={(e) => setMiddleInitial(e.target.value)} 
          />}

          {type === 'Signup' &&
          <TextField 
            label="Last Name" 
            fullWidth 
            value={lastName}
            onChange={(e) => setLastName(e.target.value)} 
          />}

          <TextField 
            label="Username" 
            fullWidth 
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
          />
          <TextField 
            label="Password" 
            type="password" 
            fullWidth 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          {type === 'Login' && <Button variant="contained" fullWidth onClick={handleLogin}>
            Log in
          </Button>}

          {type === 'Signup' && <Button variant="contained" color="secondary" fullWidth onClick={handleSignup}>
            Sign up
          </Button>}

          {type === 'Signup' &&
          <Button variant="text" fullWidth onClick={() => navigate('/')}>
            Already have an account? Login
          </Button>}
          
          {type === 'Login' &&
          <Button variant="text" fullWidth onClick={() => navigate('/signup')}>
            Need an account? Sign Up
          </Button>}
        </Paper>
      </Grid>
    </Grid>
  );
}

// const AuthPage: React.FC<{ type: 'Login' | 'Signup' }> = ({ type }) => (
//   <Container maxWidth="sm">
//     <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//       <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
//         <Typography variant="h5" gutterBottom>{type}</Typography>
//         <TextField fullWidth label="Email" margin="normal" />
//         {type === 'Signup' &&
//           <TextField fullWidth
//             label="Username" type="text" margin="normal" />}

//         <TextField fullWidth label="Password" type="password" margin="normal" />
//         {type === 'Signup' &&
//         <TextField fullWidth
//           label="Confirm Password" type="password" margin="normal" />}

//         <Button fullWidth variant="contained" sx={{ mt: 3 }}>
//           {type === 'Signup' && "Sign up"}
//           {type === 'Login' && "Log in"}
//         </Button>
//       </Paper>
//     </Box>
//   </Container>
// );

export default AuthPage2;