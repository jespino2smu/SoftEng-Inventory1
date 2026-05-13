import { useEffect, useState } from 'react';
import { 
  Box, Typography, TextField, InputAdornment, Button,
  Dialog, DialogTitle, DialogContent, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Container, Alert, AlertTitle,
  Stack,
  DialogActions,
  DialogContentText
} from '@mui/material';
import { Search as SearchIcon, Close as CloseIcon, AssignmentAdd, AddBox } from '@mui/icons-material';
import { StockActivityTable } from '../components/StockActivityTable';

import api from '../api/api';
import IncrementField from '../components/IncrementField';

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

  const [productState, setProductState] = useState<'add' | 'edit'>('add');
  
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

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [dialogTitle, setDialogTitle] = useState<string>("");
  const [dialogContent, setDialogContent] = useState<string>("");

  const [openProductDialog, setOpenProductDialog] = useState<boolean>(false);

  const emptyProduct = {
    productName: '',
    moderateThreshold: '',
    criticalThreshold: ''
  }
  const [newProduct, setNewProduct] = useState<any>(emptyProduct);

  function displayDialog(title: string, content: string) {
    setDialogTitle(title);
    setDialogContent(content);
    setOpenDialog(true);
  }

  function handleNewProduct(e: { target: { name: any; value: any; }; }) {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    })
  }

  async function submitNewProduct() {
    try {
      if (await validateNewProduct() === false) {
        return;
      }

      const response = await api.post('/stocks/add-product',
      {
        productName: newProduct.productName,
        moderateThreshold: newProduct.moderateThreshold,
        criticalThreshold: newProduct.criticalThreshold
      });
      if (response.data.message === 'success') {
        setOpenProductDialog(false);
        setNewProduct(emptyProduct);
        getStockActivities();
        displayDialog("Product Added Successfully", "A new product was added");
      }
    } catch(error: any) {
      console.error(error);
    }
  }

  async function validateNewProduct() {
    try {
      if (newProduct.productName.trim() === '') {
        displayDialog('Product Name is empty', "Provide a product name");
        return false;
      }

      const response = await api.post('/stocks/check-product-duplicate',
      {
        productName: newProduct.productName,
        moderateThreshold: newProduct.moderateThreshold,
        criticalThreshold: newProduct.criticalThreshold
      });

    } catch(error: any) {
      if (error.response?.data.message === 'productNameExists') {
        displayDialog("Product name already exists", "Choose another name.")
        return false;
      }
    }
    
    if (newProduct.moderateThreshold.trim() === '') {
      displayDialog('Moderate Low Stock is empty', "Specify a number");
    } else if (isNaN(Number(newProduct.moderateThreshold))) {
      displayDialog('Moderate Low Stock must be a number', "Specify a number");
    } else if (Number(newProduct.moderateThreshold) <= 0) {
      displayDialog('Moderate Low Stock must be positive', "Number must be 1 or greater");

    } else if (newProduct.criticalThreshold.trim() === '') {
      displayDialog('Critical Low Stock is empty', "Specify a number");
    } else if (isNaN(Number(newProduct.criticalThreshold))) {
      displayDialog('Critical Low Stock must be a number', "Specify a number");
    } else if (Number(newProduct.criticalThreshold) <= 0) {
      displayDialog('Critical Low Stock must be positive', "Number must be 1 or greater");
    } else if (Number(newProduct.criticalThreshold) >= Number(newProduct.moderateThreshold)) {
      displayDialog('Critical Threshold Exceeded', "Critical Threshold must be a lower value than Moderate Threshold");
    } else {
      return true;
    }

    return false;
  }

  const [productId, setProductId] = useState<Number | null>(null);

  function handleEditProduct(product: any) {
    setNewProduct({
      productName: product.ProductName,
      moderateThreshold: product.ModerateDepletionThreshold,
      criticalThreshold: product.CriticalDepletionThreshold,
    });
    setProductId(product.ProductId);
    setOpenProductDialog(true);
  }

  async function deleteProduct() {
    try {
      const response = await api.post('/stocks/delete-product',
      {
        productId: productId,
      });
      
      getStockActivities();
      setOpenProductDialog(false);
      setNewProduct(emptyProduct)
      displayDialog("Product Deleted Succesfully", "The product has been deleted.");
    } catch (error: any) {

    }
  }

  async function updateProduct() {
    try {
      const response = await api.post('/stocks/update-product',
      {
        productId: productId,
        productName: newProduct.productName,
        moderateThreshold: newProduct.moderateThreshold,
        criticalThreshold: newProduct.criticalThreshold
      });
      
      getStockActivities();
      setOpenProductDialog(false);
      setNewProduct(emptyProduct)
      displayDialog("Product Updated Succesfully", "The product has been updated.");
    } catch (error: any) {

    }
  }

  return (
    <>
      <Dialog
        open={openProductDialog}
        onClose={() => setOpenProductDialog(false)}
        fullWidth
        slotProps={{
          paper: {
            sx: {
              width: '600px',
              maxWidth: '90vw',
              borderRadius: 2,
            },
          },
        }}
        >
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2}}>

            <TextField
              fullWidth
              label="Product Name"
              name="productName"
              margin="normal"
              value={newProduct.productName}
              onChange={handleNewProduct}
              // error={!!errors.firstName}
              // helperText={errors.firstName}
            />
            
            <TextField
              fullWidth
              label="Low Stock Threshold (Moderate)"
              name="moderateThreshold"
              margin="normal"
              value={newProduct.moderateThreshold}
              onChange={handleNewProduct}
              // error={!!errors.firstName}
              // helperText={errors.firstName}
            />

            <TextField
              fullWidth
              label="Low Stock Threshold (Critical) "
              name="criticalThreshold"
              margin="normal"
              value={newProduct.criticalThreshold}
              onChange={handleNewProduct}
              // error={!!errors.firstName}
              // helperText={errors.firstName}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ width: "100%" }}>
          
          {productState === 'edit' && 
          <>
          <Button variant="contained"
            sx={{marginRight: 'auto', backgroundColor: '#d84141'}}
            onClick={deleteProduct}
          >
            Delete Product
          </Button>
          </>}




          {productState === 'add' && 
          <Button variant="contained"
            onClick={submitNewProduct}
          >
            Add Product
          </Button>}
          {productState === 'edit' && 
          <Button variant="contained"
            onClick={updateProduct}
          >
            Update Product
          </Button>}
          <Button
            variant="contained"
            onClick={() => setOpenProductDialog(false)}
            color="inherit"
            sx={{ marginLeft: "auto" }}
            onClickCapture={() => setNewProduct(emptyProduct)}>
            Cancel
          </Button>
      </DialogActions>
    </Dialog>
    
    <Dialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title" sx={{color: 'black'}}>{dialogTitle}</DialogTitle>

      <DialogContent>
        <DialogContentText id="dialog-description">{dialogContent}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpenDialog(false)} variant="contained" autoFocus>
          OK
        </Button>
      </DialogActions>
    </Dialog>


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
      
      <Stack direction="row" spacing={2} 
        sx={{
          width: '100%',
          height: '40px'
        }}>
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            setProductState('add');
            setOpenProductDialog(true);
          }}
          sx={{
            height: '36px',
            paddingLeft: '15px',
            paddingRight: '15px',
            margin: '0',
            marginRight: 'auto',
            flexShrink: 0,
            // width: isMobile? '30px' : 'fit-content'
          }}>
          <AddBox />
          Add Product
        </Button>
      </Stack>

    <TableContainer component={Paper} sx={{
      width: '100%',
      height: 'calc(80vh - 190px)',
      overflow: 'auto',
      }}>
      <Table aria-label="responsive table" stickyHeader >
        <TableHead sx={{ backgroundColor: '#f5f5f5', height: '5px',
          '& .MuiTableCell-root': {
            py: 0.5,
            lineHeight: 1.2,
          },
         }}>
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
                <TableRow key={index} hover
                  onClick={() => {
                    setProductState('edit');
                    handleEditProduct(product)
                  }}
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: product.Warning ? '#faacac' : product.Moderate? '#fff3cd' : 'inherit' }}>
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
    </>
  );
};