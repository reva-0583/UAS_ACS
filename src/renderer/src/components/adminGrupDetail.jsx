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

  async function printReport() {
    await window.api.printReport();
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
    <div className="report-container">
      <style>
        {`
          .report-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 30px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #fff;
            color: #333;
            border: 1px solid #ccc;
            border-radius: 8px;
          }

          .report-title {
            text-align: center;
            margin-bottom: 30px;
            font-size: 24px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .report-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }

          .report-table th,
          .report-table td {
            border: 1px solid #ddd;
            padding: 12px 16px;
            text-align: left;
          }

          .report-table th {
            background-color: #f2f2f2;
            width: 200px;
          }

          .button-group {
            display: flex;
            justify-content: flex-end;
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

            .report-container {
              border: none;
              padding: 0;
              margin: 0;
              width: 100%;
            }
          }
        `}
      </style>

      <h2 className="report-title"> Detail Grup Folder</h2>
      <table className="report-table">
        <tbody>
          <tr>
            <th>ID Group Folder</th>
            <td>{groupFolder.id_group_folder}</td>
          </tr>
          <tr>
            <th>Judul Folder</th>
            <td>{groupFolder.judul}</td>
          </tr>
          <tr>
            <th>Username Pemilik</th>
            <td>{groupFolder.owner_username}</td>
          </tr>
          <tr>
            <th>Jumlah Grup Note</th>
            <td>{jumlahCatatan}</td>
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
