import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function DetailUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state;
  const [folderData, setFolderData] = useState([]);

  useEffect(() => {
    if (user?.username) {
      window.api.getFoldersByUsername(user.username)
        .then(async (folders) => {
          const fullData = await Promise.all(folders.map(async (folder) => {
            const details = await window.api.getDetailsByFolder(folder.id_folder);
            return { ...folder, details };
          }));
          setFolderData(fullData);
        })
        .catch((err) => console.error('Gagal mengambil data folder:', err));
    }
  }, [user]);

  async function printReport() {
    await window.api.printReport();
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime())
        ? '-'
        : date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
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
    <div className="report-container">
      <style>{`
        .report-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 30px;
          font-family: 'Segoe UI', Tahoma, sans-serif;
          background-color: #fff;
          color: #333;
        }

        .report-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .report-section {
          margin-bottom: 30px;
        }

        .folder-section {
          margin-bottom: 40px;
        }

        .note-entry {
          padding: 10px 15px;
          border-left: 4px solid #3498db;
          margin-bottom: 12px;
          background-color: #f9f9f9;
        }

        hr {
          border: none;
          border-top: 1px solid #ccc;
          margin: 20px 0;
        }

        button {
          padding: 10px 20px;
          margin-top: 10px;
          margin-right: 10px;
          border: none;
          background-color: #3498db;
          color: #fff;
          border-radius: 4px;
          cursor: pointer;
        }

        button:hover {
          background-color: #2980b9;
        }

        .no-print {
          display: inline-block;
        }

        @media print {
          .no-print {
            display: none;
          }

          .report-container {
            border: none;
            margin: 0;
            padding: 0;
            width: 100%;
          }
        }
      `}</style>

      <div className="report-header">
        <h1>Laporan Pengguna</h1>
        <h2>{user.username}</h2>
      </div>

      <div className="report-section">
        <p><strong>Nama:</strong> {user.NAME}</p>
        <p><strong>Tanggal Lahir:</strong> {formatDate(user.tanggal_lahir)}</p>
        <p><strong>Email:</strong> {user.email || '-'}</p>
        <p><strong>Alamat:</strong> {user.alamat || '-'}</p>
      </div>

      <hr />

      {folderData.length === 0 ? (
        <p>Tidak ada folder ditemukan.</p>
      ) : (
        folderData.map((folder) => (
          <div key={folder.id_folder} className="folder-section">
            <h3>📁 Folder: {folder.judul}</h3>
            {folder.details.length === 0 ? (
              <p style={{ marginLeft: '10px' }}>Tidak ada catatan di folder ini.</p>
            ) : (
              folder.details.map((note, i) => (
                <div key={note.id_catatan || i} className="note-entry">
                  <p><strong>{i + 1}. {note.judul}</strong></p>
                  <p><em>Akses:</em> {note.akses} | <em>Tanggal:</em> {formatDate(note.tanggal_ditambahkan)}</p>
                  <p>{note.catatan}</p>
                </div>
              ))
            )}
          </div>
        ))
      )}

      <div className="no-print">
        <button onClick={() => navigate(-1)}>Kembali</button>
        <button onClick={printReport}>Save as PDF</button>
      </div>
    </div>
  );
}
