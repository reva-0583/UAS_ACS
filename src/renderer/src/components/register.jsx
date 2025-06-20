import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import Swal from 'sweetalert2';

function Register() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [email, setEmail] = useState('');
  const [alamat, setAlamat] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (
      !username.trim() ||
      !name.trim() ||
      !password.trim() ||
      !tanggalLahir ||
      !email.trim() ||
      !alamat.trim()
    ) {
      Swal.fire('Peringatan', 'Semua field wajib diisi.', 'warning');
      return;
    }
    try {
      const result = await window.api.register({
        username,
        name,
        password,
        tanggal_lahir: tanggalLahir,
        email,
        alamat,
      });
      if (result.success) {
        await Swal.fire('Berhasil', 'Registrasi berhasil! Silakan login.', 'success');
        navigate('/');
      } else {
        Swal.fire('Gagal', result.message || 'Gagal registrasi.', 'error');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan saat registrasi.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={4} sx={{ p: 4, mt: 8, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        <Box component="form" onSubmit={handleRegister}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Nama Lengkap"
            variant="outlined"
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Tanggal Lahir"
            type="date"
            InputLabelProps={{ shrink: true }}
            margin="normal"
            value={tanggalLahir}
            onChange={(e) => setTanggalLahir(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Alamat"
            variant="outlined"
            multiline
            rows={3}
            margin="normal"
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
            required
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3, py: 1.5 }}
          >
            Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
export default Register;