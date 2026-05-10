import { useState, useEffect } from 'react';
import { 
  Box, Typography, Button,
  Stack,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
  TextField, InputAdornment,
  useMediaQuery,
} from '@mui/material';
import {
  LocalShipping as Receive,
  ContentPaste as Inventory,
  ExitToApp as Dispatch,
  Close
 } from '@mui/icons-material';

import api from '../api/api';

import StockMovementPage from './StockMovementPage';
import type {Product} from '../types/Product';
import AlertCards from '../components/AlertCards';

type Movement = "None" | "Receive" | "Dispatch" | "Inventory";

// interface DashboardPageType {
//    setLayoutVisibility?: React.Dispatch<React.SetStateAction<boolean>>;
// }


export const DashboardPage = () => {
  const [displayAlertCards, setDisplayAlertCards] = useState<boolean>(true);

  const [stockMovement, setStockMovement] = useState<Movement>("None");

  const [receiveStocks, setReceiveStocks] = useState<Product[]>([]);
  const [dispatchStocks, setDispatchStocks] = useState<Product[]>([]);
  const [stockInventory, setStockInventory] = useState<Product[]>([]);

  const [displayReceiveStocks, setDisplayReceiveStocks] = useState<boolean>(false);
  const [displayDispatchStocks, setDisplayDispatchStocks] = useState<boolean>(false);
  const [displayStockInventory, setDisplayStockInventory] = useState<boolean>(false);

  const [role, setRole] = useState<string>('');

  const buttonIcon = {fontSize: '40px', };

  const buttonText = {
    paddingLeft: '15px',
    marginRight: 'auto',
    fontSize: {
      lg: '24px',
      xs: '16px',
      sm: '18px'
  }};

  useEffect(() => {
    getRole();
  }, [])
    
  async function getRole() {
    const response = await api.post('/users/role');
    setRole(response.data.role);
  }


  // useEffect(() => {
  //   if (
  //     stockMovement === "Receive" ||
  //      stockMovement === "Dispatch" || 
  //      stockMovement ==="Inventory"
  //   ) {
  //     setLayoutVisibility?.(true);
  //   } else {
      
  //   }
  // }, [stockMovement]);


  function onSubmit(movement: Movement) {
    if (movement === "Dispatch") {
      addActivity(movement, dispatchStocks);
      setDispatchStocks([]);
      setDisplayDispatchStocks(false);
      setDispatchStocks([]);
      
      setErrorDialogTitle("Stock Dispatched Successful");
      setErrorDialogMessage("Stocks have been dispatched successfully.");
      setOpen(true);
    } else if (movement === "Inventory") {
      // let r = "";

      // Object.keys(stockInventory).forEach((i) => {
      //   const attr = stockInventory[i as keyof typeof stockInventory];

      //   Object.keys(attr).forEach((key) => {
      //     r += key + ": " + attr[key as keyof typeof attr] + "\n"
      //   });

      //   r += "\n";
      // });

      // alert(r);
      addActivity(movement, stockInventory);
      setDisplayStockInventory(false);
      setStockInventory([]);
      
      setErrorDialogTitle("Inventory Count Successful");
      setErrorDialogMessage("Inventory submission successfully.");
      setOpen(true);

    } else if (movement === "Receive") {
      addActivity(movement, receiveStocks);
      setDisplayReceiveStocks(false);
      setReceiveStocks([]);
      
      setErrorDialogTitle("Stock Received Successful");
      setErrorDialogMessage("Stocks have been received successfully.");
      setOpen(true);
    }
    setStockMovement("None");
  }

  function onReturn() {
    // setLayoutVisibility?.(false);
    setDisplayAlertCards(true);
    
    setDisplayDispatchStocks(false);
    setDisplayStockInventory(false);
    setDisplayReceiveStocks(false);
    setStockMovement("None");
  }

  async function addActivity(movement: string, stocks: Product[]) {
      // const result = await post('/stocks/add-activity', {
      //   movement: movement,
      //   stocks: stocks,
      // });

      await api.post('/stocks/add-activity', {
        movement: movement,
        stocks: stocks,
      });
  }

  
  function togglePage(movement: Movement) {
    switch (movement) {
      case "Dispatch":
        //setLayoutVisibility?.(true);
        setDisplayAlertCards(false);

        setStockMovement(movement);
        setDisplayDispatchStocks(true);
        setDisplayStockInventory(false);
        setDisplayReceiveStocks(false);
        break;
      case "Inventory":
        //setLayoutVisibility?.(true);
        setDisplayAlertCards(false);

        setStockMovement(movement);
        setDisplayDispatchStocks(false);
        setDisplayStockInventory(true);
        setDisplayReceiveStocks(false);
        break;
      case "Receive":
        //setLayoutVisibility?.(true);
        setDisplayAlertCards(false);

        setStockMovement(movement);
        setDisplayDispatchStocks(false);
        setDisplayStockInventory(false);
        setDisplayReceiveStocks(true);
        break;
      default:
        // setLayoutVisibility?.(false);
        setDisplayAlertCards(true);

        setDisplayDispatchStocks(false);
        setDisplayStockInventory(false);
        setDisplayReceiveStocks(false);
        break;
    }
  }

  const [open, setOpen] = useState(false);

  const [errorDialogTitle, setErrorDialogTitle] = useState("");
  const [errorDialogMessage, setErrorDialogMessage] = useState("");

  function showEmptyListError() {
    setErrorDialogTitle("No Items to Submit");
    setErrorDialogMessage("Must have an item.");
    setOpen(true);
  }

  function showInvalidQuantityError(message: string) {
    setErrorDialogTitle("Invalid Quantity");
    setErrorDialogMessage(message);
    setOpen(true);
  }
  return (
    <>
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {errorDialogTitle}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
              {errorDialogMessage}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ width: "100%" }}>
            <Button onClick={() => {
              setOpen(false)
            }}>
              Okay
            </Button>
            </DialogActions>
        </Dialog>

        {role === 'Manager' && displayAlertCards && <AlertCards />}
        {role === 'Manager' && <StockMovementPage
          display={displayReceiveStocks}
          submitLabel='Receive'
          data={receiveStocks}
          setData={setReceiveStocks}
          onSubmit={() => onSubmit("Receive")}
          onReturn={onReturn}
          onEmptyList={showEmptyListError}
          onInvalidQuantity={showInvalidQuantityError} />}
          
        <StockMovementPage
          display={displayStockInventory}
          submitLabel='Confirm Inventory'
          data={stockInventory}
          setData={setStockInventory}
          onSubmit={() => onSubmit("Inventory")}
          onReturn={onReturn}
          onEmptyList={showEmptyListError}
          onInvalidQuantity={showInvalidQuantityError} />

        {role === 'Manager' &&<StockMovementPage
          display={displayDispatchStocks}
          submitLabel='Dispatch'
          data={dispatchStocks}
          setData={setDispatchStocks}
          onSubmit={() => onSubmit("Dispatch")}
          onReturn={onReturn}
          onEmptyList={showEmptyListError}
          onInvalidQuantity={showInvalidQuantityError} />}

        <Box sx={{ 
        display: 'flex', 
        flexDirection: useMediaQuery('(orientation: portrait)')? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: 'center', 
      }}>

    {stockMovement === 'None' &&
        <Stack spacing={'20px'} sx={{marginTop: '10px'}}>
          {role === 'Manager' && <Button variant="contained"
            onClick={() => {togglePage("Receive");}}>
            <Receive style={buttonIcon} />
            <Typography
              sx={buttonText}>Receive Stocks
            </Typography>
          </Button>}

          {role === 'Manager' && <Button variant="contained"
            onClick={() => togglePage("Dispatch")}>
            <Dispatch style={buttonIcon} />
            <Typography
              sx={buttonText}>Dispatch Stocks
            </Typography>
          </Button>}

          <Button variant="contained"
            onClick={() => togglePage("Inventory")}>
            <Inventory style={buttonIcon} />
            <Typography
              sx={buttonText}>Inventory
            </Typography>
          </Button>
        </Stack>
      }

      </Box>
    </>
  );
};