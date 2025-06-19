import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CssBaseline,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

export default function AddPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const folder = location.state;

  const [judul, setJudul] = useState('');
  const [catatan, setCatatan] = useState('');
  const [akses, setAkses] = useState('');

  useEffect(() => {
    if (!folder || !folder.id_folder) {
      alert("Folder tidak ditemukan");
      navigate('/dashboard');
    }
  }, [folder, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!judul || !catatan || !akses) {
      alert('Judul, Catatan, dan Akses tidak boleh kosong!');
      return;
    }
    if (akses !== 'public' && akses !== 'private') {
      alert('Akses hanya boleh "public" atau "private"');
      return;
    }

    try {
      const result = await window.api.addDetail({
        id_folder: folder.id_folder,
        judul,
        catatan,
        akses
      });
      if (result.success) {
        alert('Catatan berhasil ditambahkan');
        navigate(`/folder-detail/${folder.id_folder}`);
      } else {
        alert('Gagal menambahkan catatan: ' + result.error);
      }
    } catch (error) {
      alert('Terjadi error saat menambahkan catatan');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Button variant="outlined" onClick={() => navigate(`/folder-detail/${folder.id_folder}`)}>
            Back
          </Button>
        </Box>

        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Tambah Catatan Baru
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Judul"
            variant="outlined"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Catatan"
            variant="outlined"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="akses-label">Hak Akses</InputLabel>
            <Select
              labelId="akses-label"
              value={akses}
              label="Hak Akses"
              onChange={(e) => setAkses(e.target.value)}
              required
            >
              <MenuItem value=""><em>Pilih Akses</em></MenuItem>
              <MenuItem value="public">Public</MenuItem>
              <MenuItem value="private">Private</MenuItem>
            </Select>
          </FormControl>

          <Button type="submit" variant="contained" color="primary">
            Simpan Catatan
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
