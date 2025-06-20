import React, { useState, useEffect } from 'react';
import { Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';
import "/src/assets/report.css";
function ReportPage({ transaction, onLogout, navigateBack }) {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const handlePrint = async () => {
    if (!window.api || !window.api.printReport) {
      console.error('API not available');
      return;
    }
    try {
      const result = await window.api.printReport();
      if (result?.success) {
        console.log('PDF saved:', result.path);
        alert(`PDF saved successfully at: ${result.path}`);
      } else {
        console.error('Failed to save PDF:', result?.error);
        alert('Failed to save PDF: ' + (result?.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Print error:', error);
      alert('Print error: ' + error.message);
    }
  };
  useEffect(() => {
    async function fetchDetails() {
      try {
        const dt = await window.api.getTransactionDetails(transaction.ht_id);
        setDetails(dt);
        setLoading(false);
      } catch (err) {
        console.error('Error loading details:', err);
        setError(err.message);
        setLoading(false);
      }
    }
    if (transaction) {
      fetchDetails();
    }
  }, [transaction]);
  if (!transaction) {return <Typography>Transaction not available</Typography>;}
  if (loading) {return <Typography>Loading details...</Typography>;}
  if (error) {return <Typography color="error">{error}</Typography>;}
  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Transaction Report - ID {transaction.ht_id}</Typography>
        <Box className="no-print">
          <Button className="no-print" onClick={navigateBack} sx={{ marginRight: 2 }}>Back</Button>
          <Button className="no-print" onClick={onLogout} variant="contained" color="error">Logout</Button>
        </Box>
      </Box>
      <Box className="printable-content">
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography>Date: {new Date(transaction.date).toLocaleDateString()}</Typography>
          <Typography>Customer: {transaction.customer_name}</Typography>
          <Typography>Total: Rp{transaction.total.toLocaleString()}</Typography>
        </Paper>
        <Typography variant="h6">Transaction Details</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Detail ID</TableCell>
                <TableCell>Item ID</TableCell>
                <TableCell>Item Name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {details.map(detail => (
                <TableRow key={detail.dt_id}>
                  <TableCell>{detail.dt_id}</TableCell>
                  <TableCell>{detail.item_id}</TableCell>
                  <TableCell>{detail.item_name}</TableCell>
                  <TableCell>{detail.quantity}</TableCell>
                  <TableCell>Rp{detail.subtotal.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ mt: 2 }} className="no-print">
      <Button variant="contained" color="primary" onClick={handlePrint} sx={{ mt: 2 }}>
          Save as PDF
        </Button>
      </Box>
    </Box>
  );
}
export default ReportPage;