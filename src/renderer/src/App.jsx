import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DashboardCustomer from './components/dashboardCustomer'
import Detail from './components/detail'
import AddFolder from './components/addFolder'
import ViewFolder from './components/viewFolder'
import Login from './components/login'
import FolderDetail from './components/folderDetail'
import Logout from './components/logout'
import AdminPage from './components/admin'
import DetailUser from './components/detailUser'
import FolderPage from './components/folders'
import DetailFolder from './components/detailFolder'
import AddPage from './components/add'
import NotePage from './components/note'
import NoteDetails from './components/noteDetails'
import GrupPage from './components/grup'
import AddGrup from './components/addGrup'
import AddMember from './components/addMember'
import GrupDetail from './components/grupDetail'
import AddGrupNote from './components/addGrupNote'
import GrupNoteDetail from './components/grupNoteDetail'
import AdminGrupPage from './components/adminGrup'
import AdminGrupDetail from './components/adminGrupDetail'
import AdminGrupNotePage from './components/adminGrupNote'
import AdminGrupNoteDetail from './components/adminGrupNoteDetail'
import Register from './components/register'
import Landing from './components/landing';
function App() {
  return (
    <Router>
      <Routes>
         <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardCustomer />} />
        <Route path="/detail/:judul" element={<Detail />} />
        <Route path="/addFolder" element={<AddFolder />} />
        <Route path="/view-folder" element={<ViewFolder />} />
        <Route path="/folder-detail/:id_folder" element={<FolderDetail />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/folders" element={<FolderPage />} />
        <Route path="/detail-user" element={<DetailUser />} />
        <Route path="/detail-folder" element={<DetailFolder />} />
        <Route path="/add" element={<AddPage />} />
        <Route path="/notes" element={<NotePage />} />
        <Route path="/note-detail" element={<NoteDetails />} />
        <Route path="/grup" element={<GrupPage />} />
        <Route path="/addGrup" element={<AddGrup />} />
        <Route path="/addMember" element={<AddMember />} />
        <Route path="/grup-detail/:id_group_folder" element={<GrupDetail />} />
        <Route path="/addGrupNote" element={<AddGrupNote />} />
        <Route path="/group-note-detail/:id_group_folder/:id_group_note" element={<GrupNoteDetail />} />
        <Route path="/admin-grup" element={<AdminGrupPage />} />
        <Route path="/admin-grup-detail" element={<AdminGrupDetail />} />
        <Route path="/admin-grup-note" element={<AdminGrupNotePage />} />
        <Route path="/admin-group-note-detail" element={<AdminGrupNoteDetail />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  )
}
export default App