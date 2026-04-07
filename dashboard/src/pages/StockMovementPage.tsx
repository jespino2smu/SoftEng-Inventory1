import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";

import { 
Box, Button, Dialog,
DialogContent, DialogActions, Stack, Paper,
Table, TableBody, TableCell, TableContainer, TableRow,
useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { axPost } from '../config/axios-config';

import { type Product} from '../types/Product';

import { SearchField } from "../components/SearchField";
import AddIcon from "@mui/icons-material/Add";
import IncrementField from '../components/IncrementField';


interface StockMovementProps {
  display: boolean;
  data: Product[],
  setData: Dispatch<SetStateAction<Product[]>>;
  submitLabel: string;
  onSubmit: () => void;
  onReturn: () => void;
}

const StockMovementPage = ({display, data, setData, submitLabel, onSubmit, onReturn}: StockMovementProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [open, setOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  
  const [currentProduct, setCurrentProduct] = useState<Product>({
    ProductId: 0,
    Name: '',
    Quantity: '',
  });


//   const [items, setItems] = useState<Item[]>([
//     { ProductId: 1, ProductName: "Apple Pie",},
//     { ProductId: 2, ProductName: "Banana Bread"},
//     { ProductId: 3, ProductName: "Cherry Tart"},
//     { ProductId: 4, ProductName: "Blueberry Muffin"},
//   ]);


  useEffect(() => {
    
    updateData();
  }, []);

  async function updateData() {
  const response = await axPost('/stocks/get-products', {
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

    setSearchSuggestions(response[0]);
  }


  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setCurrentProduct({
        ProductId: 0,
        Name: '',
        Quantity: '',
    });
  };

  const handleAdd = () => {
    //console.log("Adding Item:", newItem);
    setData(prev => {
        const exists = prev.some(product => product.ProductId === currentProduct.ProductId);

        if (exists) {

        return prev.map(product =>
            product.ProductId === currentProduct.ProductId?
            { ...product, ...currentProduct }
            : product
        );
        } else {
            return [...prev, currentProduct];
        }
    });
    handleClose();
  };

  function handleSearchSuggestionClick(id: number, name: string) {
    setCurrentProduct(prev => ({
      ...prev,
      ProductId: id,
      Name: name
    }));
  }













  return (
    <>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'space-between', 
        alignItems: 'center', 
      }}>
        {display &&
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
            onClick={() =>{
              onReturn();
            }}
            sx={{
              backgroundColor: '#acacac'
            }}>Back
          </Button>
        </Stack>
        }
        {display &&
        <TableContainer
          component={Paper}
          sx={{
            minHeight: isMobile? 'calc(100vh - 90px)' : 'calc(100vh - 200px)',
            maxHeight: isMobile? 'calc(100vh - 90px)' : 'calc(100vh - 200px)',
            width: '100%',
            overflow: 'auto' }}>
          <Table aria-label="responsive table">

            <TableBody>
              {data.map((product, index) => (
                <TableRow hover key={index}>
                  <TableCell align="left">
                    {product.Name}
                  </TableCell>
                  <TableCell align="right">
                    <IncrementField max={50}
                      value={product.Quantity.toString()}
                      setValue={(val) => (
                        setData((prevData) => {
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
        }
      {display &&
      <Box sx={{
        textAlign: "center",
        mt: '5px'
        }}>
        <Button
          variant="contained"
          size="small"
          onClick={onSubmit}
          sx={{
            height: '36px',
            padding: 0,
            margin: '0',
            width: { xs: '120px', sm: '120px' }
          }}>
          {submitLabel}
        </Button>
      </Box>
      }
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            position: "absolute",
            top: 20,
            margin: 0
          }
        }}
        
        >
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>

            <SearchField
                data={searchSuggestions}
                onSuggestionPicked={handleSearchSuggestionClick}/>

            <Stack direction="row" justifyContent="center">
              <IncrementField normalSize max={50000}
                value={currentProduct.Quantity}
                setValue={(val) => setCurrentProduct({
                    ...currentProduct,
                    Quantity: val })} />
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
            disabled={!currentProduct.Quantity}
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
      </>
  );
};

export default StockMovementPage;