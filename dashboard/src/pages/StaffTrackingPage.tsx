import { useEffect, useState } from 'react';
import { 
  Box, Typography, TextField, InputAdornment, 
  Dialog, DialogTitle, DialogContent, IconButton,
  Stack,
  Button
} from '@mui/material';
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
import { StockActivityTable } from '../components/StockActivityTable';

import api from '../api/api';
import ActivitySearchDialog from '../components/ActivitySearchDialog';

// formerly InventoryTracing
export const StaffTrackingPage = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stockActivities, setStockActivities] = useState([]);

  
  useEffect(() => {
    getStockActivities();
  }, []);
  
  async function getStockActivities() {
      const result: any = await api.post('/stocks/get-stock-activities', {});
      setStockActivities(result.data);
  }
  const [openSearchDialog, setOpenSearchDialog] = useState<boolean>(false);

  const emptySearchField = {
    productId: null,
    staffId: null,
    startDate: null,
    endDate: null,

    dispatch: 'on',
    inventory: 'on',
    received: 'on'
  };
  const [searchField, setSearchField] = useState<any>(emptySearchField);















  function setStaff(value: number) {
    setSearchField((prev: any) => ({
      ...prev,
      staffId: value,
    }))
  }

  function updateSearchField(e: any) {
    setSearchField((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  function updateCheckBox(e: any) {
    setSearchField((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }))
  }

  function setStartDate(value: any) {
    setSearchField((prev: any) => ({
      ...prev,
      startDate: value,
    }));
  }
  
  function setEndDate(value: any) {
    setSearchField((prev: any) => ({
      ...prev,
      endDate: value,
    }));
  }

  async function onSearch() {
    // let s = "";
    // Object.keys(searchField).forEach((key: string) => {
    //   s += key + ": " + searchField[key] + "\n";
    // })
    // alert(s);

    const response: any = await api.post('/stocks/search-activities', searchField);

    
    setOpenSearchDialog(false);
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>Staff Tracking</Typography>
      <Stack direction="row" spacing={2} 
        sx={{
          width: '100%',
          height: '40px'
        }}>
        {/* <Button
          variant="contained"
          size="small"
          onClick={() => setOpenSearchDialog(true)}
          sx={{
            height: '36px',
            paddingLeft: '15px',
            paddingRight: '15px',
            margin: '0',
            marginRight: 'auto',
            flexShrink: 0,
          }}>
          <SearchIcon />
          Search
        </Button> */}
      </Stack>


    <ActivitySearchDialog
      open={openSearchDialog}

      field={searchField}
      updateField={updateSearchField}
      setStaff={setStaff}
      updateCheckBox={updateCheckBox}
      
      onNameChange={updateSearchField}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      onSearch={onSearch}
      onCancel={() => setOpenSearchDialog(false)}
      />

      <StockActivityTable rows={stockActivities} />

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