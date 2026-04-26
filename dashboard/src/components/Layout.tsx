import React, { useEffect, useState } from 'react';
import { 
  Box, AppBar, Toolbar, IconButton, Typography, Drawer, List, 
  ListItem, ListItemButton, ListItemIcon, ListItemText,
  Menu, MenuItem,
  useMediaQuery, useTheme
} from '@mui/material';
import { 
  Menu as MenuIcon, Notifications, AccountCircle, Logout,
  Dashboard, Assessment
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';
import api from '../api/api';


  const drawerWidth = 240;

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for the Mobile Dropdown Menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [anchorElAccount, setAnchorElAccount] = useState(null);
  const openAccount = Boolean(anchorElAccount);

  const [role, setRole] = useState<string>('');

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (path?: string) => {
    setAnchorEl(null);
    if (path) navigate(path);
  };

const navItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/' },
  { text: 'Inventory Tracing', icon: <Assessment />, path: '/tracing', managerOnly: true },
  { text: 'Notifications', icon: <Notifications />, path: '/notifications'},
  { text: 'Logout', icon: <Logout />, path: '/logout'},
];

  useEffect(() => {
    getRole();
  }, [])

  async function getRole() {
    const response = await api.post('/users/role');
    setRole(response.data.role);
    //alert(response.data.role);
  }



const handleAccountClick = (event: any) => {
    // Set the target element that was clicked as the anchor
    setAnchorElAccount(event.currentTarget);
  };

  const handleAccountClose = () => {
    // Reset anchorEl to null to close the menu
    setAnchorElAccount(null);
  };






  return (
    <>
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {/* 1. Menu Icon moved to the leftmost part for mobile */}
          {isMobile && (
            <>
              <IconButton 
                color="inherit" 
                edge="start" 
                onClick={handleMenuClick} 
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorElAccount}
                open={openAccount}
                onClose={() => handleMenuClose()}
              >
                {navItems.map((item) => (
                  !(item.managerOnly && role !== 'Manager') ? (
                    <MenuItem key={item.text} onClick={() => handleMenuClose(item.path)}>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      {/* <ListItemText>{item.text}</ListItemText> */}
                      <ListItemText>{item.managerOnly && role}</ListItemText>
                    </MenuItem>
                  ) : (
                    <div></div>
                  )
                ))}
              </Menu>
            </>
          )}

          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Enterprise App
          </Typography>
          
          {isMobile && <Box sx={{ flexGrow: 1 }} />}

          <IconButton color="inherit"><Notifications /></IconButton>
          <IconButton color="inherit"><AccountCircle /></IconButton>

        </Toolbar>
      </AppBar>

      {/* Sidebar - Persistent on Desktop Only */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {navItems.map((item) => (
                  !(item.managerOnly && role !== 'Manager') ? (
                    <ListItem key={item.text} disablePadding>
                      <ListItemButton onClick={() => navigate(item.path)}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                      </ListItemButton>
                    </ListItem>
                  ) : (
                    <div></div>
                  )
              ))}
            </List>
          </Box>
        </Drawer>
      )}

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
    </>
  );
};

export default Layout;