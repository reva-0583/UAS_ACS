import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, AppBar, Toolbar, Typography, IconButton,
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField
} from '@mui/material';
import {
  Menu as MenuIcon, Home, Folder, Note, Group, Logout, Visibility, Edit, Delete
} from '@mui/icons-material';
import Swal from 'sweetalert2'; // ✅ Tambahan

const drawerWidth = 240;

export default function AdminGrupNotePage() {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [editForm, setEditForm] = useState({
    id_group_note: '',
    id_group_folder: '',
    username: '',
    judul: '',
    catatan: '',
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      const data = await window.api.getAllGroupNotes();
      setNotes(data);
    } catch (error) {
      console.error('Gagal fetch group notes:', error);
    }
  }

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }

  function handleEditClick(note) {
    setEditingNote(note.id_group_note);
    setEditForm({ ...note });
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSaveEdit() {
    try {
      const result = await window.api.editGroupNote(editForm);
      if (result.success) {
        await Swal.fire('Berhasil', 'Catatan grup berhasil diupdate.', 'success');
        setEditingNote(null);
        fetchNotes();
      } else {
        Swal.fire('Gagal', result.error, 'error');
      }
    } catch {
      Swal.fire('Error', 'Terjadi error saat update.', 'error');
    }
  }

  async function handleDelete(id_group_note) {
    const result = await Swal.fire({
      title: `Yakin ingin menghapus catatan grup dengan ID ${id_group_note}?`,
      text: 'Tindakan ini tidak bisa dibatalkan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const result = await window.api.removeGroupNote(id_group_note);
        if (result.success) {
          await Swal.fire('Terhapus!', 'Catatan grup berhasil dihapus.', 'success');
          fetchNotes();
        } else {
          Swal.fire('Gagal', result.error, 'error');
        }
      } catch {
        Swal.fire('Error', 'Terjadi error saat menghapus.', 'error');
      }
    }
  }

  function handleCancelEdit() {
    setEditingNote(null);
    setEditForm({
      id_group_note: '',
      id_group_folder: '',
      username: '',
      judul: '',
      catatan: '',
    });
  }

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
            Admin Catatan Grup
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }}
      >
        {drawer}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <Typography variant="h5" gutterBottom>
          Data Catatan Grup
        </Typography>

        {notes.length === 0 ? (
          <Typography>Belum ada catatan grup tersedia.</Typography>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>No</TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell>ID Folder</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Judul</TableCell>
                    <TableCell>Catatan</TableCell>
                    <TableCell>Tanggal</TableCell>
                    <TableCell align="center">Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {notes.map((note, index) => (
                    <TableRow key={note.id_group_note}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{note.id_group_note}</TableCell>
                      <TableCell>{note.id_group_folder}</TableCell>
                      <TableCell>{note.username}</TableCell>
                      <TableCell>{note.judul}</TableCell>
                      <TableCell>{note.catatan}</TableCell>
                      <TableCell>{new Date(note.tanggal_ditambahkan).toLocaleString()}</TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => handleEditClick(note)}><Edit /></IconButton>
                        <IconButton onClick={() => navigate('/admin-group-note-detail', { state: note })}><Visibility /></IconButton>
                        <IconButton color="error" onClick={() => handleDelete(note.id_group_note)}><Delete /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {editingNote && (
              <Box mt={4} component={Paper} p={3}>
                <Typography variant="h6" gutterBottom>Edit Catatan Grup</Typography>
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
                  label="Username"
                  name="username"
                  value={editForm.username}
                  InputProps={{ readOnly: true }}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="ID Group Folder"
                  name="id_group_folder"
                  value={editForm.id_group_folder}
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