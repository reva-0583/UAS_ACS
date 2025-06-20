import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'
import {
  getPublicNotes,
  getPublicTitles,
  getDetailsByFolderId,
  getNoteDetail,
  updateNote,
  deleteNote,
  addFolder,
  getFoldersByUsername,
  viewFolder,
  login,
  getDetailsByFolder,
  loginAdmin,
  getAllUsers,
  deleteUser,
  updateUser,
  getAllFolders,
  updateFolder,
  deleteFolder,
  getJumlahDetailByFolder,
  addDetail,
  getAllNotes,
  editNote,
  removeNote,
  getGroupFolders,
  addGroupFolder,
  checkUsername,
  getGroupFoldersByUser,
  addMemberToGroup,
  getGroupNotes,
  deleteGroupNote,
  addGroupNote,
  getGroupNoteDetail,
  updateGroupNote,
  addMention,
  getMentionCountsByFolder,
  getMentionCountsByNote,
  getAllGroupFolders,
  updateGroupFolder,
  deleteGroupFolder,
  getAllGroupNotes,
  editGroupNote,
  removeGroupNote,
  register
} from '../../src/main/model.js'
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  ipcMain.on('ping', () => console.log('pong'))
  ipcMain.handle('get-public-notes', async () => {
    return await getPublicNotes()
  })
  ipcMain.handle('get-public-titles', async () => {
    return await getPublicTitles()
  })
  ipcMain.handle('get-details-by-folder-id', async (event, folder_id) => {
    return await getDetailsByFolderId(folder_id)
  })
  ipcMain.handle('get-note-detail', async (event, judul) => {
    return await getNoteDetail(judul)
  })
  ipcMain.handle('update-note', async (event, note) => {
    return await updateNote(note)
  })
  ipcMain.handle('delete-note', async (event, judul) => {
    return await deleteNote(judul);
  });
  ipcMain.handle('add-folder', async (event, judul, username) => {
    try {
      return await addFolder(judul, username);
    } catch (error) {
      console.error('Error in add-folder:', error.message);
      return { success: false, error: error.message };
    }
  });
  ipcMain.handle('get-folders-by-username', async (event, username) => {
    return await getFoldersByUsername(username);
  });
  ipcMain.handle('view-folder', async (event, username) => {
    return await viewFolder(username)
  });
  ipcMain.handle('login', async (event, credentials) => {
    return await login(credentials);
  });
  ipcMain.handle('get-details-by-folder', async (event, id_folder) => {
    return await getDetailsByFolder(id_folder);
  });
  ipcMain.handle('admin-login', async (event, credentials) => {
    return await loginAdmin(credentials);
  });
  ipcMain.handle('get-all-users', async () => {
    return await getAllUsers();
  });
  ipcMain.handle('delete-user', async (event, username) => {
    try {
      return await deleteUser(username);
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, error: error.message };
    }
  });
  ipcMain.handle('update-user', async (event, data) => {
    return await updateUser(data);
  });
  ipcMain.handle('get-all-folders', async () => {
    return await getAllFolders();
  });
  ipcMain.handle('update-folder', async (event, folderData) => {
    return await updateFolder(folderData);
  });
  ipcMain.handle('delete-folder', async (event, id_folder) => {
    return await deleteFolder(id_folder);
  });
  ipcMain.handle('get-jumlah-detail-by-folder', async (event, id_folder) => {
    try {
      const jumlah = await getJumlahDetailByFolder(id_folder);
      return jumlah;
    } catch (error) {
      console.error('Gagal ambil jumlah detail:', error);
      throw error;
    }
  });
  ipcMain.handle('add-detail', async (event, { id_folder, judul, catatan, akses }) => {
    try {
      const result = await addDetail(id_folder, judul, catatan, akses);
      return { success: true, result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
  ipcMain.handle('get-all-notes', async () => {
    return await getAllNotes();
  });
  ipcMain.handle('edit-note', async (event, noteData) => {
    return await editNote(noteData);
  });
  ipcMain.handle('remove-note', async (event, id_catatan) => {
    return await removeNote(id_catatan);
  });
  ipcMain.handle('get-group-folders', async (event, username) => {
    return await getGroupFolders(username)
  });
  ipcMain.handle('add-group-folder', async (event, data) => {
    return await addGroupFolder(data)
  })
  ipcMain.handle('check-username', async (event, username) => {
    return await checkUsername(username)
  })
  ipcMain.handle('get-group-folders-by-user', async (event, username) => {
    return await getGroupFoldersByUser(username)
  })
  ipcMain.handle('add-member-to-group', async (event, data) => {
    return await addMemberToGroup(data)
  })
  ipcMain.handle('get-group-notes', async (event, id_group_folder) => {
    return await getGroupNotes(id_group_folder)
  })
  ipcMain.handle('delete-group-note', async (event, id_catatan) => {
    return await deleteGroupNote(id_catatan)
  })
  ipcMain.handle('add-group-note', async (event, data) => {
    return await addGroupNote(data);
  })
  ipcMain.handle('get-group-note-detail', async (event, id_group_note) => {
    return await getGroupNoteDetail(id_group_note)
  })
  ipcMain.handle('update-group-note', async (event, payload) => {
    return await updateGroupNote(payload)
  })
  ipcMain.handle('add-mention', async (event, data) => {
    return await addMention(data)
  })
  ipcMain.handle('get-mention-counts', async (event, username) => {
    return await getMentionCountsByFolder(username)
  })
  ipcMain.handle('get-mention-counts-by-note', async (e, username) => {
    return await getMentionCountsByNote(username)
  })
  ipcMain.handle('get-all-group-folders', async () => {
    return await getAllGroupFolders();
  });
  ipcMain.handle('update-group-folder', async (event, data) => {
    return await updateGroupFolder(data);
  });
  ipcMain.handle('delete-group-folder', async (event, id_group_folder) => {
    return await deleteGroupFolder(id_group_folder);
  });
  ipcMain.handle('get-all-group-notes', async () => {
    return await getAllGroupNotes();
  });
  ipcMain.handle('edit-group-note', async (event, noteData) => {
    return await editGroupNote(noteData);
  });
  ipcMain.handle('remove-group-note', async (event, id_group_note) => {
    return await removeGroupNote(id_group_note);
  });
  ipcMain.handle('register', async (event, data) => {
    return await register(data);
  });
  ipcMain.handle('printReport', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    try {
      const { filePath } = await dialog.showSaveDialog({
        title: 'Save Report as PDF',
        defaultPath: `Transaction.pdf`,
        filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
      })
      if (!filePath) return
      const pdfData = await win.webContents.printToPDF({
        printBackground: true,
        pageSize: 'A4'
      })
      fs.writeFileSync(filePath, pdfData)
      return { success: true, path: filePath }
    } catch (error) {
      console.error('PDF Generation Error:', error)
      return { success: false, error: error.message }
    }
  })
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})