import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './AdminLayout'
import { RequireAuth } from './RequireAuth'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { PostEditPage } from './pages/PostEditPage'
import { PostsPage } from './pages/PostsPage'
import { ProfilePage } from './pages/ProfilePage'
import { ProjectEditPage } from './pages/ProjectEditPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { SettingsPage } from './pages/SettingsPage'
import { SkillsPage } from './pages/SkillsPage'

export function AdminApp() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/new" element={<ProjectEditPage />} />
          <Route path="projects/:id/edit" element={<ProjectEditPage />} />
          <Route path="posts" element={<PostsPage />} />
          <Route path="posts/new" element={<PostEditPage />} />
          <Route path="posts/:id/edit" element={<PostEditPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}
