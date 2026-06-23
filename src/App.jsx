import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import TaskCreate from './pages/TaskCreate.jsx'
import TaskHistory from './pages/TaskHistory.jsx'
import TaskDetails from './pages/TaskDetails.jsx'
import Agents from './pages/Agents.jsx'
import Apps from './pages/Apps.jsx'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './auth/ProtectedRoute.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks/new" element={<TaskCreate />} />
        <Route path="/tasks" element={<TaskHistory />} />
        <Route path="/tasks/:id" element={<TaskDetails />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/apps" element={<Apps />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
