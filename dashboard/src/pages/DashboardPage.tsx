import { useState } from 'react';
import { 
  Box, Typography, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, Stack 
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { DataTable } from '../components/DataTable';

export const DashboardPage = () => {
  const [open, setOpen] = useState(false);
  
  // Local state for the new item form
  const [newItem, setNewItem] = useState({ name: '', quantity: '' });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewItem({ name: '', quantity: '' }); // Reset form on close
  };

  const handleAdd = () => {
    console.log("Adding Item:", newItem);
    // Here you would typically update your data state or call an API
    handleClose();
  };

  const dashboardData = [
    { id: 101, name: 'Widget A', quantity: 50 },
    { id: 102, name: 'Widget B', quantity: 20 },
  ];

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Dashboard
        </Typography>
        
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleOpen}
        >
          Add Item
        </Button>
      </Box>

      <DataTable rows={dashboardData} />

      {/* Add Item Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              label="Item Name"
              fullWidth
              variant="outlined"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <TextField
              label="Initial Quantity"
              type="number"
              fullWidth
              variant="outlined"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleAdd} 
            variant="contained" 
            disabled={!newItem.name || !newItem.quantity}
          >
            Add Item
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};