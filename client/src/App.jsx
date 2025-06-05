// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SdgListPage from './pages/sdg/SdgListPage';
import SdgDetailPage from './pages/sdg/SdgDetailPage';
import NewsPage from './pages/NewsPage';
import ProtectedRoute from './components/auth/ProtectedRoute'
import ProfilePage from './pages/user/ProfilePage';
import IndiaHeatmapPage from './pages/insights/IndiaHeatmapPage';
import RedemptionStorePage from './pages/store/RedemptionStorePage';


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
        <Route path="/insights/heatmap" element={<IndiaHeatmapPage />} />
        <Route path="/redeem" element={<RedemptionStorePage />} />


        {/* Protected routes */}
        <Route element={<ProtectedRoute />}> {/* Wrap protected routes */}
          <Route path="/profile" element={<ProfilePage/>} />
          {/* Add other protected routes here, e.g., /dashboard, /settings */}
        </Route>

      </Routes>
    </MainLayout>
  );
}

export default App;