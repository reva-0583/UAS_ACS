import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';

const drawerWidth = 240;

export default function Detail() {
  const { judul } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [catatan, setCatatan] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [publicNotes, setPublicNotes] = useState([]);

  useEffect(() => {
    if (!judul) return;

    const loadData = async () => {
      try {
        const noteData = await window.api.getNoteDetail(judul);
        if (!noteData) {
          navigate('/dashboard');
          return;
        }
        setNote(noteData);
        setCatatan(noteData.catatan);
        const titles = await window.api.getPublicTitles();
        setPublicNotes(titles);
      } catch (err) {
        console.error('Gagal memuat data:', err);
      }
    };
    loadData();
  }, [judul, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await window.api.updateNote({ judul, catatan });
      setIsEditing(false);
      const updated = await window.api.getNoteDetail(judul);
      setNote(updated);
    } catch (err) {
      console.error('Gagal menyimpan:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Yakin ingin menghapus catatan ini?')) {
      try {
        await window.api.deleteNote(judul);
        navigate('/dashboard');
      } catch (err) {
        console.error('Gagal menghapus catatan:', err);
      }
    }
  };

  if (!note) return <div>Loading...</div>;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', backgroundColor: '#f8f8f8' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', p: 2 }}>
          <Typography variant="h6">Public Notes</Typography>
          <List>
            {publicNotes.map((note, i) => (
              <ListItem
                button
                key={i}
                onClick={() => navigate(`/detail/${note.judul}`)}
              >
                <ListItemText primary={note.judul} />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">My Notes</Typography>
          <List>
            <ListItem button onClick={() => navigate('/view-folder')}><ListItemText primary="Folder Pribadi" /></ListItem>
            <ListItem button><ListItemText primary="Catatan Kuliah" /></ListItem>
            <ListItem button><ListItemText primary="Proyek Kerja" /></ListItem>
            <ListItem button><ListItemText primary="Jurnal Harian" /></ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#f0f0f0', color: 'black' }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Catat-Catat</Typography>
            <Box>
              <Button variant="outlined" sx={{ mx: 1 }} onClick={() => navigate('/dashboard')}>Home</Button>
              <Button variant="outlined" sx={{ mx: 1 }} onClick={() => navigate('/grup')}>My Group</Button>
              <Button variant="outlined" sx={{ mx: 1 }} onClick={() => navigate('/view-folder')}>My Folder</Button>
              <Button variant="outlined" sx={{ mx: 1 }} onClick={() => navigate('/addFolder')}>Add Folder</Button>
              <Button variant="contained" color="error" sx={{ mx: 1 }} onClick={() => navigate('/logout')}>Logout</Button>
            </Box>
          </Toolbar>
        </AppBar>

        <Toolbar />
        <Container maxWidth="md">
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Button variant="outlined" onClick={() => navigate('/dashboard')}>Back</Button>
            <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
          </Box>

          <Typography variant="h4" gutterBottom>
            Detail Catatan
          </Typography>

          {!isEditing && (
            <Button variant="outlined" onClick={() => setIsEditing(true)}>Edit</Button>
          )}

          <Box component="form" onSubmit={handleSave} mt={2}>
            <Typography variant="h5" mb={2}>{note.judul}</Typography>
            <TextField
              multiline
              fullWidth
              minRows={10}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              disabled={!isEditing}
            />
            {isEditing && (
              <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                Save
              </Button>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
