import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
export default function AddPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const folder = location.state;
  const [judul, setJudul] = useState('');
  const [catatan, setCatatan] = useState('');
  const [akses, setAkses] = useState('');
  useEffect(() => {
    if (!folder || !folder.id_folder) {
      alert("Folder tidak ditemukan");
      navigate('/dashboard');
    }
  }, [folder, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!judul || !catatan || !akses) {
      alert('Judul, Catatan, dan Akses tidak boleh kosong!');
      return;
    }
    if (akses !== 'public' && akses !== 'private') {
      alert('Akses hanya boleh "public" atau "private"');
      return;
    }
    try {
      const result = await window.api.addDetail({
        id_folder: folder.id_folder,
        judul,
        catatan,
        akses
      });
      if (result.success) {
        alert('Catatan berhasil ditambahkan');
        navigate(`/folder-detail/${folder.id_folder}`);
      } else {
        alert('Gagal menambahkan catatan: ' + result.error);
      }
    } catch (error) {
      alert('Terjadi error saat menambahkan catatan');
    }
  };
  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate(`/folder-detail/${folder.id_folder}`)}>Back</button>
      <h2>Tambah Catatan Baru</h2>
      <form onSubmit={handleSubmit}>
        <label>Judul:</label><br />
        <input type="text" value={judul} onChange={e => setJudul(e.target.value)} required /><br /><br />
        <label>Catatan:</label><br />
        <textarea rows="4" value={catatan} onChange={e => setCatatan(e.target.value)} required></textarea><br /><br />
        <label>Hak Akses:</label><br />
        <select value={akses} onChange={e => setAkses(e.target.value)} required>
          <option value="">Pilih Akses</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select><br /><br />
        <button type="submit">Simpan Catatan</button>
      </form>
    </div>
  );
}