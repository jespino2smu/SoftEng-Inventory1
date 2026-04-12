import { useEffect, useState } from 'react';
import { 
  Box, Typography, TextField, InputAdornment, 
  Dialog, DialogTitle, DialogContent, IconButton
} from '@mui/material';
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
import { StockActivityTable } from '../components/StockActivityTable';

import api from '../api/api';

export const InventoryTracingPage = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stockActivities, setStockActivities] = useState([]);

  
  useEffect(() => {
    getStockActivities();
  }, []);
  
  async function getStockActivities() {
      const result: any = await api.post('/stocks/get-stock-activities', {});
      setStockActivities(result);
      
      // let readActivities: string = "";
      // result.forEach((item: any) => {
      //   readActivities += `[${item.ActivityId}] ${item.ActivityType} - ${item.Date}\n`
      //   item.Products.forEach((product: any) => {
      //     readActivities += `     ${product.Quantity} x [${product.ProductName}]\n`;
      //   })
      //   readActivities += `\n`
      // })
      // alert(readActivities);
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>Inventory Tracing</Typography>
      
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

      <StockActivityTable rows={stockActivities} />

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