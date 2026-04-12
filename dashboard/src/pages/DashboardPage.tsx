import { useState } from 'react';
import { 
  Box, Typography, Button,
  Stack, 
  useMediaQuery,
} from '@mui/material';
import {
  LocalShipping as Receive,
  ContentPaste as Inventory,
  ExitToApp as Dispatch
 } from '@mui/icons-material';

import api from '../api/api';

import StockMovementPage from './StockMovementPage';
import type {Product} from '../types/Product';

type Movement = "None" | "Receive" | "Dispatch" | "Inventory";

// interface DashboardPageType {
//    setLayoutVisibility?: React.Dispatch<React.SetStateAction<boolean>>;
// }
export const DashboardPage = () => {
  const [stockMovement, setStockMovement] = useState<Movement>("None");

  const [receiveStocks, setReceiveStocks] = useState<Product[]>([]);
  const [dispatchStocks, setDispatchStocks] = useState<Product[]>([]);
  const [stockInventory, setStockInventory] = useState<Product[]>([]);

  const [displayReceiveStocks, setDisplayReceiveStocks] = useState<boolean>(false);
  const [displayDispatchStocks, setDisplayDispatchStocks] = useState<boolean>(false);
  const [displayStockInventory, setDisplayStockInventory] = useState<boolean>(false);

  const buttonIcon = {fontSize: '40px', };

  const buttonText = {
    paddingLeft: '15px',
    marginRight: 'auto',
    fontSize: {
      lg: '24px',
      xs: '16px',
      sm: '18px'
  }};


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
    } else if (movement === "Inventory") {
      addActivity(movement, stockInventory);
      setDisplayStockInventory(false);
      setStockInventory([]);
    } else if (movement === "Receive") {
      addActivity(movement, receiveStocks);
      setDisplayReceiveStocks(false);
      setReceiveStocks([]);
    }
  }

  function onReturn() {
    // setLayoutVisibility?.(false);
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

        setStockMovement(movement);
        setDisplayDispatchStocks(true);
        setDisplayStockInventory(false);
        setDisplayReceiveStocks(false);
        break;
      case "Inventory":
        //setLayoutVisibility?.(true);

        setStockMovement(movement);
        setDisplayDispatchStocks(false);
        setDisplayStockInventory(true);
        setDisplayReceiveStocks(false);
        break;
      case "Receive":
        //setLayoutVisibility?.(true);

        setStockMovement(movement);
        setDisplayDispatchStocks(false);
        setDisplayStockInventory(false);
        setDisplayReceiveStocks(true);
        break;
      default:
        // setLayoutVisibility?.(false);

        setStockMovement(movement);
        setDisplayDispatchStocks(false);
        setDisplayStockInventory(false);
        setDisplayReceiveStocks(false);
        break;
    }
  }
  return (
    <>
        <StockMovementPage
          display={displayReceiveStocks}
          submitLabel='Receive'
          data={receiveStocks}
          setData={setReceiveStocks}
          onSubmit={() => onSubmit("Receive")}
          onReturn={onReturn} />
          
        <StockMovementPage
          display={displayStockInventory}
          submitLabel='Confirm Inventory'
          data={stockInventory}
          setData={setStockInventory}
          onSubmit={() => onSubmit("Inventory")}
          onReturn={onReturn} />

        <StockMovementPage
          display={displayDispatchStocks}
          submitLabel='Dispatch'
          data={dispatchStocks}
          setData={setDispatchStocks}
          onSubmit={() => onSubmit("Dispatch")}
          onReturn={onReturn} />

        <Box sx={{ 
        display: 'flex', 
        flexDirection: useMediaQuery('(orientation: portrait)')? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: 'center', 
      }}>

    {stockMovement === 'None' &&
        <Stack spacing={'20px'} sx={{marginTop: '10px'}}>
          <Button variant="contained"
            onClick={() => {togglePage("Receive");}}>
            <Receive style={buttonIcon} />
            <Typography
              sx={buttonText}>Receive Stocks
            </Typography>
          </Button>

          <Button variant="contained"
            onClick={() => togglePage("Dispatch")}>
            <Dispatch style={buttonIcon} />
            <Typography
              sx={buttonText}>Dispatch Stocks
            </Typography>
          </Button>

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