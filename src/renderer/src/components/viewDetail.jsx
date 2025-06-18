import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
export default function ViewDetail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const judul = searchParams.get('judul');
  const [catatan, setCatatan] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (judul) {
      window.api.getNoteDetail(judul).then((result) => {
        if (result?.catatan) setCatatan(result.catatan);
        else alert("Catatan tidak ditemukan!");
      });
    }
  }, [judul]);

  const handleSave = async () => {
    await window.api.updateNote({ judul, catatan });
    setIsEditing(false);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', display: 'flex' }}>
      <nav style={{ width: '208px', backgroundColor: '#fbfbfb', padding: '20px', height: '100vh', borderRight: '2px solid rgba(128,128,128,0.3)' }}>
        <h4>Public Notes</h4>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><a href="?judul=Contoh 1" style={{ textDecoration: 'none', color: 'black' }}>Contoh 1</a></li>
        </ul>
        <h4>My Notes</h4>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><a href="#" style={{ textDecoration: 'none', color: 'black' }}>Folder Pribadi</a></li>
        </ul>
      </nav>
      <div style={{ flexGrow: 1, marginLeft: '250px' }}>
        <div style={{ position: 'fixed', top: 0, left: '250px', right: 0, padding: '10px', backgroundColor: '#f2f2f2', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', zIndex: 1000 }}>
          <h1>Catat-Catat</h1>
          <div>
            <button onClick={() => navigate('/dashboard')}>Home</button>
            <button onClick={() => navigate('/viewFolder')}>Manage Group</button>
            <button onClick={() => navigate('/addFolder')}>Add Folder</button>
          </div>
        </div>
        <main style={{ padding: '20px', marginTop: '60px' }}>
          <button onClick={() => navigate('/dashboard')}>Back</button><br /><br />
          <h2>Detail Catatan</h2>
          <button onClick={() => setIsEditing(true)}>Edit</button><br /><br />
          <div style={{ border: '1px solid #ddd', padding: '20px', background: 'white' }}>
            <h3>{judul}</h3>
            <textarea
              rows="10"
              style={{ width: '100%', fontSize: '16px' }}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              disabled={!isEditing}
            />
            <br /><br />
            {isEditing && <button onClick={handleSave}>Save</button>}
          </div>
        </main>
      </div>
    </div>
  );
}
