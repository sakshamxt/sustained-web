// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SdgListPage from './pages/sdg/SdgListPage';
import SdgDetailPage from './pages/sdg/SdgDetailPage';
import NewsPage from './pages/NewsPage';
import NewsDetailPage from './pages/NewsDetailPage';
import ProtectedRoute from './components/auth/ProtectedRoute'
import ProfilePage from './pages/user/ProfilePage';
import EnrolledCoursesPage from './pages/user/EnrolledCoursesPage';
import IndiaHeatmapPage from './pages/insights/IndiaHeatmapPage';
import RedemptionStorePage from './pages/store/RedemptionStorePage';

import AdminProtectedRoute from './components/auth/AdminProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUserManagementPage from './pages/admin/AdminUserManagementPage';
import AdminSdgManagementPage from './pages/admin/sdg/AdminSdgManagementPage';
import AdminCreateSdgPage from './pages/admin/sdg/AdminCreateSdgPage';
import AdminEditSdgPage from './pages/admin/sdg/AdminEditSdgPage';
import AdminNewsManagementPage from './pages/admin/news/AdminNewsManagementPage';
import AdminCreateNewsPage from './pages/admin/news/AdminCreateNewsPage';
import AdminEditNewsPage from './pages/admin/news/AdminEditNewsPage';
import AdminAnalyticsPage from './pages/admin/analytics/AdminAnalyticsPage';
import AdminNotableStreaksPage from './pages/admin/streaks/AdminNotableStreaksPage';
import AdminStoreManagementPage from './pages/admin/store/AdminStoreManagementPage';


const NotFoundPage = () => <div className="py-10 text-center"></div>

function App() {

  return (
    <MainLayout>
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/sdgs" element={<SdgListPage />} />
        <Route path="/sdgs/:idOrNumber" element={<SdgDetailPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:newsId" element={<NewsDetailPage />} />
        <Route path="/insights/heatmap" element={<IndiaHeatmapPage />} />
        <Route path="/redeem" element={<RedemptionStorePage />} />


        {/* Protected routes */}
        <Route element={<ProtectedRoute />}> {/* Wrap protected routes */}
          <Route path="/profile" element={<ProfilePage/>} />
          <Route path="/my-courses" element={<EnrolledCoursesPage />} />
          {/* Add other protected routes here, e.g., /dashboard, /settings */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>


        {/* Admin Routes with AdminLayout and AdminProtectedRoute */}
      <Route path="/admin" element={
        <AdminProtectedRoute>
          <AdminLayout /> 
        </AdminProtectedRoute>
      }>
        <Route index element={<AdminDashboardPage />} /> {/* /admin will render dashboard */}
        <Route path="users" element={<AdminUserManagementPage />} /> {/* /admin/users */}
        
        {/* SDG Management Routes */}
        <Route path="sdgs" element={<AdminSdgManagementPage />} />
        <Route path="sdgs/new" element={<AdminCreateSdgPage />} />
        <Route path="sdgs/edit/:sdgId" element={<AdminEditSdgPage />} />

        {/* News Management Routes */}
        <Route path="news" element={<AdminNewsManagementPage />} />
        <Route path="news/new" element={<AdminCreateNewsPage />} />
        <Route path="news/edit/:newsId" element={<AdminEditNewsPage />} />

        {/*    */}
        <Route path="streaks" element={<AdminNotableStreaksPage />} />
        <Route path="store" element={<AdminStoreManagementPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      </Routes>
    </MainLayout>
  );
}

export default App;