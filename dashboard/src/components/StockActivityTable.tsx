import React from 'react';
import {
  Paper, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Box,
  Stack,
  List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';

interface DataRow {
  ActivityId: number;
  ActivityType: "Dispatch" | "Inventory" | "Receive";
  Date: any;
  Products: {
    ProductName: string;
  }[];
  Staff: any[];
}

interface DataTableProps {
  rows: DataRow[];
}

const renderProductNames = (rows: any) => {
  return (
    <>
      {
        rows.forEach((product: any) => {
          product.ProductName
        })
      }
    </>
  );
}

export const StockActivityTable: React.FC<DataTableProps> = ({ rows }) => {
  return (
    <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
      <Table aria-label="responsive table">
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            {/* Hide ID column on extra-small screens
            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
              <strong>ID</strong>
            </TableCell> */}
            <TableCell align="left"><strong>Products</strong></TableCell>
            <TableCell align="center"><strong>Staff</strong></TableCell>
            {/* Hide ID column on extra-small screens */ }
            <TableCell sx={{
                display: { xs: 'none', sm:'table-cell' } }}>
                <strong>Date</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.ActivityId} hover>
              <TableCell sx={{ verticalAlign: 'top',}}>


  {row.Products.map((product: any, index) => (
    <Box sx={{
        backgroundColor: 'red',
        width: 'fit-Content',
  display: 'grid',
  gridTemplateColumns: '1fr 24px 1fr',
  alignItems: 'start',
  columnGap: 1,
}}>
    <Box textAlign="right" sx={{width: '5px',}}>{product.Quantity}</Box>
    <Box textAlign="center" sx={{width: '8px',}}>&times;</Box>
    <Box  sx={{width: '120px',}}>{product.ProductName}</Box>
</Box>
  ))}




              </TableCell>
              
            <TableCell sx={{ verticalAlign: 'top' }}>
                
              <Stack direction={"row"}>
                <b>Activity: </b>
                <Box sx={{
                    textAlign: 'center',
                    marginLeft: '8px',
                    marginRight: 'auto',
                    width: '90px',
                    border: '1.5px solid',
                    borderRadius: '9px',
                    backgroundColor:
                        row.ActivityType === 'Dispatch' ?
                        '#f6d1c1' : 
                        row.ActivityType === 'Inventory' ?
                        '#BCF5FB' :
                        row.ActivityType === 'Receive' ?
                        '#d7f6c1' :

                        '#d7f6c1',

                    borderColor:
                        row.ActivityType === 'Dispatch' ?
                        '#e05f28' : 
                        row.ActivityType === 'Inventory' ?
                        '#0EDAF1' :
                        row.ActivityType === 'Receive' ?
                        '#70de21' :

                        '#70de21',
                    color:
                        row.ActivityType === 'Dispatch' ?
                        '#b7491a' : 
                        row.ActivityType === 'Inventory' ?
                        '#098C9A' :
                        row.ActivityType === 'Receive' ?
                        '#5d9832' :

                        '#5d9832',
                    
                  }}>
                  {row.ActivityType}
                </Box>
              </Stack>
            {row.Staff.map((staff: any, index) => (
                <div key={`${row.ActivityId}-${index}`}>
                {staff}
                </div>))}
            </TableCell>


            {/* Hide ID column on extra-small screens */ }
                <TableCell sx={{
                  display: { xs: 'none', sm:'table-cell' } }}>
                <small>{row.Date}</small>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};