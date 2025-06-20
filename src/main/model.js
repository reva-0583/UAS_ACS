import mysql from 'mysql2/promise';
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'm4',
});

export async function getPublicNotes() {
  const [rows] = await pool.query('CALL getPublicNotes()');
  return rows[0];
}
export async function getPublicTitles() {
  const [rows] = await pool.query('CALL getPublicTitles()');
  return rows[0];
}
export async function getDetailsByFolderId(id_folder) {
  const [rows] = await pool.query('CALL getDetailsByFolderId(?)', [id_folder]);
  return rows[0];
}

export async function getNoteDetail(judul) {
  const [rows] = await pool.query('CALL getNoteDetail(?)', [judul]);
  return rows[0][0];
}
export async function updateNote(note) {
  const { judul, catatan } = note;
  await pool.query('CALL updateNote(?, ?)', [judul, catatan]);
  return { success: true };
}
export async function deleteNote(judul) {
  await pool.query('CALL deleteNote(?)', [judul]);
  return { success: true };
}
export async function addFolder(judul, username) {
  const [rows] = await pool.query('CALL addFolder(?, ?)', [judul, username]);
  return { success: true };
}

export async function getFoldersByUsername(username) {
  const [rows] = await pool.query('CALL getFoldersByUsername(?)', [username]);
  return rows[0];
}

export async function viewFolder(username) {
  const [rows] = await pool.query('CALL viewFolder(?)', [username]);
  return rows[0];
}

export async function login({ username, password }) {
  const [rows] = await pool.query('CALL login(?, ?)', [username, password]);
  if (rows[0].length > 0) {
    return { success: true, user: rows[0][0] };
  } else {
    return { success: false, message: "Username atau password salah." };
  }
}

export async function getDetailsByFolder(id_folder) {
  try {
    const [rows] = await pool.query('CALL get_details_by_folder(?)', [id_folder]);
    return rows[0]; // karena hasil SELECT ada di rows[0]
  } catch (err) {
    console.error('Gagal mengambil detail folder:', err);
    return [];
  }
}


export async function loginAdmin({ username, password }) {
  const [rows] = await pool.query('CALL loginAdmin(?, ?)', [username, password]);
  if (rows[0].length > 0) {
    return { success: true, admin: rows[0][0] };
  } else {
    return { success: false, message: "Username atau password admin salah." };
  }
}

export async function getAllUsers() {
  const [rows] = await pool.query('CALL getAllUsers()');
  return rows[0];
}

export async function deleteUser(username) {
  const conn = await pool.getConnection();
  try {
    await conn.query('CALL delete_user(?)', [username]);
    return { success: true };
  } catch (error) {
    console.error('Error deleting user and related data:', error);
    return { success: false, error: error.message };
  } finally {
    conn.release();
  }
}

export async function updateUser(data) {
  const { oldUsername, username, name, tanggal_lahir, email, alamat } = data;
  await pool.query('CALL updateUser(?, ?, ?, ?, ?, ?)', [oldUsername, username, name, tanggal_lahir, email, alamat]);
  return { success: true };
}

export async function getAllFolders() {
  const [rows] = await pool.query('CALL getAllFolders()');
  return rows[0];
}


export async function deleteFolder(id_folder) {
  await pool.query('CALL deleteFolder(?)', [id_folder]);
  return { success: true };
}

export async function updateFolder({ id_folder, judul, username }) {
  await pool.query('CALL updateFolder(?, ?, ?)', [id_folder, judul, username]);
  return { success: true };
}
export async function getJumlahDetailByFolder(id_folder) {
  const [rows] = await pool.query('CALL getJumlahDetailByFolder(?)', [id_folder]);
  return rows[0][0].jumlah;
}
export async function addDetail(id_folder, judul, catatan, akses) {
  await pool.query('CALL addDetail(?, ?, ?, ?)', [id_folder, judul, catatan, akses]);
  return { success: true };
}

export async function getAllNotes() {
  const [rows] = await pool.query('CALL getAllNotes()');
  return rows[0];
}
export async function editNote({ id_catatan, judul, catatan, akses }) {
  const [rows] = await pool.query('CALL editNote(?, ?, ?, ?)', [id_catatan, judul, catatan, akses]);
  return { success: rows[0][0].affected > 0 };
}

export async function removeNote(id_catatan) {
  const [rows] = await pool.query('CALL removeNote(?)', [id_catatan]);
  return { success: rows[0][0].affected > 0 };
}
export async function getGroupFolders(username) {
  const [rows] = await pool.query('CALL getGroupFolders(?)', [username]);
  return rows[0];
}
export async function addGroupFolder({ judul, username }) {
  try {
    await pool.query('CALL add_group_folder(?, ?)', [judul, username]);
    return { success: true };
  } catch (err) {
    console.error('Error adding group folder:', err);
    return { success: false, error: err };
  }
}

export async function checkUsername(username) {
  const [rows] = await pool.query('CALL checkUsername(?)', [username]);
  return { exists: rows[0].length > 0 };
}

