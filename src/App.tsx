import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import DashboardPage from './pages/DashboardPage';
import PlanPage from './pages/PlanPage';
import WorkoutPage from './pages/WorkoutPage';
import NutritionPage from './pages/NutritionPage';
import RestPage from './pages/RestPage';
import NotFoundPage from './pages/NotFoundPage';
import { getTodayISO } from './utils/date';

export default function App() {
  const today = getTodayISO();

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/plan" element={<PlanPage />} />
        <Route path="/workout" element={<Navigate to={`/workout/${today}`} replace />} />
        <Route path="/workout/:date" element={<WorkoutPage />} />
        <Route path="/nutrition" element={<Navigate to={`/nutrition/${today}`} replace />} />
        <Route path="/nutrition/:date" element={<NutritionPage />} />
        <Route path="/rest" element={<Navigate to={`/rest/${today}`} replace />} />
        <Route path="/rest/:date" element={<RestPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AppShell>
  );
}