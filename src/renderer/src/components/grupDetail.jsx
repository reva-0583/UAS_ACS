import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Badge,
  Stack,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
  Divider
} from '@mui/material';

const drawerWidth = 240;

export default function GrupDetail() {
  const { id_group_folder } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [mentionCounts, setMentionCounts] = useState([]);
  const username = localStorage.getItem('username') || '';

  useEffect(() => {
    async function fetchNotes() {
      if (!id_group_folder || !username) return;
      const [notesData, mentionData] = await Promise.all([
        window.api.getGroupNotes(Number(id_group_folder)),
        window.api.getMentionCountsByNote(username),
      ]);
      setNotes(notesData);
      setMentionCounts(mentionData);
    }
    fetchNotes();
  }, [id_group_folder, username]);

  const handleDelete = async (id_group_note) => {
    if (!window.confirm('Yakin ingin menghapus catatan ini?')) return;
    const result = await window.api.deleteGroupNote(id_group_note);
    if (result.success) {
      setNotes((prev) => prev.filter((n) => n.id_group_note !== id_group_note));
    } else {
      alert('Gagal hapus note.');
    }
  };

  const getMentionCount = (id_group_note) => {
    const found = mentionCounts.find((item) => item.id_group_note === id_group_note);
    return found ? found.jumlah : 0;
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

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
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">My Notes</Typography>
          <List>
            <ListItem button component={Link} to="/grup">
              <ListItemText primary="Grup Saya" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#f0f0f0', color: 'black' }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" noWrap>
              Catat-Catat
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button onClick={() => navigate('/dashboard')}>Home</Button>
              <Button onClick={() => navigate('/grup')}>Manage Group</Button>
              <Button onClick={() => navigate('/addGrup')}>Add Group</Button>
            </Stack>
          </Toolbar>
        </AppBar>

        <Toolbar />
        <Container>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5" fontWeight="bold">
              Group Notes in Folder {id_group_folder}
            </Typography>
            <Button variant="contained" onClick={() => navigate('/addGrupNote', { state: { id_group_folder } })}>
              Add Note
            </Button>
          </Stack>

          {notes.length === 0 ? (
            <Typography>Folder grup kosong.</Typography>
          ) : (
            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">No</TableCell>
                    <TableCell>Judul Note</TableCell>
                    <TableCell align="center">Tanggal</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {notes.map((note, idx) => (
                    <TableRow key={note.id_group_note}>
                      <TableCell align="center">{idx + 1}</TableCell>
                      <TableCell>
                        {note.judul}{' '}
                        {getMentionCount(note.id_group_note) > 0 && (
                          <Badge
                            badgeContent={getMentionCount(note.id_group_note)}
                            color="error"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {new Date(note.tanggal_ditambahkan).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => navigate(`/group-note-detail/${id_group_folder}/${note.id_group_note}`)}
                          >
                            View
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            color="error"
                            onClick={() => handleDelete(note.id_group_note)}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Container>
      </Box>
    </Box>
  );
}
