import { useEffect, useState } from 'react';
import { 
  Box, Typography, TextField, InputAdornment, 
  Dialog, DialogTitle, DialogContent, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Container, Alert, AlertTitle
} from '@mui/material';
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
import { StockActivityTable } from '../components/StockActivityTable';

import api from '../api/api';

interface Issues {
    issuesDetected: boolean;
    invalidQuantity: number;
    outOfStock: number;
    criticalLowStock: number;
    moderateLowStock: number;
    quantityMismatch: number;
}

export const ProductListing = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [issues, setIssues] = useState<Issues | null>(null);
  
  useEffect(() => {
    getStockActivities();
  }, []);
  
  async function getStockActivities() {
      const result: any = await api.post('/stocks/list-products');
      setProducts(result.data.products);
      setIssues({
            issuesDetected: result.data.issuesDetected,
            invalidQuantity: result.data.invalidQuantity,
            outOfStock: result.data.outOfStock,
            criticalLowStock: result.data.criticalLowStock,
            moderateLowStock: result.data.moderateLowStock,
            quantityMismatch: result.data.quantityMismatch,
    })
      //setStockActivities(result.data);
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>Product Listing</Typography>
      <Container sx={{ m: '8px' }}>
      {issues?.issuesDetected && (
        <Alert severity="error">
          <AlertTitle sx={{textAlign: 'left'}}>Issue(s) Detected:</AlertTitle>
          <ul style={{ margin: 0, paddingLeft: '20px', textAlign: 'left' }}>
            {issues.invalidQuantity > 0 && <li>Invalid quantity ({issues.invalidQuantity} item/s)</li>}
            {issues.outOfStock > 0 && <li>Out of stock ({issues.outOfStock} item/s)</li>}
            {issues.criticalLowStock > 0 && <li>Critical low stock ({issues.criticalLowStock} item/s)</li>}
            {issues.moderateLowStock > 0 && <li>Moderate low stock ({issues.moderateLowStock} item/s)</li>}
            {issues.quantityMismatch > 0 && <li>Quantity mismatch ({issues.quantityMismatch} item/s)</li>}
          </ul>
        </Alert>
      )}
    </Container>

    <TableContainer component={Paper} sx={{
      width: '100%', overflowX: 'auto',
      }}>
      <Table aria-label="responsive table">
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            <TableCell align="center"><strong>Products</strong></TableCell>
            <TableCell align="center"><strong>Stock<br />In</strong></TableCell>
            <TableCell align="center"><strong>Stock<br />Out</strong></TableCell>
            <TableCell align="center"><strong>Stock<br />Balance</strong></TableCell>
            <TableCell align="center"><strong>Inventory</strong></TableCell>
            <TableCell align="center" colSpan={2}><strong>Depletion<br />Threshold</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            {products.map((product: any, index: number) => (
                <TableRow key={index} sx={{ backgroundColor: product.Warning ? '#faacac' : product.Moderate? '#fff3cd' : 'inherit' }}>
                    <TableCell align="left">{product.ProductName}</TableCell>
                    <TableCell align="center">{product.StockIn}</TableCell>
                    <TableCell align="center">{product.StockOut}</TableCell>
                    <TableCell align="center"
                        sx={{
                            color: product.StockImbalance || product.QuantityDiscrepancy ? '#880000' : 'inherit',
                            fontWeight: product.StockImbalance  || product.QuantityDiscrepancy  ? 'bold' : 'normal'
                        }}>
                        {product.StockBalance}
                    </TableCell>
                    <TableCell align="center"
                        sx={{
                            color: product.QuantityDiscrepancy ? '#880000' : 'inherit',
                            fontWeight: product.QuantityDiscrepancy ? 'bold' : 'normal'
                        }}>
                        {product.Inventory}
                    </TableCell>
                    <TableCell align="center">{product.ModerateDepletionThreshold}</TableCell>
                    <TableCell align="center">{product.CriticalDepletionThreshold}</TableCell>
                </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>

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