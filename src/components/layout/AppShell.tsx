import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { getTodayISO } from '../../utils/date';

export default function AppShell({ children }: { children: ReactNode }) {
  const today = getTodayISO();

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <div className="brand-mark">GH</div>
          <div>
            <div className="brand-title">GymHelper</div>
          </div>
        </div>
        <nav className="app-nav">
          <NavLink to="/" end className="nav-link">
            Дашборд
          </NavLink>
          <NavLink to="/plan" className="nav-link">
            План
          </NavLink>
          <NavLink to={`/workout/${today}`} className="nav-link">
            Тренировка
          </NavLink>
          <NavLink to={`/nutrition/${today}`} className="nav-link">
            Питание
          </NavLink>
          <NavLink to={`/rest/${today}`} className="nav-link">
            Отдых
          </NavLink>
        </nav>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}
