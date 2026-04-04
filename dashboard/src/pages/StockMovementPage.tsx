import { useState } from 'react';
import { 
Box, Button, Dialog, DialogTitle, 
DialogContent, DialogActions, TextField, Stack, Paper,
Table, TableBody, TableCell, TableContainer, TableRow,
useMediaQuery,
} from '@mui/material';
import { post } from '../components/api';

import AddIcon from "@mui/icons-material/Add";
import IncrementField from '../components/IncrementField';

export const StockMovementPage = () => {
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', quantity: '' });


  async function sendTest() {
    const response = await post('/users/test', {
        activity: 'Inventory',
    });

    // Object.keys(response[0][0]).forEach(function(k){
    // alert(k + ' - ' + response[0][k]);
// });
  }
  
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

  const [data, setData] = useState([
    { name: 'Widget A', quantity: '50' },
    { name: 'Widget B', quantity: '50' },
    { name: 'Widget B', quantity: '50' },
    { name: 'Widget B', quantity: '50' },
    { name: 'Widget B', quantity: '50' },
    { name: 'Widget B', quantity: '50' },
    { name: 'Widget B', quantity: '50' },
    { name: 'Widget B', quantity: '50' },
    { name: 'Widget B', quantity: '50' },
    { name: 'Widget B', quantity: '50' },
    { name: 'Widget B', quantity: '50' },
  ]);




  return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'space-between', 
        alignItems: 'center', 
      }}>
        <Stack
          direction="row"
          justifyContent="space-between" // spreads children to left/right
          alignItems="center"

          sx={{
            width: '100%',
            height: '30px',
            mb: 2,
            padding: '0 10px',
            paddingTop: '15px'
          }}
        >

          <Button
            variant="contained"
            size="small"
            onClick={handleOpen}
            sx={{
              height: '36px',
              padding: 0,
              margin: '0',
              width: { xs: '120px', sm: '120px' }
            }}>
            <AddIcon />
            Add Item
          </Button>

          <Button variant="contained"
            sx={{
            }}>Test
          </Button>
        </Stack>
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: 'calc(100vh - 90px)',
        width: '100%',
        overflow: 'auto' }}>
      <Table aria-label="responsive table">

        <TableBody>
          {data.map((row, index) => (
            <TableRow hover key={index}>
              <TableCell align="left">
                {row.name}
              </TableCell>
              <TableCell align="right">
                <IncrementField max={50}
                  value={row.quantity.toString()}
                  setValue={(val) => (
                    setData((prevData) => {
                      const newData = [...prevData];
                      newData[index].quantity = val;
                      return newData;
                    }
                  ))} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      <Box sx={{
        textAlign: "center",
        mt: '5px'
        }}>
        <Button
          variant="contained"
          size="small"
          sx={{
            height: '36px',
            padding: 0,
            margin: '0',
            width: { xs: '120px', sm: '120px' }
          }}>
          Submit
        </Button>
      </Box>
      
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="xs">
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
            <Stack direction="row" justifyContent="center">
              <IncrementField normalSize max={50000}
                value={newItem.quantity.toString()}
                setValue={(val) => setNewItem({ ...newItem, quantity: val })} />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ width: "100%" }}>
          <Button
            sx={ useMediaQuery("(orientation: portrait)")?
              {margin: "0 auto"} :
              {
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)"
              }}
            onClick={handleAdd} 
            variant="contained" 
            disabled={!newItem.name || !newItem.quantity}
          >
            Add Item
          </Button>
          <Button
            onClick={handleClose}
            color="inherit"
            sx={{ marginLeft: "auto" }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};