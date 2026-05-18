import React, { useEffect, useState } from 'react';
import { 
  Card, Grid,
  CardContent, CardActionArea,
  Typography, 
  Box, Stack,
  Divider,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';

// Icons
import DangerousIcon from '@mui/icons-material/Dangerous';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import BalanceIcon from '@mui/icons-material/Balance';
import HelpIcon from '@mui/icons-material/Help';
import api from '../api/api';

interface Issues {
    issuesDetected: boolean;
    invalidQuantity: number;
    outOfStock: number;
    criticalLowStock: number;
    moderateLowStock: number;
    quantityMismatch: number;
}

const AlertCards = () => {
  const navigate = useNavigate();
  const itemStyle = { display: 'flex', alignItems: 'center', gap: 0.5 };

  const [alerts, setAlerts] = useState<Issues | null>(null);

  useEffect(() => {
    getStockActivities();
  }, []);
  
  async function getStockActivities() {
      const result: any = await api.post('/stocks/list-products');
      //setProducts(result.data.products);
      setAlerts({
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
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        width: '100%',
        p: { xs: 0.5, sm: 2 },
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ flexShrink: 1, overflowY: 'auto', mb: 1 }}>
        <Stack spacing={{ xs: 1, sm: 2 }}>
          
          <Card variant="outlined"><CardActionArea onClick={() => navigate('/products')}>
            <CardContent sx={{ p: { xs: 1, sm: 2 }, "&:last-child": { pb: { xs: 1, sm: 2 } } }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'block' }, mb: 1 }}>
                QUANTITY
              </Typography>
              <Divider sx={{ mb: 1, display: { xs: 'none', sm: 'block' } }} />
              
              <Grid container spacing={0.5}>
                <Grid size={{ xs: 6, sm: 'auto' }} sx={{ ...itemStyle, order: 1 }}>
                  <DangerousIcon color="error" sx={{ fontSize: { xs: 24, sm: 40 } }} />
                  <Box>
                    <Typography sx={{ fontWeight: 'bold', lineHeight: 1, fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>{alerts?.outOfStock || 0}</Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>Out of Stock</Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 6, sm: 'auto' }} sx={{ ...itemStyle, order: { xs: 2, sm: 3 } }}>
                  <WarningAmberIcon color="warning" sx={{ fontSize: { xs: 24, sm: 40 } }} />
                  <Box>
                    <Typography sx={{ fontWeight: 'bold', lineHeight: 1, fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>{alerts?.moderateLowStock || 0}</Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>Moderately Low</Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 6, sm: 'auto' }} sx={{ ...itemStyle, order: { xs: 3, sm: 2 } }}>
                  <ReportProblemIcon sx={{ color: '#d32f2f', fontSize: { xs: 24, sm: 40 } }} />
                  <Box>
                    <Typography sx={{ fontWeight: 'bold', lineHeight: 1, fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>{alerts?.criticalLowStock || 0}</Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>Critically Low</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent></CardActionArea>
          </Card>

          <Card variant="outlined"><CardActionArea onClick={() => navigate('/products')}>
            <CardContent sx={{ p: { xs: 1, sm: 2 }, "&:last-child": { pb: { xs: 1, sm: 2 } } }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'block' }, mb: 1 }}>
                DISCREPANCIES
              </Typography>
              <Divider sx={{ mb: 1, display: { xs: 'none', sm: 'block' } }} />
              
              <Grid container spacing={0.5}>
                <Grid size={{ xs: 6, sm: 'auto' }} sx={itemStyle}>
                  <BalanceIcon color="primary" sx={{ fontSize: { xs: 24, sm: 40 } }} />
                  <Box>
                    <Typography sx={{ fontWeight: 'bold', lineHeight: 1, fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>{alerts?.invalidQuantity || 0}</Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>Stock Imbalance</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 'auto' }} sx={itemStyle}>
                  <HelpIcon color="action" sx={{ fontSize: { xs: 24, sm: 40 } }} />
                  <Box>
                    <Typography sx={{ fontWeight: 'bold', lineHeight: 1, fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>{alerts?.quantityMismatch || 0}</Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>Quantity Mismatch</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent></CardActionArea>
          </Card>
        </Stack>
      </Box>

    </Box>
  );
};

export default AlertCards;