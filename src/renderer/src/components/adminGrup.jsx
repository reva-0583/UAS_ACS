import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, AppBar, Toolbar, Typography, IconButton,
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField
} from '@mui/material';
import {
  Menu as MenuIcon, Home, Group, Logout, Edit, Visibility, Delete
} from '@mui/icons-material';

const drawerWidth = 240;

export default function AdminGrupPage() {
  const [groups, setGroups] = useState([]);
  const [editingGroup, setEditingGroup] = useState(null);
  const [editForm, setEditForm] = useState({ id_group_folder: '', judul: '', owner_username: '' });
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);

  async function fetchGroups() {
    try {
      const data = await window.api.getAllGroupFolders();
      setGroups(data);
    } catch (error) {
      console.error('Gagal fetch group folders:', error);
    }
  }

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }

  function handleEditClick(group) {
    setEditingGroup(group.id_group_folder);
    setEditForm({ ...group });
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSaveEdit() {
    try {
      const result = await window.api.updateGroupFolder(editForm);
      if (result.success) {
        alert('Group folder berhasil diupdate.');
        setEditingGroup(null);
        setEditForm({ id_group_folder: '', judul: '', owner_username: '' });
        fetchGroups();
      } else {
        alert('Gagal update group folder: ' + result.error);
      }
    } catch (error) {
      alert('Terjadi error saat update group folder.');
    }
  }

  async function handleDelete(id_group_folder) {
    const confirmDelete = window.confirm(`Yakin ingin menghapus grup folder dengan ID ${id_group_folder}?`);
    if (confirmDelete) {
      try {
        const result = await window.api.deleteGroupFolder(id_group_folder);
        if (result.success) {
          alert('Group folder berhasil dihapus.');
          fetchGroups();
        } else {
          alert('Gagal menghapus group folder: ' + result.error);
        }
      } catch (error) {
        alert('Terjadi error saat menghapus group folder.');
      }
    }
  }

  function handleCancelEdit() {
    setEditingGroup(null);
    setEditForm({ id_group_folder: '', judul: '', owner_username: '' });
  }

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {[{ text: 'Home', icon: <Home />, path: '/admin' },
        { text: 'Group Folder', icon: <Group />, path: '/admin-grup' },
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
            Admin Grup Folder
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
          Data Grup Folder
        </Typography>

        {groups.length === 0 ? (
          <Typography variant="body1">Belum ada grup folder tersedia.</Typography>
        ) : (
          <>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>No</TableCell>
                    <TableCell>ID Grup</TableCell>
                    <TableCell>Judul</TableCell>
                    <TableCell>Owner Username</TableCell>
                    <TableCell>Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groups.map((group, index) => (
                    <TableRow key={group.id_group_folder}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{group.id_group_folder}</TableCell>
                      <TableCell>{group.judul}</TableCell>
                      <TableCell>{group.owner_username}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleEditClick(group)}><Edit /></IconButton>
                        <IconButton onClick={() => navigate('/admin-grup-detail', { state: group })}><Visibility /></IconButton>
                        <IconButton color="error" onClick={() => handleDelete(group.id_group_folder)}><Delete /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {editingGroup && (
              <Box mt={4} component={Paper} p={3}>
                <Typography variant="h6" gutterBottom>Edit Grup Folder</Typography>
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
                  label="Owner Username"
                  name="owner_username"
                  value={editForm.owner_username}
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
