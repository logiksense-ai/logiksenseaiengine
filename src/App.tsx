import React from 'react';
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

function App() {
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
            <Route path="/signals" element={<Signals />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/linkedin" element={<LinkedIn />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
