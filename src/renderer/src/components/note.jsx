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
  Home, Notes, Logout, Visibility, Edit, Delete
} from '@mui/icons-material';

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
        alert('Catatan berhasil diupdate.');
        setEditingNote(null);
        setEditForm({ id_catatan: '', id_folder: '', judul: '', catatan: '', akses: '' });
        fetchNotes();
      } else {
        alert('Gagal update catatan: ' + result.error);
      }
    } catch (error) {
      alert('Terjadi error saat update catatan.');
    }
  };

  const handleDelete = async (id_catatan) => {
    const confirmDelete = window.confirm(`Yakin ingin menghapus catatan dengan ID ${id_catatan}?`);
    if (confirmDelete) {
      try {
        const result = await window.api.removeNote(id_catatan);
        if (result.success) {
          alert('Catatan berhasil dihapus.');
          fetchNotes();
        } else {
          alert('Gagal menghapus catatan: ' + result.error);
        }
      } catch (error) {
        alert('Terjadi error saat menghapus catatan.');
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
        { text: 'Notes', icon: <Notes />, path: '/notes' },
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
