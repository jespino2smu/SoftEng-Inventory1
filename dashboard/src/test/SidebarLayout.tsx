import React, { useEffect, useState } from 'react';
import { 
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, 
  ListItemText, Badge, Divider, Typography 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import axios from 'axios';

import api from '../api/api';

const drawerWidth = 240;

const SidebarLayout = ({ children: any }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  // Fetch unread count from server
  const fetchUnreadCount = async () => {
    try {
      const { data } = await api.get('/notifications');
      // Filter for 'info' type and isRead === false
      const unread = data.filter(n => n.type === 'info' && !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching badge count:", error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    // Optional: Poll every 10 seconds to update badge
    const interval = setInterval(fetchUnreadCount, 10000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { text: 'View Notifications', icon: <NotificationsIcon />, path: '/', badge: unreadCount },
    { text: 'Create New', icon: <AddCircleIcon />, path: '/create', badge: 0 },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" color="primary" fontWeight="bold">
            Admin Portal
          </Typography>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => navigate(item.path)}>
                <ListItemIcon>
                  {item.badge > 0 ? (
                    <Badge badgeContent={item.badge} color="error">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      
      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
        {children}
      </Box>
    </Box>
  );
};

export default SidebarLayout;