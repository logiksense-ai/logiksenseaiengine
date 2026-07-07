import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Leads } from './pages/Leads';
import { LeadDetail } from './pages/LeadDetail';
import { Signals } from './pages/Signals';
import { Agents } from './pages/Agents';
import { ResearchView } from './components/ResearchView';
import { Campaigns } from './pages/Campaigns';
import { LinkedIn } from './pages/LinkedIn';
import { Scraper } from './pages/Scraper';
import { AuditLog } from './pages/AuditLog';
import { Sequences } from './pages/Sequences';
import { Inbox } from './pages/Inbox';
import { Pipeline } from './pages/Pipeline';
import { Compliance } from './pages/Compliance';
import { Login } from './pages/Login';

function App() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (!isLoggedIn) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/leads/:id" element={<LeadDetail />} />
            <Route path="/research" element={<ResearchView />} />
            <Route path="/scraper" element={<Scraper />} />
            <Route path="/signals" element={<Signals />} />
            
            {/* Execution / Marketing */}
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/sequences" element={<Sequences />} />
            <Route path="/inbox" element={<Inbox />} />
            
            {/* Sales */}
            <Route path="/linkedin" element={<LinkedIn />} />
            <Route path="/pipeline" element={<Pipeline />} />
            
            {/* System */}
            <Route path="/agents" element={<Agents />} />
            <Route path="/audit" element={<AuditLog />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
