import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
    if (!confirm('Apakah Anda yakin ingin menghapus note ini?')) return;
    const result = await window.api.deleteNote(id_catatan);
    if (result.success) {
      const updated = notes.filter((n) => n.id_catatan !== id_catatan);
      setNotes(updated);
    } else {
      alert('Gagal hapus note.');
    }
  };
  return (
    <div style={{ display: 'flex' }}>
      <nav style={{width: '200px', padding: '20px', borderRight: '1px solid #ddd',}}>
        <h4>Public Notes</h4>
        <ul style={{ listStyle: 'none', padding: 0 }}></ul>
        <h4>My Notes</h4>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><Link to="/view-folder">Folder Pribadi</Link></li>
        </ul>
      </nav>
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',}}>
          <h1>My Notes in Folder {id_folder}</h1>
          <div>
            <button onClick={() => navigate('/dashboard')}>Home</button>
            <button onClick={() => navigate('/view-folder')}>Manage Group</button>
            <button onClick={() => navigate('/addFolder')}>Add Folder</button>
          </div>
        </header>
        <button onClick={() => navigate('/add', { state: { id_folder } })} style={{ marginBottom: '10px' }}>Add Note</button>
        {notes.length === 0 ? (
          <p>Folder kosong.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{border: '1px solid #ccc', padding: '8px', textAlign: 'center',}}>No</th>
                <th style={{border: '1px solid #ccc', padding: '8px', textAlign: 'left',}}>Judul Note</th>
                <th style={{border: '1px solid #ccc', padding: '8px', textAlign: 'center',}}>Tanggal Ditambahkan</th>
                <th style={{border: '1px solid #ccc', padding: '8px', textAlign: 'center',}}>Access</th>
                <th style={{border: '1px solid #ccc', padding: '8px', textAlign: 'center',}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((note, idx) => (
                <tr key={note.id_catatan}>
                  <td style={{border: '1px solid #ccc', padding: '8px', textAlign: 'center', }}>{idx + 1}</td>
                  <td style={{border: '1px solid #ccc', padding: '8px', textAlign: 'left',}}>{note.judul}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center',}}>{new Date(note.tanggal_ditambahkan).toLocaleDateString()}</td>
                  <td style={{border: '1px solid #ccc', padding: '8px', textAlign: 'center',}}>{note.akses}</td>
                  <td style={{border: '1px solid #ccc', padding: '8px', textAlign: 'center',}}>
                    <button style={{ marginRight: '5px', padding: '4px 8px', cursor: 'pointer' }} onClick={() => navigate(`/detail/${note.judul}`)}>View Detail</button>
                    <button style={{ padding: '4px 8px', cursor: 'pointer' }} onClick={() => handleDelete(note.id_catatan)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}