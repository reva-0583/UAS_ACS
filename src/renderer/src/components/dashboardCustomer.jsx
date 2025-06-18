import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CssBaseline,
  Container,
  Divider,
} from '@mui/material';

const drawerWidth = 240;

const DashboardCustomer = () => {
  const [notes, setNotes] = useState([]);
  const [titles, setTitles] = useState([]);
  const navigate = useNavigate(); // ✅ Fix: tambahkan useNavigate

  useEffect(() => {
    window.api.getPublicNotes().then(setNotes);
    window.api.getPublicTitles().then(setTitles);
  }, []);

  const previewText = (text) => {
    let result = '';
    let count = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (/[a-zA-Z0-9]/.test(char)) count++;
      result += char;
      if (count >= 12) {
        result += '...';
        break;
      }
    }
    return result;
  };

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
            Public Notes
          </Typography>
          <List>
            {titles.map((note, i) => (
              <ListItem
                button
                key={i}
                onClick={() => navigate(`/detail/${encodeURIComponent(note.judul)}`)}
              >
                <ListItemText primary={note.judul} />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            My Notes
          </Typography>
          <List>
            <ListItem button onClick={() => navigate('/view-folder')}>
              <ListItemText primary="Folder Pribadi" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Catatan Kuliah" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Proyek Kerja" />
            </ListItem>
            <ListItem button>
              <ListItemText primary="Jurnal Harian" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Top App Bar */}
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
              <Button component={Link} to="/dashboard" variant="outlined" sx={{ mx: 1 }}>
                Home
              </Button>
              <Button component={Link} to="/grup" variant="outlined" sx={{ mx: 1 }}>
                My Group
              </Button>
              <Button component={Link} to="/view-folder" variant="outlined" sx={{ mx: 1 }}>
                My Folder
              </Button>
              <Button component={Link} to="/addFolder" variant="outlined" sx={{ mx: 1 }}>
                Add Folder
              </Button>
              <Button component={Link} to="/logout" variant="contained" color="error" sx={{ mx: 1 }}>
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Content Below App Bar */}
        <Toolbar />
        <Container>
          <Typography variant="h5" gutterBottom>
            Public Notes
          </Typography>
          <Grid container spacing={2}>
            {notes.map((note) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={note.id_catatan}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {note.judul}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {previewText(note.catatan)}
                    </Typography>
                    <Button
                      component={Link}
                      to={`/detail/${encodeURIComponent(note.judul)}`}
                      size="small"
                      sx={{ mt: 1 }}
                    >
                      View Detail
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default DashboardCustomer;