export async function getGroupFoldersByUser(username) {
  const [rows] = await pool.query('CALL getGroupFoldersByUser(?)', [username]);
  return rows[0];
}
export async function addMemberToGroup({ id_group_folder, username }) {
  try {
    await pool.query('CALL add_member_to_group(?, ?)', [id_group_folder, username]);
    return { success: true };
  } catch (err) {
    console.error('Error adding member to group:', err);
    if (err.errno === 1644) {
      return { success: false, error: err.sqlMessage };
    }
    return { success: false, error: err.message };
  }
}

export async function getGroupNotes(id_group_folder) {
  const [rows] = await pool.query('CALL getGroupNotes(?)', [id_group_folder]);
  return rows[0];
}

export async function deleteGroupNote(id_group_note) {
  try {
    const [rows] = await pool.query('CALL deleteGroupNote(?)', [id_group_note]);
    return { success: rows[0][0].affected > 0 };
  } catch (err) {
    console.error(err);
    return { success: false, error: err.message };
  }
}
export async function addGroupNote({ id_group_folder, judul, catatan, username }) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.query(
      'CALL add_group_note(?, ?, ?, ?)',
      [id_group_folder, username, judul, catatan]
    );

    const id_group_note = rows[0][0].id_group_note;

    const mentionRegex = /@(\w+)/g;
    const mentions = new Set();
    let match;
    while ((match = mentionRegex.exec(catatan)) !== null) {
      mentions.add(match[1]);
    }

    for (const mentionedUser of mentions) {
      await conn.query(
        'INSERT INTO group_note_mentions (id_group_note, username_mentioned) VALUES (?, ?)',
        [id_group_note, mentionedUser]
      );
    }

    await conn.commit();
    return { success: true };
  } catch (error) {
    await conn.rollback();
    console.error('Error adding group note:', error);
    return { success: false, error: error.message };
  } finally {
    conn.release();
  }
}

export async function getGroupNoteDetail(id) {
  try {
    const [rows] = await pool.query('CALL get_group_note_detail(?)', [id]);
    return rows[0][0];
  } catch (err) {
    throw new Error('Gagal mendapatkan detail group note');
  }
}

export async function updateGroupNote({ id_group_note, catatan }) {
  const [rows] = await pool.query('CALL updateGroupNote(?, ?)', [id_group_note, catatan]);
  return { success: rows[0][0].affected > 0 };
}

export async function addMention({ id_group_note, username_mentioned }) {
  try {
    await pool.query('CALL add_mention(?, ?)', [id_group_note, username_mentioned]);
    return { success: true };
  } catch (err) {
    console.error('Gagal menambahkan mention:', err);
    return { success: false, error: err.message };
  }
}

export async function getMentionCountsByFolder(username) {
  const [rows] = await pool.query('CALL getMentionCountsByFolder(?)', [username]);
  return rows[0];
}

export async function getMentionCountsByNote(username) {
  const [rows] = await pool.query('CALL getMentionCountsByNote(?)', [username]);
  return rows[0];
}
export async function getAllGroupFolders() {
  try {
    const [rows] = await pool.query('CALL get_all_group_folders()');
    return rows[0]; 
  } catch (err) {
    console.error('Gagal mengambil semua group folder:', err);
    throw new Error('Gagal mengambil semua group folder');
  }
}

export async function updateGroupFolder({ id_group_folder, judul, owner_username }) {
  const [rows] = await pool.query('CALL updateGroupFolder(?, ?, ?)', [id_group_folder, judul, owner_username]);
  return { success: rows[0][0].affected > 0 };
}

export async function deleteGroupFolder(id_group_folder) {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query('CALL delete_group_folder(?)', [id_group_folder]);

    return { success: true };
  } catch (err) {
    console.error('Gagal menghapus group folder:', err);
    return { success: false, error: err.message };
  } finally {
    conn.release();
  }
}

export async function getAllGroupNotes() {
  try {
    const [rows] = await pool.query('CALL get_all_group_notes()');
    return rows[0];
  } catch (err) {
    console.error('Gagal mengambil semua group note:', err);
    throw new Error('Gagal mengambil semua group note');
  }
}

export async function editGroupNote({ id_group_note, judul, catatan, username }) {
  const [rows] = await pool.query('CALL editGroupNote(?, ?, ?, ?)', [id_group_note, judul, catatan, username]);
  return { success: rows[0][0].affected > 0 };
}
export async function removeGroupNote(id_group_note) {
  try {
    const [rows] = await pool.query('CALL remove_group_note(?)', [id_group_note]);
    const affectedRows = rows[0][0].affected_rows;
    return { success: affectedRows > 0 };
  } catch (err) {
    console.error('Gagal menghapus group note:', err);
    return { success: false, error: err.message };
  }
}

export async function register({ username, name, password, tanggal_lahir, email, alamat }) {
  try {
    await pool.query('CALL register_account(?, ?, ?, ?, ?, ?)', [
      username,
      name,
      password,
      tanggal_lahir,
      email,
      alamat,
    ]);
    return { success: true };
  } catch (err) {
    return { success: false, message: err.message };
  }
}
