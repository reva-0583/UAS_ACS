import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, AppBar, Toolbar, Typography, IconButton,
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, MenuItem
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home, Folder, Note, Group, Logout, Visibility, Edit, Delete
} from '@mui/icons-material';
import Swal from 'sweetalert2';

const drawerWidth = 240;

export default function NotePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [editForm, setEditForm] = useState({
    id_catatan: '',
    id_folder: '',
    judul: '',
    catatan: '',
    akses: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const data = await window.api.getAllNotes();
      setNotes(data);
    } catch (error) {
      console.error('Gagal fetch notes:', error);
    }
  };

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleEditClick = (note) => {
    setEditingNote(note.id_catatan);
    setEditForm({ ...note });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      const result = await window.api.editNote(editForm);
      if (result.success) {
        await Swal.fire('Berhasil', 'Catatan berhasil diupdate.', 'success');
        setEditingNote(null);
        setEditForm({ id_catatan: '', id_folder: '', judul: '', catatan: '', akses: '' });
        fetchNotes();
      } else {
        Swal.fire('Gagal', result.error || 'Gagal update catatan.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Terjadi error saat update catatan.', 'error');
    }
  };

  const handleDelete = async (id_catatan) => {
    const confirmDelete = await Swal.fire({
      title: `Yakin ingin menghapus catatan dengan ID ${id_catatan}?`,
      text: 'Aksi ini tidak bisa dibatalkan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    if (confirmDelete.isConfirmed) {
      try {
        const result = await window.api.removeNote(id_catatan);
        if (result.success) {
          await Swal.fire('Terhapus!', 'Catatan berhasil dihapus.', 'success');
          fetchNotes();
        } else {
          Swal.fire('Gagal', result.error || 'Gagal menghapus catatan.', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Terjadi error saat menghapus catatan.', 'error');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setEditForm({ id_catatan: '', id_folder: '', judul: '', catatan: '', akses: '' });
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {[{ text: 'Home', icon: <Home />, path: '/admin' },
        { text: 'Folder', icon: <Folder />, path: '/folders' },
        { text: 'Notes', icon: <Note />, path: '/notes' },
        { text: 'Group Folders', icon: <Group />, path: '/admin-grup' },
        { text: 'Group Notes', icon: <Group />, path: '/admin-grup-note' },
        { text: 'Logout', icon: <Logout />, path: '/' },
        ].map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Note Management
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Typography variant="h5" gutterBottom>
          Data Catatan
        </Typography>

        {notes.length === 0 ? (
          <Typography variant="body1">Belum ada catatan tersedia.</Typography>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>No</TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell>ID Folder</TableCell>
                    <TableCell>Judul</TableCell>
                    <TableCell>Catatan</TableCell>
                    <TableCell>Akses</TableCell>
                    <TableCell>Tanggal</TableCell>
                    <TableCell>Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {notes.map((note, index) => (
                    <TableRow key={note.id_catatan}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{note.id_catatan}</TableCell>
                      <TableCell>{note.id_folder}</TableCell>
                      <TableCell>{note.judul}</TableCell>
                      <TableCell>{note.catatan}</TableCell>
                      <TableCell>{note.akses}</TableCell>
                      <TableCell>{new Date(note.tanggal_ditambahkan).toLocaleString()}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEditClick(note)}><Edit /></IconButton>
                        <IconButton onClick={() => navigate('/note-detail', { state: note })}><Visibility /></IconButton>
                        <IconButton color="error" onClick={() => handleDelete(note.id_catatan)}><Delete /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {editingNote && (
              <Box mt={4} component={Paper} p={3}>
                <Typography variant="h6" gutterBottom>Edit Catatan</Typography>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Judul"
                  name="judul"
                  value={editForm.judul}
                  onChange={handleInputChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Catatan"
                  name="catatan"
                  multiline
                  rows={4}
                  value={editForm.catatan}
                  onChange={handleInputChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Akses"
                  name="akses"
                  select
                  value={editForm.akses}
                  onChange={handleInputChange}
                >
                  <MenuItem value="public">Public</MenuItem>
                  <MenuItem value="private">Private</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  margin="normal"
                  label="ID Folder"
                  name="id_folder"
                  value={editForm.id_folder}
                  InputProps={{ readOnly: true }}
                />
                <Box mt={2}>
                  <Button variant="contained" onClick={handleSaveEdit} sx={{ mr: 2 }}>Save</Button>
                  <Button variant="outlined" onClick={handleCancelEdit}>Cancel</Button>
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
