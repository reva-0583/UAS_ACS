import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function DetailUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state;
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (user?.username) {
      fetch(`/api/user-notes/${user.username}`)
        .then(response => {
          if (!response.ok) throw new Error('Gagal mengambil catatan');
          return response.json();
        })
        .then(data => setNotes(data))
        .catch(err => console.error("Gagal fetch catatan:", err));
    }
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
      });
    } catch {
      return '-';
    }
  };

  if (!user) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Data tidak tersedia</h1>
        <button onClick={() => navigate(-1)}>Kembali</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h1>Detail Pengguna</h1>
      <table style={{ marginBottom: '30px' }}>
        <tbody>
          <tr><td><strong>Username</strong></td><td>: {user.username}</td></tr>
          <tr><td><strong>Nama</strong></td><td>: {user.NAME}</td></tr>
          <tr><td><strong>Tanggal Lahir</strong></td><td>: {formatDate(user.tanggal_lahir)}</td></tr>
          <tr><td><strong>Email</strong></td><td>: {user.email || '-'}</td></tr>
          <tr><td><strong>Alamat</strong></td><td>: {user.alamat || '-'}</td></tr>
        </tbody>
      </table>

      <h2>Catatan Milik {user.username}</h2>
      {notes.length === 0 ? (
        <p>Tidak ada catatan yang ditemukan.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th>No</th>
              <th>Judul</th>
              <th>Catatan</th>
              <th>Akses</th>
              <th>Tanggal Ditambahkan</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note, index) => (
              <tr key={note.id_catatan}>
                <td>{index + 1}</td>
                <td>{note.judul}</td>
                <td>{note.catatan}</td>
                <td>{note.akses}</td>
                <td>{formatDate(note.tanggal_ditambahkan)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <br />
      <button onClick={() => navigate(-1)} style={{ padding: '10px 20px', marginTop: '20px' }}>Kembali</button>
    </div>
  );
}
