import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
export default function NoteDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const note = location.state;
  if (!note) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Data catatan tidak tersedia</h1>
        <button onClick={() => navigate(-1)}>Kembali</button>
      </div>
    );
  }
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? '-' : date.toLocaleString();
    } catch {
      return '-';
    }
  };
  return (
    <div style={{ padding: '20px' }}>
      <h1>Detail Catatan</h1>
      <h1>ID Catatan: {note.id_catatan}</h1>
      <h1>ID Folder: {note.id_folder}</h1>
      <h1>Judul: {note.judul}</h1>
      <h1>Catatan: {note.catatan}</h1>
      <h1>Akses: {note.akses}</h1>
      <h1>Tanggal Ditambahkan: {formatDate(note.tanggal_ditambahkan)}</h1>
      <br />
      <button onClick={() => navigate(-1)} style={{ padding: '10px 20px' }}>Kembali</button>
    </div>
  );
}