import { TextField, Button, Paper, Typography, Container, Box } from '@mui/material';

export const AuthPage: React.FC<{ type: 'Login' | 'Signup' }> = ({ type }) => (
  <Container maxWidth="sm">
    <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
        <Typography variant="h5" gutterBottom>{type}</Typography>
        <TextField fullWidth label="Email" margin="normal" />
        {type === 'Signup' &&
          <TextField fullWidth
            label="Username" type="text" margin="normal" />}

        <TextField fullWidth label="Password" type="password" margin="normal" />
        {type === 'Signup' &&
        <TextField fullWidth
          label="Confirm Password" type="password" margin="normal" />}

        <Button fullWidth variant="contained" sx={{ mt: 3 }}>
          {type === 'Signup' && "Sign up"}
          {type === 'Login' && "Log in"}
        </Button>
      </Paper>
    </Box>
  </Container>
);