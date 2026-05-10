import { useState, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";

import { 
Box, Button, Dialog,
DialogContent, DialogActions, Stack, Paper,
Table, TableBody, TableCell, TableContainer, TableRow,
useMediaQuery,
TableHead,
Checkbox,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import api from '../api/api';

import { type Product} from '../types/Product';

import { SearchField } from "../components/SearchField";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddIcon from "@mui/icons-material/Add";
import AssignmentAddIcon from '@mui/icons-material/AssignmentAdd';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import IncrementField from '../components/IncrementField';

import { getRole } from '../api/api';

interface StockMovementProps {
  display: boolean;
  itemData: Product[],
  setItemData: Dispatch<SetStateAction<Product[]>>;
  setStaffData: Dispatch<SetStateAction<any[]>>;
  submitLabel: string;
  onSubmit: () => void;
  onReturn: () => void;
  onEmptyList: () => void;
  onInvalidQuantity: (arg0: string) => void;
}

const StockMovementPage = ({
  display, itemData, setItemData, setStaffData, submitLabel,
  onSubmit, onReturn, onEmptyList, onInvalidQuantity}: StockMovementProps
) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [dialogContent, setDialogContent] = useState("");

  const [openItem, setOpenItem] = useState(false);
  const [productSuggestions, setProductSuggestions] = useState<Product[]>([]);
  const [staff, setStaff] = useState([]);

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
    let response: any = await api.post('/stocks/get-products', {
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

    setProductSuggestions(response.data[0]);

    response = await api.post('/stocks/get-staff');
    setStaff(response.data);
    //alert(JSON.stringify(response.data));
  }


  const handleOpenItem = (contentType: string) => {
    setDialogContent(contentType);
    setOpenItem(true)
  };

  const handleCloseItem = () => {
    setOpenItem(false);
    setCurrentProduct({
        ProductId: 0,
        Name: '',
        Quantity: '',
    });
  };

  const handleAddItem = () => {
    //console.log("Adding Item:", newItem);
    setItemData(prev => {
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

  const handleAddStaff = () => {
    //console.log("Adding Item:", newItem);
    // setData(prev => {
    //     const exists = prev.some(product => product.ProductId === currentProduct.ProductId);

    //     if (exists) {

    //     return prev.map(product =>
    //         product.ProductId === currentProduct.ProductId?
    //         { ...product, ...currentProduct }
    //         : product
    //     );
    //     } else {
    //         return [...prev, currentProduct];
    //     }
    // });
    handleCloseItem();
  };


  function handleSearchSuggestionClick(id: number, name: string) {
    setCurrentProduct(prev => ({
      ...prev,
      ProductId: id,
      Name: name
    }));
  }

  const onSubmitButtonClick = () => {
    if (itemData.length === 0) {
      onEmptyList();
    } else {

      for (let i = 0; i < itemData.length; i++) {
        const quantity = parseInt(itemData[i].Quantity);
        if (isNaN(quantity)) {
          onInvalidQuantity("Quantity of items must be a valid number.");
          return;
        } else if (quantity <= 0) {
          onInvalidQuantity("Quantity must be a positive number.");
          return;
        }
      }
      onSubmit();
    }
  };

  function removeItem(index: number) {
    setItemData(prevData => prevData.filter((_, i) => i !== index));
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
              onClick={() => handleOpenItem("item")}
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
              onClick={() => handleOpenItem("staff")}
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
              {itemData.map((product, index) => (
                <TableRow hover key={index}>
                  <TableCell align="left">

                    <Button variant="contained" sx={{
                      backgroundColor: '#ce1b1b',
                      minWidth: isMobile? '15px' : '40px',
                      minHeight: isMobile? '15px' : '40px',
                      padding: 0, marginRight: '10px'
                    }}
                      onClick={() => removeItem(index)}>
                      <RemoveCircleIcon />
                    </Button>

                    {product.Name}
                  </TableCell>
                  <TableCell align="right">
                    <IncrementField max={50}
                      value={product.Quantity.toString()}
                      setValue={(val) => (
                        setItemData((prevData) => {
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
          onClick={onSubmitButtonClick}
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

            {dialogContent === "item" &&
            <>
              <SearchField
                  data={productSuggestions}
                  setValidity={setSearchFieldValidity}
                  onSuggestionPicked={handleSearchSuggestionClick}/>
              <Stack direction="row" justifyContent="center">
                <IncrementField normalSize max={50000}
                  value={currentProduct.Quantity}
                  setValue={(val) => setCurrentProduct({
                      ...currentProduct,
                      Quantity: val })} />
              </Stack>
            </>
            }
            {dialogContent === "staff" &&
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">Selected</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {staff.map((staff: any, index) => (
            <TableRow key={index} hover
              onClick={() => {
                setStaff((prev: any) =>
                  prev.map((s: any, i: number) =>
                    i === index
                      ? { ...s, Selected: !s.Selected }
                      : s
                  )
                );
              }}
              sx={{ cursor: "pointer" }}
            >
              <TableCell><Checkbox checked={staff.Selected} /> {staff.LastName}, {staff.FirstName} {staff.MiddleInitial}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
            }

          </Stack>
        </DialogContent>
        <DialogActions sx={{ width: "100%" }}>
          <Button
            sx={ useMediaQuery("(orientation: portrait)")?
              {margin: "0 auto"} :
              {
                display: dialogContent === "item"? "visible" : "none",
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)"
              }}
            onClick={handleAddItem} 
            variant="contained" 
            disabled={!currentProduct.Quantity || searchFieldValidity === false}
          >
            Add Item
          </Button>
          <Button
            sx={
              useMediaQuery("(orientation: portrait)")?
              {margin: "0 auto"} :
              {
                display: dialogContent === "staff"? "visible" : "none",
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)"
              }}
            onClick={handleAddStaff} 
            variant="contained" 
          >
            Add Staff
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