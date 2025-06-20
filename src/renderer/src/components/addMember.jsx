import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
  CssBaseline,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import Swal from 'sweetalert2';
export default function AddMember() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('username');
  useEffect(() => {
    fetchGroupList();
  }, []);
  async function fetchGroupList() {
    try {
      const result = await window.api.getGroupFoldersByUser(currentUser);
      setGroups(result);
    } catch (err) {
      console.error('Gagal ambil grup:', err);
    }
  }
  async function handleSubmit() {
    if (!usernameInput.trim() || !selectedGroup) {
      Swal.fire('Peringatan', 'Semua field harus diisi.', 'warning');
      return;
    }
    try {
      const userCheck = await window.api.checkUsername(usernameInput);
      if (!userCheck.exists) {
        Swal.fire('Gagal', 'Username tidak ditemukan.', 'error');
        return;
      }
      const result = await window.api.addMemberToGroup({
        id_group_folder: selectedGroup,
        username: usernameInput
      });
      if (result.success) {
        await Swal.fire('Berhasil', 'Member berhasil ditambahkan ke grup!', 'success');
        setUsernameInput('');
      } else {
        Swal.fire('Gagal', 'Gagal menambahkan member: ' + result.error, 'error');
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Terjadi kesalahan.', 'error');
    }
  }
  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography component="h1" variant="h5" fontWeight="bold" gutterBottom>
          Tambah Member ke Grup
        </Typography>
        <FormControl fullWidth sx={{ my: 2 }}>
          <InputLabel id="select-group-label">Pilih Grup</InputLabel>
          <Select
            labelId="select-group-label"
            value={selectedGroup}
            label="Pilih Grup"
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            {groups.map((group) => (
              <MenuItem key={group.id_group_folder} value={group.id_group_folder}>
                {group.judul}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Username Member"
          variant="outlined"
          autoComplete="off"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          sx={{ my: 2 }}
        />
        <Box display="flex" gap={2}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant="outlined" onClick={() => navigate('/grup')}>
            Back
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}