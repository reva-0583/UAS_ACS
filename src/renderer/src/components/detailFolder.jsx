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

  async function printReport() {
    await window.api.printReport();
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
    <div className="folder-detail-container">
      <style>{`
        .folder-detail-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 30px;
          font-family: 'Segoe UI', Tahoma, sans-serif;
          background-color: #fff;
          color: #333;
        }

        .folder-title {
          text-align: center;
          font-size: 24px;
          margin-bottom: 30px;
        }

        .folder-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }

        .folder-table th, .folder-table td {
          border: 1px solid #ccc;
          padding: 12px 16px;
          text-align: left;
        }

        .folder-table th {
          background-color: #f4f4f4;
          width: 200px;
        }

        .button-group {
          display: flex;
          gap: 10px;
        }

        button {
          padding: 10px 20px;
          border: none;
          background-color: #3498db;
          color: white;
          border-radius: 4px;
          cursor: pointer;
        }

        button:hover {
          background-color: #2980b9;
        }

        .no-print {
          margin-top: 10px;
        }

        @media print {
          .no-print {
            display: none;
          }

          .folder-detail-container {
            padding: 0;
            margin: 0;
          }
        }
      `}</style>

      <h2 className="folder-title">Laporan Detail Folder</h2>
      <table className="folder-table">
        <tbody>
          <tr>
            <th>ID Folder</th>
            <td>{folder.id_folder}</td>
          </tr>
          <tr>
            <th>Judul</th>
            <td>{folder.judul}</td>
          </tr>
          <tr>
            <th>Username</th>
            <td>{folder.username}</td>
          </tr>
          <tr>
            <th>Jumlah Note</th>
            <td>{jumlahDetail}</td>
          </tr>
        </tbody>
      </table>

      <div className="button-group no-print">
        <button onClick={() => navigate(-1)}>Kembali</button>
        <button onClick={printReport}>Save as PDF</button>
      </div>
    </div>
  );
}
