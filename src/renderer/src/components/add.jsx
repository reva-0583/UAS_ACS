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
import Swal from 'sweetalert2'; // ✅ Import SweetAlert2

export default function AddPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const folder = location.state;

  const [judul, setJudul] = useState('');
  const [catatan, setCatatan] = useState('');
  const [akses, setAkses] = useState('');

  useEffect(() => {
    if (!folder || !folder.id_folder) {
      Swal.fire({
        icon: 'error',
        title: 'Folder tidak ditemukan',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate('/dashboard');
      });
    }
  }, [folder, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!judul || !catatan || !akses) {
      Swal.fire({
        icon: 'warning',
        title: 'Judul, Catatan, dan Akses tidak boleh kosong!',
        confirmButtonText: 'OK'
      });
      return;
    }
    if (akses !== 'public' && akses !== 'private') {
      Swal.fire({
        icon: 'warning',
        title: 'Akses hanya boleh "public" atau "private"',
        confirmButtonText: 'OK'
      });
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
        Swal.fire({
          icon: 'success',
          title: 'Catatan berhasil ditambahkan',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate(`/folder-detail/${folder.id_folder}`);
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal menambahkan catatan',
          text: result.error,
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Terjadi error saat menambahkan catatan',
        confirmButtonText: 'OK'
      });
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