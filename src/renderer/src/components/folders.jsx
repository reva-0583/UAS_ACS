import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, AppBar, Toolbar, Typography, IconButton,
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home, Folder, Logout, Visibility, Edit, Delete
} from '@mui/icons-material';

const drawerWidth = 240;

export default function FolderPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  const [editingFolder, setEditingFolder] = useState(null);
  const [editForm, setEditForm] = useState({ id_folder: '', judul: '', username: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const data = await window.api.getAllFolders();
      setFolders(data);
    } catch (error) {
      console.error('Gagal fetch folders:', error);
    }
  };

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleEditClick = (folder) => {
    setEditingFolder(folder.id_folder);
    setEditForm({ ...folder });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      const result = await window.api.updateFolder(editForm);
      if (result.success) {
        alert('Folder berhasil diupdate.');
        setEditingFolder(null);
        setEditForm({ id_folder: '', judul: '', username: '' });
        fetchFolders();
      } else {
        alert('Gagal update folder: ' + result.error);
      }
    } catch (error) {
      alert('Terjadi error saat update folder.');
    }
  };

  const handleDelete = async (id_folder) => {
    const confirmDelete = window.confirm(`Yakin ingin menghapus folder ID ${id_folder}?`);
    if (confirmDelete) {
      try {
        const result = await window.api.deleteFolder(id_folder);
        if (result.success) {
          alert('Folder berhasil dihapus.');
          fetchFolders();
        } else {
          alert('Gagal menghapus folder: ' + result.error);
        }
      } catch (error) {
        alert('Terjadi error saat menghapus folder.');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingFolder(null);
    setEditForm({ id_folder: '', judul: '', username: '' });
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {[{ text: 'Home', icon: <Home />, path: '/admin' },
        { text: 'Folder', icon: <Folder />, path: '/folders' },
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
            Folder Management
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
          Data Folder
        </Typography>

        {folders.length === 0 ? (
          <Typography variant="body1">Belum ada folder tersedia.</Typography>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>No</TableCell>
                    <TableCell>ID Folder</TableCell>
                    <TableCell>Judul</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {folders.map((folder, index) => (
                    <TableRow key={folder.id_folder}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{folder.id_folder}</TableCell>
                      <TableCell>{folder.judul}</TableCell>
                      <TableCell>{folder.username}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEditClick(folder)}><Edit /></IconButton>

                        <IconButton onClick={() => navigate('/detail-folder', { state: folder })}><Visibility /></IconButton>

                        <IconButton onClick={() => handleDelete(folder.id_folder)} color="error" ><Delete /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {editingFolder && (
              <Box mt={4} component={Paper} p={3}>
                <Typography variant="h6" gutterBottom>Edit Folder</Typography>
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
                  label="Username"
                  name="username"
                  value={editForm.username}
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
