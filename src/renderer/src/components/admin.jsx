import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, CssBaseline, AppBar, Toolbar, Typography, IconButton,
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, Collapse
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home, Folder, Note, Group, Logout, Visibility, Edit, Delete
} from '@mui/icons-material';
import Swal from 'sweetalert2';
const drawerWidth = 240;
export default function AdminPageMUI() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    username: '', name: '', tanggal_lahir: '', email: '', alamat: '', oldUsername: ''
  });
  const navigate = useNavigate();
  const fetchUsers = async () => {
    const data = await window.api.getAllUsers();
    setUsers(data);
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleNavigate = (path) => {
    navigate(path);
    setMobileOpen(false); 
  };
  const handleDelete = async (username) => {
    const confirm = await Swal.fire({
      title: `Yakin ingin menghapus user ${username}?`,
      text: "Aksi ini tidak bisa dibatalkan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });
    if (confirm.isConfirmed) {
      const result = await window.api.deleteUser(username);
      if (result.success) {
        await Swal.fire('Terhapus!', 'User berhasil dihapus.', 'success');
        fetchUsers();
      } else {
        Swal.fire('Gagal', result.error || 'Gagal menghapus user.', 'error');
      }
    }
  };
  const handleEditClick = (user) => {
    setEditingUser(user.username);
    setEditForm({
      username: user.username,
      name: user.NAME,
      tanggal_lahir: user.tanggal_lahir || '',
      email: user.email || '',
      alamat: user.alamat || '',
      oldUsername: user.username
    });
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };
  const handleSaveEdit = async () => {
    const result = await window.api.updateUser(editForm);
    if (result.success) {
      await Swal.fire('Berhasil', 'User berhasil diupdate.', 'success');
      setEditingUser(null);
      setEditForm({ username: '', name: '', tanggal_lahir: '', email: '', alamat: '', oldUsername: '' });
      fetchUsers();
    } else {
      Swal.fire('Gagal', result.error || 'Gagal update user.', 'error');
    }
  };
  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({ username: '', name: '', tanggal_lahir: '', email: '', alamat: '', oldUsername: '' });
  };
  const formatDate = (date) => {
    const d = new Date(date);
    return isNaN(d.getTime()) ? '-' : d.toLocaleDateString();
  };
  const drawer = (
    <div>
      <Toolbar />
      <List>
        {[
          { text: 'Home', icon: <Home />, path: '/admin' },
          { text: 'Folder', icon: <Folder />, path: '/folders' },
          { text: 'Notes', icon: <Note />, path: '/notes' },
          { text: 'Group Folders', icon: <Group />, path: '/admin-grup' },
          { text: 'Group Notes', icon: <Group />, path: '/admin-grup-note' },
          { text: 'Logout', icon: <Logout />, path: '/' },
        ].map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => handleNavigate(item.path)}>
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
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <Typography variant="h5" gutterBottom>Data Seluruh Pengguna</Typography>

        {users.length === 0 ? (
          <Typography>Belum ada user terdaftar.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Nama</TableCell>
                  <TableCell>Tanggal Lahir</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Alamat</TableCell>
                  <TableCell>Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={user.username}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.NAME}</TableCell>
                    <TableCell>{formatDate(user.tanggal_lahir)}</TableCell>
                    <TableCell>{user.email || '-'}</TableCell>
                    <TableCell>{user.alamat || '-'}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditClick(user)}><Edit /></IconButton>
                      <IconButton onClick={() => navigate('/detail-user', { state: user })}><Visibility /></IconButton>
                      <IconButton onClick={() => handleDelete(user.username)} color="error"><Delete /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Collapse in={Boolean(editingUser)}>
          {editingUser && (
            <Box mt={4} p={2} component={Paper}>
              <Typography variant="h6" gutterBottom>Edit User</Typography>
              <TextField fullWidth margin="normal" label="Username" name="username" value={editForm.username} onChange={handleInputChange} />
              <TextField fullWidth margin="normal" label="Nama" name="name" value={editForm.name} onChange={handleInputChange} />
              <TextField fullWidth margin="normal" type="date" name="tanggal_lahir" value={editForm.tanggal_lahir} onChange={handleInputChange} InputLabelProps={{ shrink: true }} label="Tanggal Lahir" />
              <TextField fullWidth margin="normal" label="Email" name="email" value={editForm.email} onChange={handleInputChange} />
              <TextField fullWidth margin="normal" multiline rows={3} label="Alamat" name="alamat" value={editForm.alamat} onChange={handleInputChange} />
              <Box mt={2}>
                <Button variant="contained" onClick={handleSaveEdit} sx={{ mr: 2 }}>Save</Button>
                <Button variant="outlined" onClick={handleCancelEdit}>Cancel</Button>
              </Box>
            </Box>
          )}
        </Collapse>
      </Box>
    </Box>
  );
}
