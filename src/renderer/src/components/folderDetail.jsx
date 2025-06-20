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
  Stack,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  CssBaseline
} from '@mui/material';
import Swal from 'sweetalert2';
const drawerWidth = 240;
export default function FolderDetail() {
  const { id_folder } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    async function fetchNotes() {
      if (!id_folder) return;
      const data = await window.api.getDetailsByFolder(Number(id_folder));
      setNotes(data);
    }
    fetchNotes();
  }, [id_folder]);
  const handleDelete = async (id_catatan) => {
    const confirmed = await Swal.fire({
      title: 'Yakin ingin menghapus note ini?',
      text: 'Tindakan ini tidak bisa dibatalkan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal'
    });
    if (!confirmed.isConfirmed) return;
    const result = await window.api.deleteNote(id_catatan);
    if (result.success) {
      const updated = notes.filter((n) => n.id_catatan !== id_catatan);
      setNotes(updated);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil dihapus',
        timer: 1500,
        showConfirmButton: false
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Gagal hapus note.',
        confirmButtonText: 'OK'
      });
    }
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
            backgroundColor: '#f8f8f8'
          }
        }}
      >
        <Toolbar />
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">My Notes</Typography>
          <List>
            <ListItem button component={Link} to="/view-folder">
              <ListItemText primary="Folder Pribadi" />
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
              <Button onClick={() => navigate('/view-folder')}>Manage Folder</Button>
              <Button onClick={() => navigate('/addFolder')}>Add Folder</Button>
            </Stack>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Container>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5" fontWeight="bold">
              My Notes in Folder {id_folder}
            </Typography>
            <Button variant="contained" onClick={() => navigate('/add', { state: { id_folder } })}>
              Add Note
            </Button>
          </Stack>
          {notes.length === 0 ? (
            <Typography>Folder kosong.</Typography>
          ) : (
            <TableContainer component={Paper} elevation={2}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">No</TableCell>
                    <TableCell>Judul Note</TableCell>
                    <TableCell align="center">Tanggal Ditambahkan</TableCell>
                    <TableCell align="center">Access</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {notes.map((note, idx) => (
                    <TableRow key={note.id_catatan}>
                      <TableCell align="center">{idx + 1}</TableCell>
                      <TableCell>{note.judul}</TableCell>
                      <TableCell align="center">
                        {new Date(note.tanggal_ditambahkan).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">{note.akses}</TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => navigate(`/detail/${note.judul}`)}
                          >
                            View
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            color="error"
                            onClick={() => handleDelete(note.id_catatan)}
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