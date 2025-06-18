import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
export default function AdminGrupDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const groupFolder = location.state;
  const [jumlahCatatan, setJumlahCatatan] = useState(0);
  useEffect(() => {
    if (groupFolder) {
      fetchJumlahCatatan(groupFolder.id_group_folder);
    }
  }, [groupFolder]);
  async function fetchJumlahCatatan(id_group_folder) {
    try {
      const allGroupNotes = await window.api.getAllGroupNotes();
      const filtered = allGroupNotes.filter(note => note.id_group_folder === id_group_folder);
      setJumlahCatatan(filtered.length);
    } catch (error) {
      console.error('Gagal fetch jumlah group note:', error);
    }
  }
  if (!groupFolder) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Data grup folder tidak ditemukan.</h1>
        <button onClick={() => navigate(-1)}>Kembali</button>
      </div>
    );
  }
  return (
    <div style={{ padding: '20px' }}>
      <h1>Detail Grup Folder</h1>
      <h1>ID Group Folder: {groupFolder.id_group_folder}</h1>
      <h1>Judul: {groupFolder.judul}</h1>
      <h1>Owner Username: {groupFolder.owner_username}</h1>
      <h1>Folder ini memiliki {jumlahCatatan} grup note</h1>
      <br />
      <button onClick={() => navigate(-1)} style={{ padding: '10px 20px' }}>Kembali</button>
    </div>
  );
}