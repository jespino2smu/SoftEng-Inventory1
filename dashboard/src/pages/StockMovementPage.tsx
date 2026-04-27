import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";

import { 
Box, Button, Dialog,
DialogContent, DialogActions, Stack, Paper,
Table, TableBody, TableCell, TableContainer, TableRow,
useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import api from '../api/api';

import { type Product} from '../types/Product';

import { SearchField } from "../components/SearchField";
import AddIcon from "@mui/icons-material/Add";
import AssignmentAddIcon from '@mui/icons-material/AssignmentAdd';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import IncrementField from '../components/IncrementField';

import { getRole } from '../api/api';

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

  const [openItem, setOpenItem] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);

  const [role, setRole] = useState<string>('');

  const [searchFieldValidity, setSearchFieldValidity] = useState<boolean>(false);
  
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
    const r: any = getRole();
    setRole(r);
  }, []);

  async function updateData() {
  const response: any = await api.post('/stocks/get-products', {
    activity: 'Inventory',
  });

      // let n = "";
      // Object.keys(response.data[0]).forEach(key0 => {
      //   //n += `${key0}: ${response.data[0][key0]}\n`;
      //   Object.keys(response.data[0][key0]).forEach(key1 => {
      //      n += `${key1}: ${response.data[0][key0][key1]}\n`;
      //   });
      // });
      // alert(n);

    setSearchSuggestions(response.data[0]);
  }


  const handleOpenItem = () => setOpenItem(true);

  const handleCloseItem = () => {
    setOpenItem(false);
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
    handleCloseItem();
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
          <Stack direction="row" spacing="3px">
            <Button
              variant="contained"
              size="small"
              onClick={handleOpenItem}
              sx={{
                height: '36px',
                padding: 0,
                margin: '0',
                width: isMobile? '30px' : 'fit-content'
              }}>
              <AssignmentAddIcon />
              {isMobile? "" : "Add Item"}
            </Button>
            
            <Button
              variant="contained"
              size="small"
              // onClick={handleOpenItem}
              sx={{
                height: '36px',
                padding: 0,
                margin: '0',
                width: isMobile? '30px' : 'fit-content'
              }}>
              <PersonAddIcon />
              {isMobile? "" : "Add Staff"}
            </Button>
          </Stack>

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
        open={openItem}
        onClose={handleCloseItem}
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
                setValidity={setSearchFieldValidity}
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
            disabled={!currentProduct.Quantity || searchFieldValidity === false}
          >
            Add Item
          </Button>
          <Button
            onClick={handleCloseItem}
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