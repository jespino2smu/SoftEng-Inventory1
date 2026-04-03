import React from 'react';
import {
  Paper, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';

interface DataRow {
  id: number;
  name: string;
  quantity: number;
}

interface DataTableProps {
  rows: DataRow[];
}

export const DataTable: React.FC<DataTableProps> = ({ rows }) => {
  return (
    <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
      <Table aria-label="responsive table">
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            {/* Hide ID column on extra-small screens */}
            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
              <strong>ID</strong>
            </TableCell>
            <TableCell><strong>Name</strong></TableCell>
            <TableCell align="right"><strong>Qty</strong></TableCell>
            <TableCell align="center"><strong>Action</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                {row.id}
              </TableCell>
              <TableCell sx={{ fontWeight: { xs: 600, sm: 400 } }}>
                {row.name}
              </TableCell>
              <TableCell align="right">{row.quantity}</TableCell>
              <TableCell align="center">
                <Button 
                  variant="contained" 
                  size="small"
                  fullWidth // Makes clicking easier on touch screens
                  sx={{ maxWidth: '100px' }}
                >
                  Confirm
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};