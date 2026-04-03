import { useState } from 'react';
import { 
  Box, Typography, TextField, InputAdornment, 
  Dialog, DialogTitle, DialogContent, IconButton
} from '@mui/material';
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
import { DataTable } from '../components/DataTable';

export const ReportPage = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const reportData = [
    { id: 5001, name: 'Q1 Inventory', quantity: 1400 },
    { id: 5002, name: 'Q2 Inventory', quantity: 2100 },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>Reports</Typography>
      
      <TextField
        fullWidth
        placeholder="Search reports..."
        variant="outlined"
        //onClick={() => setOpen(true)} // Opens dialog
        sx={{ mb: 3, cursor: 'pointer' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <DataTable rows={reportData} />

      {/* Search Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Search Database
          <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Search keyword"
            fullWidth
            variant="standard"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            Showing results for: {searchQuery || "..."}
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};