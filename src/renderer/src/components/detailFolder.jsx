import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
export default function DetailFolder() {
  const location = useLocation();
  const navigate = useNavigate();
  const folder = location.state;
  const [jumlahDetail, setJumlahDetail] = useState(0);
  useEffect(() => {
    if (folder) {
      fetchJumlahDetail(folder.id_folder);
    }
  }, [folder]);
  async function fetchJumlahDetail(id_folder) {
    try {
      const count = await window.api.getJumlahDetailByFolder(id_folder);
      setJumlahDetail(count);
    } catch (error) {
      console.error('Gagal fetch jumlah detail:', error);
    }
  }
  if (!folder) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Data folder tidak ditemukan.</h1>
        <button onClick={() => navigate(-1)}>Kembali</button>
      </div>
    );
  }
  return (
    <div style={{ padding: '20px' }}>
      <h1>Detail Folder</h1>
      <h1>ID Folder: {folder.id_folder}</h1>
      <h1>Judul: {folder.judul}</h1>
      <h1>Username: {folder.username}</h1>
      <h1>Folder ini memiliki {jumlahDetail} note</h1>
      <br />
      <button onClick={() => navigate(-1)} style={{ padding: '10px 20px' }}>Kembali</button>
    </div>
  );
}