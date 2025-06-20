import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function AdminGrupNoteDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const note = location.state;

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
            hour: '2-digit',
            minute: '2-digit',
          });
    } catch {
      return '-';
    }
  };

  async function printReport() {
    await window.api.printReport();
  }

  if (!note) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Data catatan tidak tersedia</h1>
        <button onClick={() => navigate(-1)}>Kembali</button>
      </div>
    );
  }

  return (
    <div className="note-report-container">
      <style>{`
        .note-report-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 30px;
          font-family: 'Segoe UI', Tahoma, sans-serif;
          background-color: #fff;
          color: #333;
        }

        .note-report-title {
          text-align: center;
          margin-bottom: 30px;
          font-size: 24px;
        }

        .note-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }

        .note-table th, .note-table td {
          border: 1px solid #ccc;
          padding: 10px 15px;
          text-align: left;
        }

        .note-table th {
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
          .note-report-container {
            padding: 0;
            margin: 0;
          }
        }
      `}</style>

      <h2 className="note-report-title">Laporan Detail Catatan Grup</h2>
      <table className="note-table">
        <tbody>
          <tr>
            <th>ID Group Note</th>
            <td>{note.id_group_note}</td>
          </tr>
          <tr>
            <th>ID Group Folder</th>
            <td>{note.id_group_folder}</td>
          </tr>
          <tr>
            <th>Username</th>
            <td>{note.username}</td>
          </tr>
          <tr>
            <th>Judul</th>
            <td>{note.judul}</td>
          </tr>
          <tr>
            <th>Catatan</th>
            <td style={{ whiteSpace: 'pre-wrap' }}>{note.catatan}</td>
          </tr>
          <tr>
            <th>Tanggal Ditambahkan</th>
            <td>{formatDate(note.tanggal_ditambahkan)}</td>
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
