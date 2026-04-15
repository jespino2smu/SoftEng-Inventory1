import React, { useState } from 'react';
import axios from 'axios';
import { 
  Container, Paper, Typography, TextField, 
  Button, MenuItem, FormControl, InputLabel, Select, Box, Alert, 
  type AlertColor
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

import api from '../api/api';

const getSeverity = (type: string): AlertColor => {
  const map: Record<string, AlertColor> = { 
    red: 'error', 
    yellow: 'warning', 
    info: 'info' 
  };
  // Fallback to 'info' if the type doesn't match
  return map[type] || 'info'; 
};

const CreateNotification = () => {
  const [formData, setFormData] = useState({ type: 'info', message: '' });
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
        
      await api.post('/notifications/add', formData);
      setStatus({ type: 'success', msg: 'Notification generated successfully!' });
      setFormData({ type: 'info', message: '' }); // Reset form
    } catch (error) {
      setStatus({ type: 'error', msg: 'Failed to create notification.' });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Generate New Notification
        </Typography>

        {status.msg && (
          <Alert severity={getSeverity(status.type)} sx={{ mb: 3 }}>{status.msg}</Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Severity Level</InputLabel>
            <Select
              value={formData.type}
              label="Severity Level"
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <MenuItem value="info">Info (Blue - Clickable)</MenuItem>
              <MenuItem value="yellow">Warning (Yellow)</MenuItem>
              <MenuItem value="red">Critical (Red)</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Notification Message"
            multiline
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="e.g. System maintenance starting in 10 minutes..."
            required
            sx={{ mb: 3 }}
          />

          <Button 
            fullWidth 
            variant="contained" 
            type="submit" 
            size="large"
            endIcon={<SendIcon />}
            disabled={!formData.message}
            sx={{ 
              py: 1.5,
              fontWeight: 'bold',
              backgroundColor: formData.type === 'red' ? '#d32f2f' : 
                               formData.type === 'yellow' ? '#ed6c02' : '#0288d1'
            }}
          >
            Broadcast Notification
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateNotification;