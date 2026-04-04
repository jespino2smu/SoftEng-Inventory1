import { useState, useEffect, useMemo } from 'react';
import { 
Box, Button, Dialog, DialogTitle, 
DialogContent, DialogActions, Stack, Paper,
Table, TableBody, TableCell, TableContainer, TableRow,
useMediaQuery,
} from '@mui/material';
import { Document } from 'flexsearch';
import FlexSearch from "flexsearch";

import { post } from '../components/api';

import AddIcon from "@mui/icons-material/Add";
import SearchField from '../components/SearchField';
import IncrementField from '../components/IncrementField';

type Product = {
  ProductId: number;
  ProductName: string;
  Quantity: string;
}

export const StockMovementPage = () => {
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', quantity: '' });
  const [products, setProducts] = useState<Product[]>([]);

  // const index = new Document<Product>({
  //   document: { id: "ProductId", index: ["ProductName", "Quantity"] },
  //   tokenize: "forward", context: true,
  // });

  const index = new FlexSearch.Document<Product>({
    document: {
    id: "ProductId",
    index: [{
      field: "ProductName",
      tokenize: "forward", // important for prefix matching
      encode: "default", // case insensitive
      resolution: 9,
    },],
  }});

  
  async function updateData() {
    const response = await post('/stocks/get-products', {
        activity: 'Inventory',
    });

    //alert(response[0][0].Quantity);

    // Object.keys(response[0][0]).forEach(
    //   function(k) {
    //     alert(k + ' - ' + response[0][k]);
    // });



    // response[0].forEach(
    //   (item: Product) => index.add(item)
    // );

    // response[0].forEach((item: { ProductId: any; ProductName: string; })  => {
    //   index.add({
    //     id: item.ProductId,
    //     name: item.ProductName.toLowerCase(), // normalize to lowercase
    //   });
    // });


    setProducts(response[0]);
  }
  

  useEffect(() => {
    updateData();
  }, [index]);





  // const index: Document<Product> = useMemo(() => {
  //     document: {
  //       id: "ProductId",
  //       index: ["ProductName", "Quantity"],
  //       // store: true,
  //     },
  //     tokenize: "forward",
  //     context: true,
  //   }, []);

  // const index: Document<Product> = useMemo(() => {
  //   return new (Document as any)({
  //     document: {
  //       id: "ProductId",
  //       index: ["ProductName", "Quantity"],
  //       store: true, 
  //     },
  //     tokenize: "forward",
  //     context: true,
  //   });
  // }, []);

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
          {products.map((product, index) => (
            <TableRow hover key={index}>
              <TableCell align="left">
                {product.ProductName}
              </TableCell>
              <TableCell align="right">
                <IncrementField max={50}
                  value={product.Quantity.toString()}
                  setValue={(val) => (
                    setProducts((prevData) => {
                      const newData = [...prevData];
                      newData[index].Quantity = val;
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
            <SearchField index={index}/>
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