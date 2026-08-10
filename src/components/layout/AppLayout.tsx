import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

export function AppLayout() {
  return (
    <div className="min-h-screen max-w-lg mx-auto bg-gradient-to-br from-pink-50 via-white to-purple-50 relative">
      <Header />
      <main className="pb-24 px-4 pt-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
