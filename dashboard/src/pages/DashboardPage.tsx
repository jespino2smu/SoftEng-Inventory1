import { useState } from 'react';
import { 
  Box, Typography, Button, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, Stack, 
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  LocalShipping as Receive,
  ContentPaste as Inventory,
  ExitToApp as Dispatch
 } from '@mui/icons-material';

import { post } from '../components/api';

import StockMovementPage from './StockMovementPage';
import type {Product} from '../types/Product';

type Movement = "None" | "Receive" | "Dispatch" | "Inventory";


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

  function onSubmit() {
    if (stockMovement === "Dispatch") {
      addActivity(stockMovement, dispatchStocks);
    } else if (stockMovement === "Inventory") {
      addActivity(stockMovement, stockInventory);
    } else if (stockMovement === "Receive") {
      addActivity(stockMovement, receiveStocks);
    }
  }

  async function addActivity(movement: string, stocks: Product[]) {
      const result = await post('/stocks/add-activity', {
        movement: movement,
        stocks: stocks,
      });
  }

  function togglePage(movement: Movement) {
    switch (movement) {
      case "Dispatch":
        setStockMovement(movement);
        setDisplayDispatchStocks(true);
        setDisplayStockInventory(false);
        setDisplayReceiveStocks(false);
        break;
      case "Inventory":
        setStockMovement(movement);
        setDisplayDispatchStocks(false);
        setDisplayStockInventory(true);
        setDisplayReceiveStocks(false);
        break;
      case "Receive":
        setStockMovement(movement);
        setDisplayDispatchStocks(false);
        setDisplayStockInventory(false);
        setDisplayReceiveStocks(true);
        break;
      default:
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
          onSubmit={onSubmit} />
          
        <StockMovementPage
          display={displayStockInventory}
          submitLabel='Confirm Inventory'
          data={stockInventory}
          setData={setStockInventory}
          onSubmit={onSubmit} />

        <StockMovementPage
          display={displayDispatchStocks}
          submitLabel='Dispatch'
          data={dispatchStocks}
          setData={setDispatchStocks}
          onSubmit={onSubmit} />

        <Box sx={{ 
        display: 'flex', 
        flexDirection: useMediaQuery('(orientation: portrait)')? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: 'center', 
      }}>

    {stockMovement === 'None'&&
        <Stack spacing={'20px'} sx={{marginTop: '10px'}}>
          <Button variant="contained"
            onClick={() => togglePage("Receive")}>
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