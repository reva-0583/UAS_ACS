import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Container,
  Divider,
  Paper,
  CssBaseline,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';

const drawerWidth = 240;

export default function ViewFolder() {
  const [folders, setFolders] = useState([]);
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || '';

  useEffect(() => {
    if (!username) {
      navigate('/login');
    }
  }, [username, navigate]);

  useEffect(() => {
    if (username) {
      window.api
        .viewFolder(username)
        .then(setFolders)
        .catch((err) => {
          console.error('Gagal memuat folder:', err);
        });
    }
  }, [username]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#f8f8f8',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', p: 2 }}>
          <Typography variant="h6" gutterBottom>
            My Notes
          </Typography>
          <List>
            <ListItem disablePadding>
              <ListItemButton component={RouterLink} to="/view-folder">
                <ListItemText primary="Folder Pribadi" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="Catatan Kuliah" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="Proyek Kerja" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary="Jurnal Harian" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#f0f0f0',
          color: 'black',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap>
            Catat-Catat
          </Typography>
          <Box>
            <Button component={RouterLink} to="/dashboard" variant="outlined" sx={{ mx: 1 }}>
              Home
            </Button>
            <Button component={RouterLink} to="/grup" variant="outlined" sx={{ mx: 1 }}>
              My Group
            </Button>
            <Button component={RouterLink} to="/view-folder" variant="outlined" sx={{ mx: 1 }}>
              My Folder
            </Button>
            <Button component={RouterLink} to="/addFolder" variant="outlined" sx={{ mx: 1 }}>
              Add Folder
            </Button>
            <Button component={RouterLink} to="/logout" variant="contained" color="error" sx={{ mx: 1 }}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Folder Pribadi Anda
          </Typography>

          {folders.length > 0 ? (
            <Paper elevation={2} sx={{ mt: 2 }}>
              <List>
                {folders.map((folder) => (
                  <Box key={folder.id_folder}>
                    <ListItem disablePadding>
                      <ListItemButton
                        component={RouterLink}
                        to={`/folder-detail/${folder.id_folder}`}
                      >
                        <FolderIcon sx={{ mr: 2, color: 'primary.main' }} />
                        <ListItemText primary={folder.judul} />
                      </ListItemButton>
                    </ListItem>
                    <Divider />
                  </Box>
                ))}
              </List>
            </Paper>
          ) : (
            <Typography variant="body1" sx={{ mt: 2 }}>
              Anda belum membuat folder.
            </Typography>
          )}

          <Box mt={4} display="flex" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/addFolder')}
            >
              Add Folder
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => navigate('/dashboard')}
            >
              Back
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
