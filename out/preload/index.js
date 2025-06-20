"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const api = {
  getPublicNotes: () => electron.ipcRenderer.invoke("get-public-notes"),
  getPublicTitles: () => electron.ipcRenderer.invoke("get-public-titles"),
  getDetailsByFolderId: (folder_id) => electron.ipcRenderer.invoke("get-details-by-folder-id", folder_id),
  getNoteDetail: (judul) => electron.ipcRenderer.invoke("get-note-detail", judul),
  updateNote: (note) => electron.ipcRenderer.invoke("update-note", note),
  deleteNote: (judul) => electron.ipcRenderer.invoke("delete-note", judul),
  addFolder: (judul, username) => electron.ipcRenderer.invoke("add-folder", judul, username),
  getFoldersByUsername: (username) => electron.ipcRenderer.invoke("get-folders-by-username", username),
  viewFolder: (username) => electron.ipcRenderer.invoke("view-folder", username),
  login: (credentials) => electron.ipcRenderer.invoke("login", credentials),
  getDetailsByFolder: (id_folder) => electron.ipcRenderer.invoke("get-details-by-folder", id_folder),
  adminLogin: (credentials) => electron.ipcRenderer.invoke("admin-login", credentials),
  getAllUsers: () => electron.ipcRenderer.invoke("get-all-users"),
  deleteUser: (username) => electron.ipcRenderer.invoke("delete-user", username),
  updateUser: (data) => electron.ipcRenderer.invoke("update-user", data),
  getAllFolders: () => electron.ipcRenderer.invoke("get-all-folders"),
  updateFolder: (folderData) => electron.ipcRenderer.invoke("update-folder", folderData),
  deleteFolder: (id_folder) => electron.ipcRenderer.invoke("delete-folder", id_folder),
  getJumlahDetailByFolder: (id_folder) => electron.ipcRenderer.invoke("get-jumlah-detail-by-folder", id_folder),
  addDetail: (data) => electron.ipcRenderer.invoke("add-detail", data),
  getAllNotes: () => electron.ipcRenderer.invoke("get-all-notes"),
  editNote: (noteData) => electron.ipcRenderer.invoke("edit-note", noteData),
  removeNote: (id_catatan) => electron.ipcRenderer.invoke("remove-note", id_catatan),
  getGroupFolders: (username) => electron.ipcRenderer.invoke("get-group-folders", username),
  addGroupFolder: (data) => electron.ipcRenderer.invoke("add-group-folder", data),
  checkUsername: (username) => electron.ipcRenderer.invoke("check-username", username),
  getGroupFoldersByUser: (username) => electron.ipcRenderer.invoke("get-group-folders-by-user", username),
  addMemberToGroup: (data) => electron.ipcRenderer.invoke("add-member-to-group", data),
  getGroupNotes: (id_group_folder) => electron.ipcRenderer.invoke("get-group-notes", id_group_folder),
  deleteGroupNote: (id_catatan) => electron.ipcRenderer.invoke("delete-group-note", id_catatan),
  addGroupNote: (data) => electron.ipcRenderer.invoke("add-group-note", data),
  getGroupNoteDetail: (id) => electron.ipcRenderer.invoke("get-group-note-detail", id),
  updateGroupNote: (payload) => electron.ipcRenderer.invoke("update-group-note", payload),
  addMention: (data) => electron.ipcRenderer.invoke("add-mention", data),
  getMentionCountsByFolder: (username) => electron.ipcRenderer.invoke("get-mention-counts", username),
  getMentionCountsByNote: (username) => electron.ipcRenderer.invoke("get-mention-counts-by-note", username),
  getAllGroupFolders: () => electron.ipcRenderer.invoke("get-all-group-folders"),
  updateGroupFolder: (data) => electron.ipcRenderer.invoke("update-group-folder", data),
  deleteGroupFolder: (id) => electron.ipcRenderer.invoke("delete-group-folder", id),
  getAllGroupNotes: () => electron.ipcRenderer.invoke("get-all-group-notes"),
  editGroupNote: (noteData) => electron.ipcRenderer.invoke("edit-group-note", noteData),
  removeGroupNote: (id_group_note) => electron.ipcRenderer.invoke("remove-group-note", id_group_note),
  register: (data) => electron.ipcRenderer.invoke("register", data),
  printReport: function() {
    return electron.ipcRenderer.invoke("printReport");
  }
};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error("ContextBridge error:", error);
  }
} else {
  window.electron = preload.electronAPI;
  window.api = api;
}
