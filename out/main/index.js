"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const fs = require("fs");
const mysql = require("mysql2/promise");
const icon = path.join(__dirname, "../../resources/icon.png");
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "m4"
});
async function getPublicNotes() {
  const [rows] = await pool.query("CALL getPublicNotes()");
  return rows[0];
}
async function getPublicTitles() {
  const [rows] = await pool.query("CALL getPublicTitles()");
  return rows[0];
}
async function getDetailsByFolderId(id_folder) {
  const [rows] = await pool.query("CALL getDetailsByFolderId(?)", [id_folder]);
  return rows[0];
}
async function getNoteDetail(judul) {
  const [rows] = await pool.query("CALL getNoteDetail(?)", [judul]);
  return rows[0][0];
}
async function updateNote(note) {
  const { judul, catatan } = note;
  await pool.query("CALL updateNote(?, ?)", [judul, catatan]);
  return { success: true };
}
async function deleteNote(judul) {
  await pool.query("CALL deleteNote(?)", [judul]);
  return { success: true };
}
async function addFolder(judul, username) {
  const [rows] = await pool.query("CALL addFolder(?, ?)", [judul, username]);
  return { success: true };
}
async function getFoldersByUsername(username) {
  const [rows] = await pool.query("CALL getFoldersByUsername(?)", [username]);
  return rows[0];
}
async function viewFolder(username) {
  const [rows] = await pool.query("CALL viewFolder(?)", [username]);
  return rows[0];
}
async function login({ username, password }) {
  const [rows] = await pool.query("CALL login(?, ?)", [username, password]);
  if (rows[0].length > 0) {
    return { success: true, user: rows[0][0] };
  } else {
    return { success: false, message: "Username atau password salah." };
  }
}
async function getDetailsByFolder(id_folder) {
  try {
    const [rows] = await pool.query("CALL get_details_by_folder(?)", [id_folder]);
    return rows[0];
  } catch (err) {
    console.error("Gagal mengambil detail folder:", err);
    return [];
  }
}
async function loginAdmin({ username, password }) {
  const [rows] = await pool.query("CALL loginAdmin(?, ?)", [username, password]);
  if (rows[0].length > 0) {
    return { success: true, admin: rows[0][0] };
  } else {
    return { success: false, message: "Username atau password admin salah." };
  }
}
async function getAllUsers() {
  const [rows] = await pool.query("CALL getAllUsers()");
  return rows[0];
}
async function deleteUser(username) {
  const conn = await pool.getConnection();
  try {
    await conn.query("CALL delete_user(?)", [username]);
    return { success: true };
  } catch (error) {
    console.error("Error deleting user and related data:", error);
    return { success: false, error: error.message };
  } finally {
    conn.release();
  }
}
async function updateUser(data) {
  const { oldUsername, username, name, tanggal_lahir, email, alamat } = data;
  await pool.query("CALL updateUser(?, ?, ?, ?, ?, ?)", [oldUsername, username, name, tanggal_lahir, email, alamat]);
  return { success: true };
}
async function getAllFolders() {
  const [rows] = await pool.query("CALL getAllFolders()");
  return rows[0];
}
async function deleteFolder(id_folder) {
  await pool.query("CALL deleteFolder(?)", [id_folder]);
  return { success: true };
}
async function updateFolder({ id_folder, judul, username }) {
  await pool.query("CALL updateFolder(?, ?, ?)", [id_folder, judul, username]);
  return { success: true };
}
async function getJumlahDetailByFolder(id_folder) {
  const [rows] = await pool.query("CALL getJumlahDetailByFolder(?)", [id_folder]);
  return rows[0][0].jumlah;
}
async function addDetail(id_folder, judul, catatan, akses) {
  await pool.query("CALL addDetail(?, ?, ?, ?)", [id_folder, judul, catatan, akses]);
  return { success: true };
}
async function getAllNotes() {
  const [rows] = await pool.query("CALL getAllNotes()");
  return rows[0];
}
async function editNote({ id_catatan, judul, catatan, akses }) {
  const [rows] = await pool.query("CALL editNote(?, ?, ?, ?)", [id_catatan, judul, catatan, akses]);
  return { success: rows[0][0].affected > 0 };
}
async function removeNote(id_catatan) {
  const [rows] = await pool.query("CALL removeNote(?)", [id_catatan]);
  return { success: rows[0][0].affected > 0 };
}
async function getGroupFolders(username) {
  const [rows] = await pool.query("CALL getGroupFolders(?)", [username]);
  return rows[0];
}
async function addGroupFolder({ judul, username }) {
  try {
    await pool.query("CALL add_group_folder(?, ?)", [judul, username]);
    return { success: true };
  } catch (err) {
    console.error("Error adding group folder:", err);
    return { success: false, error: err };
  }
}
async function checkUsername(username) {
  const [rows] = await pool.query("CALL checkUsername(?)", [username]);
  return { exists: rows[0].length > 0 };
}
async function getGroupFoldersByUser(username) {
  const [rows] = await pool.query("CALL getGroupFoldersByUser(?)", [username]);
  return rows[0];
}
async function addMemberToGroup({ id_group_folder, username }) {
  try {
    await pool.query("CALL add_member_to_group(?, ?)", [id_group_folder, username]);
    return { success: true };
  } catch (err) {
    console.error("Error adding member to group:", err);
    if (err.errno === 1644) {
      return { success: false, error: err.sqlMessage };
    }
    return { success: false, error: err.message };
  }
}
async function getGroupNotes(id_group_folder) {
  const [rows] = await pool.query("CALL getGroupNotes(?)", [id_group_folder]);
  return rows[0];
}
async function deleteGroupNote(id_group_note) {
  try {
    const [rows] = await pool.query("CALL deleteGroupNote(?)", [id_group_note]);
    return { success: rows[0][0].affected > 0 };
  } catch (err) {
    console.error(err);
    return { success: false, error: err.message };
  }
}
async function addGroupNote({ id_group_folder, judul, catatan, username }) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query(
      "CALL add_group_note(?, ?, ?, ?)",
      [id_group_folder, username, judul, catatan]
    );
    const id_group_note = rows[0][0].id_group_note;
    const mentionRegex = /@(\w+)/g;
    const mentions = /* @__PURE__ */ new Set();
    let match;
    while ((match = mentionRegex.exec(catatan)) !== null) {
      mentions.add(match[1]);
    }
    for (const mentionedUser of mentions) {
      await conn.query(
        "INSERT INTO group_note_mentions (id_group_note, username_mentioned) VALUES (?, ?)",
        [id_group_note, mentionedUser]
      );
    }
    await conn.commit();
    return { success: true };
  } catch (error) {
    await conn.rollback();
    console.error("Error adding group note:", error);
    return { success: false, error: error.message };
  } finally {
    conn.release();
  }
}
async function getGroupNoteDetail(id) {
  try {
    const [rows] = await pool.query("CALL get_group_note_detail(?)", [id]);
    return rows[0][0];
  } catch (err) {
    throw new Error("Gagal mendapatkan detail group note");
  }
}
async function updateGroupNote({ id_group_note, catatan }) {
  const [rows] = await pool.query("CALL updateGroupNote(?, ?)", [id_group_note, catatan]);
  return { success: rows[0][0].affected > 0 };
}
async function addMention({ id_group_note, username_mentioned }) {
  try {
    await pool.query("CALL add_mention(?, ?)", [id_group_note, username_mentioned]);
    return { success: true };
  } catch (err) {
    console.error("Gagal menambahkan mention:", err);
    return { success: false, error: err.message };
  }
}
async function getMentionCountsByFolder(username) {
  const [rows] = await pool.query("CALL getMentionCountsByFolder(?)", [username]);
  return rows[0];
}
async function getMentionCountsByNote(username) {
  const [rows] = await pool.query("CALL getMentionCountsByNote(?)", [username]);
  return rows[0];
}
async function getAllGroupFolders() {
  try {
    const [rows] = await pool.query("CALL get_all_group_folders()");
    return rows[0];
  } catch (err) {
    console.error("Gagal mengambil semua group folder:", err);
    throw new Error("Gagal mengambil semua group folder");
  }
}
async function updateGroupFolder({ id_group_folder, judul, owner_username }) {
  const [rows] = await pool.query("CALL updateGroupFolder(?, ?, ?)", [id_group_folder, judul, owner_username]);
  return { success: rows[0][0].affected > 0 };
}
async function deleteGroupFolder(id_group_folder) {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query("CALL delete_group_folder(?)", [id_group_folder]);
    return { success: true };
  } catch (err) {
    console.error("Gagal menghapus group folder:", err);
    return { success: false, error: err.message };
  } finally {
    conn.release();
  }
}
async function getAllGroupNotes() {
  try {
    const [rows] = await pool.query("CALL get_all_group_notes()");
    return rows[0];
  } catch (err) {
    console.error("Gagal mengambil semua group note:", err);
    throw new Error("Gagal mengambil semua group note");
  }
}
async function editGroupNote({ id_group_note, judul, catatan, username }) {
  const [rows] = await pool.query("CALL editGroupNote(?, ?, ?, ?)", [id_group_note, judul, catatan, username]);
  return { success: rows[0][0].affected > 0 };
}
async function removeGroupNote(id_group_note) {
  try {
    const [rows] = await pool.query("CALL remove_group_note(?)", [id_group_note]);
    const affectedRows = rows[0][0].affected_rows;
    return { success: affectedRows > 0 };
  } catch (err) {
    console.error("Gagal menghapus group note:", err);
    return { success: false, error: err.message };
  }
}
async function register({ username, name, password, tanggal_lahir, email, alamat }) {
  try {
    await pool.query("CALL register_account(?, ?, ?, ?, ?, ?)", [
      username,
      name,
      password,
      tanggal_lahir,
      email,
      alamat
    ]);
    return { success: true };
  } catch (err) {
    return { success: false, message: err.message };
  }
}
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  electron.ipcMain.on("ping", () => console.log("pong"));
  electron.ipcMain.handle("get-public-notes", async () => {
    return await getPublicNotes();
  });
  electron.ipcMain.handle("get-public-titles", async () => {
    return await getPublicTitles();
  });
  electron.ipcMain.handle("get-details-by-folder-id", async (event, folder_id) => {
    return await getDetailsByFolderId(folder_id);
  });
  electron.ipcMain.handle("get-note-detail", async (event, judul) => {
    return await getNoteDetail(judul);
  });
  electron.ipcMain.handle("update-note", async (event, note) => {
    return await updateNote(note);
  });
  electron.ipcMain.handle("delete-note", async (event, judul) => {
    return await deleteNote(judul);
  });
  electron.ipcMain.handle("add-folder", async (event, judul, username) => {
    try {
      return await addFolder(judul, username);
    } catch (error) {
      console.error("Error in add-folder:", error.message);
      return { success: false, error: error.message };
    }
  });
  electron.ipcMain.handle("get-folders-by-username", async (event, username) => {
    return await getFoldersByUsername(username);
  });
  electron.ipcMain.handle("view-folder", async (event, username) => {
    return await viewFolder(username);
  });
  electron.ipcMain.handle("login", async (event, credentials) => {
    return await login(credentials);
  });
  electron.ipcMain.handle("get-details-by-folder", async (event, id_folder) => {
    return await getDetailsByFolder(id_folder);
  });
  electron.ipcMain.handle("admin-login", async (event, credentials) => {
    return await loginAdmin(credentials);
  });
  electron.ipcMain.handle("get-all-users", async () => {
    return await getAllUsers();
  });
  electron.ipcMain.handle("delete-user", async (event, username) => {
    try {
      return await deleteUser(username);
    } catch (error) {
      console.error("Error deleting user:", error);
      return { success: false, error: error.message };
    }
  });
  electron.ipcMain.handle("update-user", async (event, data) => {
    return await updateUser(data);
  });
  electron.ipcMain.handle("get-all-folders", async () => {
    return await getAllFolders();
  });
  electron.ipcMain.handle("update-folder", async (event, folderData) => {
    return await updateFolder(folderData);
  });
  electron.ipcMain.handle("delete-folder", async (event, id_folder) => {
    return await deleteFolder(id_folder);
  });
  electron.ipcMain.handle("get-jumlah-detail-by-folder", async (event, id_folder) => {
    try {
      const jumlah = await getJumlahDetailByFolder(id_folder);
      return jumlah;
    } catch (error) {
      console.error("Gagal ambil jumlah detail:", error);
      throw error;
    }
  });
  electron.ipcMain.handle("add-detail", async (event, { id_folder, judul, catatan, akses }) => {
    try {
      const result = await addDetail(id_folder, judul, catatan, akses);
      return { success: true, result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
  electron.ipcMain.handle("get-all-notes", async () => {
    return await getAllNotes();
  });
  electron.ipcMain.handle("edit-note", async (event, noteData) => {
    return await editNote(noteData);
  });
  electron.ipcMain.handle("remove-note", async (event, id_catatan) => {
    return await removeNote(id_catatan);
  });
  electron.ipcMain.handle("get-group-folders", async (event, username) => {
    return await getGroupFolders(username);
  });
  electron.ipcMain.handle("add-group-folder", async (event, data) => {
    return await addGroupFolder(data);
  });
  electron.ipcMain.handle("check-username", async (event, username) => {
    return await checkUsername(username);
  });
  electron.ipcMain.handle("get-group-folders-by-user", async (event, username) => {
    return await getGroupFoldersByUser(username);
  });
  electron.ipcMain.handle("add-member-to-group", async (event, data) => {
    return await addMemberToGroup(data);
  });
  electron.ipcMain.handle("get-group-notes", async (event, id_group_folder) => {
    return await getGroupNotes(id_group_folder);
  });
  electron.ipcMain.handle("delete-group-note", async (event, id_catatan) => {
    return await deleteGroupNote(id_catatan);
  });
  electron.ipcMain.handle("add-group-note", async (event, data) => {
    return await addGroupNote(data);
  });
  electron.ipcMain.handle("get-group-note-detail", async (event, id_group_note) => {
    return await getGroupNoteDetail(id_group_note);
  });
  electron.ipcMain.handle("update-group-note", async (event, payload) => {
    return await updateGroupNote(payload);
  });
  electron.ipcMain.handle("add-mention", async (event, data) => {
    return await addMention(data);
  });
  electron.ipcMain.handle("get-mention-counts", async (event, username) => {
    return await getMentionCountsByFolder(username);
  });
  electron.ipcMain.handle("get-mention-counts-by-note", async (e, username) => {
    return await getMentionCountsByNote(username);
  });
  electron.ipcMain.handle("get-all-group-folders", async () => {
    return await getAllGroupFolders();
  });
  electron.ipcMain.handle("update-group-folder", async (event, data) => {
    return await updateGroupFolder(data);
  });
  electron.ipcMain.handle("delete-group-folder", async (event, id_group_folder) => {
    return await deleteGroupFolder(id_group_folder);
  });
  electron.ipcMain.handle("get-all-group-notes", async () => {
    return await getAllGroupNotes();
  });
  electron.ipcMain.handle("edit-group-note", async (event, noteData) => {
    return await editGroupNote(noteData);
  });
  electron.ipcMain.handle("remove-group-note", async (event, id_group_note) => {
    return await removeGroupNote(id_group_note);
  });
  electron.ipcMain.handle("register", async (event, data) => {
    return await register(data);
  });
  electron.ipcMain.handle("printReport", async (event) => {
    const win = electron.BrowserWindow.fromWebContents(event.sender);
    try {
      const { filePath } = await electron.dialog.showSaveDialog({
        title: "Save Report as PDF",
        defaultPath: `Transaction.pdf`,
        filters: [{ name: "PDF Files", extensions: ["pdf"] }]
      });
      if (!filePath) return;
      const pdfData = await win.webContents.printToPDF({
        printBackground: true,
        pageSize: "A4"
      });
      fs.writeFileSync(filePath, pdfData);
      return { success: true, path: filePath };
    } catch (error) {
      console.error("PDF Generation Error:", error);
      return { success: false, error: error.message };
    }
  });
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
