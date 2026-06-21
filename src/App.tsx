import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { ConsolePage } from './pages/Console';
import { PlayersPage } from './pages/Players';
import { SettingsPage } from './pages/Settings';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#1A1A2E]">
        <Sidebar />
        <main className="ml-56 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/console" element={<ConsolePage />} />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
