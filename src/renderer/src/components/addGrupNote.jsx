import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CssBaseline
} from '@mui/material';

export default function AddGrupNote() {
  const navigate = useNavigate();
  const location = useLocation();
  const group = location.state;
  const [judul, setJudul] = useState('');
  const [catatan, setCatatan] = useState('');

  useEffect(() => {
    if (!group || !group.id_group_folder) {
      alert("Group folder tidak ditemukan");
      navigate('/grup');
    }
  }, [group, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!judul || !catatan) {
      alert('Judul dan Catatan tidak boleh kosong!');
      return;
    }

    const username = localStorage.getItem('username');
    if (!username) {
      alert('User belum login');
      return;
    }

    try {
      const result = await window.api.addGroupNote({
        id_group_folder: group.id_group_folder,
        judul,
        catatan,
        username
      });

      if (result.success) {
        const mentionedUsernames = catatan.match(/@(\w+)/g)?.map(m => m.substring(1)) || [];
        for (const username_mentioned of mentionedUsernames) {
          await window.api.addMention({
            id_group_note: result.id_group_note,
            username_mentioned
          });
        }

        alert('Catatan berhasil ditambahkan');
        navigate(`/grup-detail/${group.id_group_folder}`);
      } else {
        alert('Gagal menambahkan catatan: ' + result.error);
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi error saat menambahkan catatan');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Tambah Catatan Grup
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Judul"
            variant="outlined"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Catatan"
            variant="outlined"
            multiline
            rows={6}
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            sx={{ mb: 2 }}
            required
          />

          <Box display="flex" gap={2}>
            <Button type="submit" variant="contained" color="primary">
              Simpan Catatan
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(`/grup-detail/${group.id_group_folder}`)}
            >
              Kembali
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
