import React, { useState } from 'react';
import { 
  Box, Typography, Paper, List, ListItem, ListItemButton, 
  ListItemIcon, ListItemText, Checkbox, Divider, Stack,
  Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import { 
  Info, Warning, Error as ErrorIcon, CheckCircle 
} from '@mui/icons-material';

interface NotificationItem {
  id: number;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  dateTime: string;
  description: string;
}

// 1. Using the Interface
const notificationsData: NotificationItem[] = [
  { id: 1, type: 'info', title: "System Update", dateTime: "2026-04-02 10:00 AM", description: "The server will undergo maintenance at midnight. Please save your work." },
  { id: 2, type: 'success', title: "Report Ready", dateTime: "2026-04-01 02:30 PM", description: "The monthly sales report for March is now available in the Reports section." },
  { id: 3, type: 'error', title: "Security Alert", dateTime: "2026-03-30 09:15 AM", description: "Unrecognized login attempt from a new device in London, UK." },
];

const TypeIcon = ({ type }: { type: string }) => {
  const iconProps = { sx: { fontSize: 28 } };
  switch (type) {
    case 'info': return <Info color="info" {...iconProps} />;
    case 'warning': return <Warning color="warning" {...iconProps} />;
    case 'error': return <ErrorIcon color="error" {...iconProps} />;
    case 'success': return <CheckCircle color="success" {...iconProps} />;
    default: return <Info {...iconProps} />;
  }
};

export const NotificationsPage: React.FC = () => {
  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(null);
  //const [checked, setChecked] = useState<number[]>([]);

//   const handleToggle = (value: number) => () => {
//     const currentIndex = checked.indexOf(value);
//     const newChecked = [...checked];

//     if (currentIndex === -1) {
//       newChecked.push(value);
//     } else {
//       newChecked.splice(currentIndex, 1);
//     }
//     setChecked(newChecked);
//   };

//   const handleArchive = (id: number) => {
//     console.log(`Archiving notification: ${id}`);
//     setSelectedNotif(null);
//   };

  

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Notifications
      </Typography>
      <Stack spacing={2}>
        
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {notificationsData.map((notif, index) => (
            <React.Fragment key={notif.id}>
        <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
              <ListItem disablePadding>
                <ListItemButton
                    sx={{ py: 2 }}
                    onClick={() => setSelectedNotif(notif)} alignItems="flex-start">
                  <ListItemIcon sx={{ minWidth: 40, mt: 1 }}>
                    <Checkbox
                      edge="start"
                      //checked={checked.indexOf(notif.id) !== -1}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {notif.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                          {notif.dateTime}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        color="text.primary"
                        sx={{ mt: 1, display: 'block' }}
                      >
                        {notif.description}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
              {index < notificationsData.map.length - 1 && <Divider component="li" />}
        </List>
            </React.Fragment>
          ))}
      </Paper>
      </Stack>

{/* Detail Dialog */}
      <Dialog open={Boolean(selectedNotif)} onClose={() => setSelectedNotif(null)} fullWidth maxWidth="xs">
        {selectedNotif && (
          <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, pt: 3 }}>
              <TypeIcon type={selectedNotif.type} />
              <Box>
                <Typography variant="h6" lineHeight={1.2}>{selectedNotif.title}</Typography>
                <Typography variant="caption" color="text.secondary">{selectedNotif.dateTime}</Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ mt: 2, color: 'text.primary' }}>
                {selectedNotif.description}
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
              <Button 
                variant="contained" 
                onClick={() => setSelectedNotif(null)} 
                fullWidth
              >
                Okay
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

    </Box>
  );
};