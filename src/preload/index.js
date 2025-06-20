import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
const api = {
  getPublicNotes: () => ipcRenderer.invoke('get-public-notes'),
  getPublicTitles: () => ipcRenderer.invoke('get-public-titles'),
  getDetailsByFolderId: (folder_id) => ipcRenderer.invoke('get-details-by-folder-id', folder_id),
  getNoteDetail: (judul) => ipcRenderer.invoke('get-note-detail', judul),
  updateNote: (note) => ipcRenderer.invoke('update-note', note),
  deleteNote: (judul) => ipcRenderer.invoke('delete-note', judul),
  addFolder: (judul, username) => ipcRenderer.invoke('add-folder', judul, username),
  getFoldersByUsername: (username) => ipcRenderer.invoke('get-folders-by-username', username),
  viewFolder: (username) => ipcRenderer.invoke('view-folder', username),
  login: (credentials) => ipcRenderer.invoke('login', credentials),
  getDetailsByFolder: (id_folder) => ipcRenderer.invoke('get-details-by-folder', id_folder),
  adminLogin: (credentials) => ipcRenderer.invoke('admin-login', credentials),
  getAllUsers: () => ipcRenderer.invoke('get-all-users'),
  deleteUser: (username) => ipcRenderer.invoke('delete-user', username),
  updateUser: (data) => ipcRenderer.invoke('update-user', data),
  getAllFolders: () => ipcRenderer.invoke('get-all-folders'),
  updateFolder: (folderData) => ipcRenderer.invoke('update-folder', folderData),
  deleteFolder: (id_folder) => ipcRenderer.invoke('delete-folder', id_folder),
  getJumlahDetailByFolder: (id_folder) => ipcRenderer.invoke('get-jumlah-detail-by-folder', id_folder),
  addDetail: (data) => ipcRenderer.invoke('add-detail', data),
  getAllNotes: () => ipcRenderer.invoke('get-all-notes'),
  editNote: (noteData) => ipcRenderer.invoke('edit-note', noteData),
  removeNote: (id_catatan) => ipcRenderer.invoke('remove-note', id_catatan),
  getGroupFolders: (username) => ipcRenderer.invoke('get-group-folders', username),
  addGroupFolder: (data) => ipcRenderer.invoke('add-group-folder', data),
  checkUsername: (username) => ipcRenderer.invoke('check-username', username),
  getGroupFoldersByUser: (username) => ipcRenderer.invoke('get-group-folders-by-user', username),
  addMemberToGroup: (data) => ipcRenderer.invoke('add-member-to-group', data),
  getGroupNotes: (id_group_folder) => ipcRenderer.invoke('get-group-notes', id_group_folder),
  deleteGroupNote: (id_catatan) => ipcRenderer.invoke('delete-group-note', id_catatan),
  addGroupNote: (data) => ipcRenderer.invoke('add-group-note', data),
  getGroupNoteDetail: (id) => ipcRenderer.invoke('get-group-note-detail', id),
  updateGroupNote: (payload) => ipcRenderer.invoke('update-group-note', payload),
  addMention: (data) => ipcRenderer.invoke('add-mention', data),
  getMentionCountsByFolder: (username) => ipcRenderer.invoke('get-mention-counts', username),
  getMentionCountsByNote: (username) => ipcRenderer.invoke('get-mention-counts-by-note', username),
  getAllGroupFolders: () => ipcRenderer.invoke('get-all-group-folders'),
  updateGroupFolder: (data) => ipcRenderer.invoke('update-group-folder', data),
  deleteGroupFolder: (id) => ipcRenderer.invoke('delete-group-folder', id),
  getAllGroupNotes: () => ipcRenderer.invoke('get-all-group-notes'),
  editGroupNote: (noteData) => ipcRenderer.invoke('edit-group-note', noteData),
  removeGroupNote: (id_group_note) => ipcRenderer.invoke('remove-group-note', id_group_note),
  register: (data) => ipcRenderer.invoke('register', data),
  printReport: function () {
    return ipcRenderer.invoke('printReport')
  },
}
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error('ContextBridge error:', error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}