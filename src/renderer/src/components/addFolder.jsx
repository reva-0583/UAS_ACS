import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Swal from 'sweetalert2';
export default function AddFolderPage() {
  const [judul, setJudul] = useState('');
  const [folders, setFolders] = useState([]);
  const username = 'admin';
  useEffect(() => {
    async function fetchFolders() {
      try {
        const data = await window.api.getFoldersByUsername(username);
        setFolders(data);
      } catch (error) {
        console.error('Error fetching folders:', error);
      }
    }
    fetchFolders();
  }, [username]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!judul.trim()) {
      Swal.fire('Peringatan', 'Judul folder tidak boleh kosong!', 'warning');
      return;
    }
    const existing = folders.find((folder) => folder.judul === judul.trim());
    if (existing) {
      Swal.fire('Peringatan', 'Folder dengan judul yang sama sudah ada.', 'warning');
      return;
    }
    try {
      const result = await window.api.addFolder(judul.trim(), username);
      if (result.success) {
        await Swal.fire('Berhasil', 'Folder berhasil ditambahkan!', 'success');
        const updatedFolders = await window.api.getFoldersByUsername(username);
        setFolders(updatedFolders);
        setJudul('');
      } else {
        Swal.fire('Gagal', 'Gagal menambahkan folder: ' + result.error, 'error');
      }
    } catch (error) {
      console.error('Error adding folder:', error);
      Swal.fire('Error', 'Terjadi kesalahan saat menambahkan folder.', 'error');
    }
  };
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => (window.location.href = '/dashboard')}
        >
          Back
        </Button>
      </Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Tambah Folder
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nama Folder"
          fullWidth
          variant="outlined"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          fullWidth
        >
          Buat Folder
        </Button>
      </form>
      <Typography variant="h6" sx={{ mt: 4 }}>
        Daftar Folder:
      </Typography>
      <Paper variant="outlined" sx={{ mt: 1, maxHeight: 300, overflow: 'auto' }}>
        <List>
          {folders.map((folder) => (
            <ListItem key={folder.judul}>
              <ListItemIcon>
                <FolderIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={folder.judul} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}