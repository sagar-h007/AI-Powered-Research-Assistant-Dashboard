import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Dashboard from './pages/Dashboard';
import ProjectView from './pages/ProjectView';
import Layout from './components/layout/Layout';

function App() {
  return (
    <Routes>
      {/* Public Routes wrapped in Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="project/:projectId" element={<ProjectView />} />
      </Route>
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
