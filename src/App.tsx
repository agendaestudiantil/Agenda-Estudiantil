import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { TaskProvider } from '@/context/TaskContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuthPage } from '@/pages/AuthPage';
import { HomePage } from '@/pages/HomePage';
import { TasksPage } from '@/pages/TasksPage';
import { CalendarPage } from '@/pages/CalendarPage';
import { AddPage } from '@/pages/AddPage';
import { MessagesPage } from '@/pages/MessagesPage';
import { ProfilePage } from '@/pages/ProfilePage';

function AppGate() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <p className="text-gray-500 animate-pulse">Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <TaskProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/tareas" element={<TasksPage />} />
            <Route path="/calendario" element={<CalendarPage />} />
            <Route path="/agregar" element={<AddPage />} />
            <Route path="/mensajes" element={<MessagesPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TaskProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppGate />
    </AuthProvider>
  );
}
