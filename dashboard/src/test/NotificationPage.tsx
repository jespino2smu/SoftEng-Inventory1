import React, { useEffect, useState } from 'react';
import { Container, Typography, Alert, Stack, Paper, Box, AlertTitle, Button, CircularProgress } from '@mui/material';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

import api from '../api/api';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications()
  }, []);

  async function getNotifications() {
    try {
      const response = await api.post('/notifications/get', {});
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }
  
  const toggleRead = async (id: any) => {
    const response = await api.patch(`/notifications/set-read/${id}`);
    setNotifications((prev: any) => 
        prev.map((n: any) => (n.id === id ? response.data : n))
      );
  };
  const getSeverity = (type: any) => {
    const map: any = { red: 'error', yellow: 'warning', info: 'info' };
    return map[type] || 'info';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
  <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={4} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 800, mb: 3 }}>
          Notifications
        </Typography>

        <Stack spacing={2}>
          {notifications.map((notif: any) => {
            const isInfo = notif.type === 'info';
            
            return (
              <Alert 
                key={notif.id} 
                severity={getSeverity(notif.type)}
                variant={notif.isRead ? "outlined" : "filled"}
                onClick={() => toggleRead(notif.id)}
                sx={{ 
                  transition: 'all 0.2s ease-in-out',
                  opacity: notif.isRead ? 0.6 : 1,
                  // Only show pointer and hover effect if it's an info notification
                  cursor: isInfo ? 'pointer' : 'default',
                  '&:hover': isInfo ? {
                    transform: 'scale(1.02)',
                    filter: 'brightness(95%)',
                    boxShadow: 2
                  } : {},
                  '& .MuiAlert-message': { width: '100%' } 
                }}
              >
                <AlertTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box component="span" sx={{ fontWeight: 'bold' }}>
                    {notif.type.toUpperCase()} 
                    {notif.isRead && " (READ)"}
                  </Box>
                  <Typography variant="caption">
                    {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </AlertTitle>
                {notif.message}
              </Alert>
            );
          })}
        </Stack>
      </Paper>
    </Container>
  );
};

export default NotificationPage;