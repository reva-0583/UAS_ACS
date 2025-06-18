import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Box,
  CssBaseline
} from '@mui/material';

const GrupNoteDetail = () => {
  const { id_group_note, id_group_folder } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [catatan, setCatatan] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const result = await window.api.getGroupNoteDetail(parseInt(id_group_note));
        if (result) {
          setNote(result);
          setCatatan(result.catatan);
        } else {
          alert('Catatan tidak ditemukan');
          navigate(`/grup-detail/${id_group_folder}`);
        }
      } catch (err) {
        alert('Gagal memuat detail catatan');
        navigate(`/grup-detail/${id_group_folder}`);
      }
    };
    fetchNote();
  }, [id_group_note, id_group_folder, navigate]);

  const handleSave = async () => {
    try {
      await window.api.updateGroupNote({
        id_group_note: parseInt(id_group_note),
        catatan,
      });
      setIsEditing(false);
      const updatedNote = await window.api.getGroupNoteDetail(parseInt(id_group_note));
      setNote(updatedNote);
    } catch (error) {
      alert('Gagal menyimpan perubahan');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus catatan ini?')) {
      try {
        await window.api.deleteGroupNote(parseInt(id_group_note));
        navigate(`/grup-detail/${id_group_folder}`);
      } catch (err) {
        alert('Gagal menghapus catatan');
      }
    }
  };

  if (!note) return <Typography sx={{ p: 4 }}>Loading...</Typography>;

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Button variant="outlined" onClick={() => navigate(`/grup-detail/${id_group_folder}`)}>
            Back
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </Box>

        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {note.judul}
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={10}
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          disabled={!isEditing}
          sx={{ mb: 2 }}
        />

        <Box display="flex" gap={2}>
          {!isEditing ? (
            <Button variant="contained" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          ) : (
            <>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
              <Button variant="outlined" color="inherit" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default GrupNoteDetail;
