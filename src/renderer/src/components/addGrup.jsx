import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  CssBaseline
} from '@mui/material';

export default function AddGrup() {
  const [judul, setJudul] = useState('');
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleSubmit = async () => {
    if (!judul.trim()) {
      alert('Judul grup tidak boleh kosong');
      return;
    }

    try {
      const result = await window.api.addGroupFolder({ judul, username });
      if (result.success) {
        alert('Grup folder berhasil dibuat!');
        navigate('/grup');
      } else {
        alert('Gagal membuat grup folder.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan.');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography component="h1" variant="h5" fontWeight="bold" gutterBottom>
          Buat Grup Folder Baru
        </Typography>

        <TextField
          fullWidth
          label="Judul Grup"
          variant="outlined"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          sx={{ my: 2 }}
        />

        <Box display="flex" gap={2}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant="outlined" onClick={() => navigate('/grup')}>
            Back
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
